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
use App\Models\Recipe;

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
            $imagePath = $request->file('image')->store('public/images/u_'.$user->id.'_'.$request->username);
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

    public function getAllUsers(Request $request)
    {
        $searchUsername=$request->username;
        if ($searchUsername !== null) {
            $users = User::where('username', 'like', '%' . $searchUsername . '%')->get();
        } else {
            $users = [];
        }

        return response()->json([
            'status' => 'Success',
            'data' => $users,
        ]);
    }


    //Recipes

    
    public function createRecipe(Request $request)
    {
        $user = Auth::user();

        
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'cuisine' => 'required|string|max:50',
            'image_url' => 'image|mimes:jpeg,png,jpg|max:2048', 
            'ingredients' => 'required|json', 
        ]);
        $image= $request->image_url;
    
        if ($image) {
            $imagePath = $image->store('public/images/u_' . $user->id . '_' . $user->username.'/recipes');
            $image_path= "/storage" . str_replace('public', '', $imagePath);
        } else {
            $image_path= '/storage/images/profilepic.png';
        }

     
        $recipe = new Recipe();
        $recipe->name = $validatedData['name'];
        $recipe->cuisine = $validatedData['cuisine'];
        $recipe->image_url = $image_path;
        $recipe->user_id = $user->id;
        $recipe->ingredients = $validatedData['ingredients']; 
        $recipe->save();
      
        return response()->json(['message' => 'Recipe created successfully', 'recipe' => $recipe], 201);
    }

    
    public function updateRecipe(Request $request )
    {$recipe_id = $request->recipe_id; 
        $user = Auth::user();
        $recipe = Recipe::find($recipe_id);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

     

       
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'cuisine' => 'required|string|max:50',
            'image_url' => 'image|mimes:jpeg,png,jpg|max:2048',
            'ingredients' => 'required|json', 
        ]);

        $image=$request->image_url;
      
        if ($image) {
            $imagePath = $image->store('public/images/u_' . $user->id . '_' . $user->username.'/recipes');
            $image_path= "/storage" . str_replace('public', '', $imagePath);
        } else {
            $image_path= '/storage/images/profilepic.png';
        }

        $recipe->name = $request->name;
        $recipe->cuisine = $request->cuisine;
        $recipe->image_url = $image_path;
        
        $recipe->ingredients = $request->ingredients; 
        $recipe->save();
       
     

        return response()->json(['message' => 'Recipe updated successfully', 'recipe' => $recipe]);
    }


  
    public function removeRecipe(Request $request)
    {  $recipe_id = $request->recipe_id; 
        $user = Auth::user();
        $recipe = Recipe::find($recipe_id);

        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found'], 404);
        }

        
        if ($user->id !== $recipe->user_id) {
            return unauthorized();
        }

        $recipe->delete();

        return response()->json(['message' => 'Recipe removed successfully']);

    }


    public function getUserRecipes(Request $request)
    {
        $user = Auth::user();
        $recipes = $user->recipes()->withCount('likes')->with('comments')->get();
        return response()->json(['recipes' => $recipes]);
    }

    public function likeRecipe(Request $request)
    {   $recipe_id = $request->recipe_id; 
        $user = Auth::user();

       
        $existingLike = Like::where('user_id', $user->id)
            ->where('recipe_id', $recipe_id)
            ->first();

        if ($existingLike) {
            return response()->json(['message' => 'Recipe already liked'], 400);
        }

       
        $like= new Like;
        $like->user_id= $user->id;
        $like->recipe_id = $recipe_id;
        $like->save();

        return response()->json(['likesCount' => $recipe->likes->count()]);
    }

    public function unlikeRecipe(Request $request)
    {  $recipe_id = $request->recipe_id; 
        $user = Auth::user();

     
        $existingLike = Like::where('user_id', $user->id)
            ->where('recipe_id', $recipe_id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $recipe = Recipe::withCount('likes')->find($recipe_id);
            return response()->json(['message' => 'Recipe unliked', 'likesCount' => $recipe->likes_count]);
        }

        return response()->json(['message' => 'Error: Recipe not liked'], 400);
    }
    public function createComment(Request $request)
    {$recipe_id = $request->recipe_id; 
        $user = Auth::user();
        $comment = new Comment();

        $comment->body = $request->input('body');
        $comment->user_id = $user->id;
        $comment->recipe_id = $request->input('recipe_id');

        $comment->save();

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment],200);
    }

}
