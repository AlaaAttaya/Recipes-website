<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Follower;
use App\Models\Post;
use App\Models\Like;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{

  

    public function unauthorized(Request $request)
    {
        return response()->json([
            'status' => 'Error',
            'message' => 'Unauthorized',
        ], 401);
    }



    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'Success',
            'data' => Auth::user(),
        ], 200);
    }

  public function login(Request $request)
{
    $request->validate([
        'identifier' => 'required|string', 
        'password' => 'required|string',
    ]);

    $field = filter_var($request->identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
    $credentials = [
        'password' => $request->password,
        $field => $request->identifier,
    ];

    $token = Auth::attempt($credentials);

    if (!$token) {
       return $this->unauthorized(); 
    }

    $user = Auth::user();
    $user->token = $token;

    return response()->json([
        'status' => 'Success',
        'data' => $user
    ]);
}


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);

        $user = new User;
        

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public/images');
            $image_path  = "/storage".str_replace('public', '', $imagePath);
        }else {
            
            $image_path = '/storage/images/profilepic.png';
            
        }

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->image=$image_path;
     
        $user->save();

        $token = Auth::login($user);
        $user->token = $token;
        

        return response()->json([
            'status' => 'Success',
            'data' => $user
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        $user = Auth::user();
        $user->token = Auth::refresh();

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function getAllUsers($id = null)
    {
        if ($id !== null) {
            $user = User::find($id);
    
            if (!$user) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'User not found',
                ], 404);
            }
    
            return response()->json([
                'status' => 'Success',
                'data' => $user,
            ]);
        }
    
        $users = User::all();
    
        return response()->json([
            'status' => 'Success',
            'data' => $users,
        ]);
    }

    public function createPost(Request $request)
    {
        $user = Auth::user();
    
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
            'description' => 'nullable|string',
        ]);
    
      
        $post = new Post();
        $post->user_id = $user->id;
        $post->description = $request->input('description');

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public/posts/posts_'.$user->id);
            $image_Path = "/storage" . str_replace('public', '', $imagePath);
            $post->image_url = $image_Path;
        }
    

        $post->save();
    
        return response()->json([
            'status' => 'Success',
            'data' => $post,
        ]);
    }


    public function likePost($postId)
    {
        $user = Auth::user();
        $post = Post::find($postId);
    
        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }
    
        
        $existingLike = Like::where('user_id', $user->id)
                             ->where('post_id', $postId)
                             ->first();
    
        if ($existingLike) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post already liked',
            ], 400);
        }
    
        $post->likes_count += 1;
        $post->save();
    
        $like = new Like();
        $like->user_id = $user->id;
        $like->post_id = $postId;
        $like->save();
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Post liked.',
            'data' => $post,
        ]);
    }
    
    public function unlikePost($postId)
    {
        $user = Auth::user();
        $post = Post::find($postId);
        $existingLike = Like::where('user_id', $user->id)
        ->where('post_id', $postId)
        ->first();

        if (!$existingLike) {
        return response()->json([
        'status' => 'Error',
        'message' => 'Post already Unliked',
        ], 400);
        }

        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }
    
       
        $post->likes_count -= 1;
        $post->save();
    
      
        Like::where('user_id', $user->id)->where('post_id', $postId)->delete();
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Post unliked.',
            'data' => $post,
        ]);
    }

    public function getPostsForUser()
    {
        $loggedInUser = Auth::user();

        if (!$loggedInUser) {
            return $this->unauthorized();
        }

    
        $posts = Post::with('userData')->where('user_id', $loggedInUser->id)->get();

        return response()->json([
            'status' => 'Success',
            'data' => $posts,
        ]);
    }







    
}
