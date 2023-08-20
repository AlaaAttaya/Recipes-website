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

  //User

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
            return response()->json(['message' => 'Recipe not found']);
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
            return response()->json(['message' => 'Recipe not found']);
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
            return response()->json(['message' => 'Recipe already liked']);
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

        return response()->json(['message' => 'Error: Recipe not liked']);
    }



    public function createComment(Request $request)
    {   $recipe_id = $request->recipe_id; 
        $user = Auth::user();
        $comment = new Comment();

        $comment->body = $request->body;
        $comment->user_id = $user->id;
        $comment->recipe_id = $request->recipe_id;

        $comment->save();

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment],200);
    }
    
    public function deleteComment(Request $request, $comment_id)
    {
        $user = Auth::user();
        $comment = Comment::find($comment_id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found']);
        }

       
        if ($user->id !== $comment->user_id) {
            return unauthorized();
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }


    
//Shopping List

    public function createShoppingList(Request $request)
    {
        $user = Auth::user();
        
        $shoppingList = new ShoppingList();
        $shoppingList->name = $request->name;
        $shoppingList->user_id = $user->id;
        $shoppingList->save();

        return response()->json(['message' => 'Shopping list created successfully', 'shoppingList' => $shoppingList]);
    }

    public function removeShoppingList(Request $request)
    {
        $user = Auth::user();
        $shoppingListId = $request->shoppingListId;

        $shoppingList = ShoppingList::find($shoppingListId);
        if (!$shoppingList) {
            return response()->json(['message' => 'Shopping List not found']);
        }
    

        if ($shoppingList->user_id !== $user->id) {
            return unauthorized();
        }

        $shoppingList->delete();

        return response()->json(['message' => 'Shopping list removed successfully']);
    }


    public function addRecipeShoppingList(Request $request)
    {  
        $user = Auth::user();
        $recipeId = $request->recipe_id;
        
      
        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found']);
        }
    
        if ($user->shoppingLists->contains($recipeId)) {
            return response()->json(['message' => 'Recipe already in shopping list']);
        }
        
        $user->shoppingLists()->attach($recipeId);
    
        return response()->json(['message' => 'Recipe added to shopping list','shoppingList' => $updatedShoppingList]);
    }

    public function removeRecipeShoppingList(Request $request)
    {  
        $user = Auth::user();
        $recipe_id = $request->recipe_id; 
        
        
        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found']);
        }
    

        $user->shoppingLists()->detach($recipeId);

        return response()->json(['message' => 'Recipe removed from shopping list']);
    }


//Meal Planner
    public function createMealPlan(Request $request)
    {
        $user = Auth::user();

        $mealPlan = new MealPlan;
    
        $mealPlan->name = $request->name;
        $mealPlan->user_id = $user->id;
    
        $mealPlan->save();

        return response()->json(['message' => 'Meal plan created successfully', 'mealPlan' => $mealPlan]);
    }

        public function addDayToMealPlan(Request $request)
    {  
        $mealPlanId=$request->mealPlanId;
        $user = Auth::user();

        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if(!$mealPlan){

            return response()->json(['message' => 'Meal Plan not found']);
        }

        $day = new Day;
        $day->name = $request->name;
        $mealPlan->days()->save($day);

        return response()->json(['message' => 'Day added to meal plan', 'day' => $day]);
    }

        public function addRecipesToDay(Request $request)
    {
        $user = Auth::user();
        $mealPlanId=$request->mealPlanId;
        $dayId=$request->dayId;

        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if(!$mealPlan){
            return response()->json(['message' => 'Meal Plan not found']);
        }

        $day = $mealPlan->days()->find($dayId);

        if(!$day){
            return response()->json(['message' => 'Day not found']);
        }

        $recipeIds = $request->recipe_id; 

        $day->recipes()->sync($recipeIds);

        return response()->json(['message' => 'Recipes added to day', 'day' => $day]);
    }
        public function getMealPlans(Request $request)
    {
        $user = Auth::user();

        $mealPlans = $user->mealPlans()->with('days.recipes')->get();

        return response()->json(['mealPlans' => $mealPlans]);
    }
    
        public function removeRecipeFromDay(Request $request)
    {
        $user = Auth::user();
        $mealPlanId=$request->mealPlanId;
        $dayId=$request->dayId;
        $recipeId=$request->reecipeId;

        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if(!$mealPlan){
            return response()->json(['message' => 'Meal Plan not found']);
        }

        $day = $mealPlan->days()->find($dayId);

         if(!$day){
            return response()->json(['message' => 'Day not found']);
        }

        $day->recipes()->detach($recipeId);

        return response()->json(['message' => 'Recipe removed from day']);
    }
        public function deleteMealPlan(Request $request)
    {
        $user = Auth::user();
        $mealPlanId=$request->mealPlanId;
        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if(!$mealPlan){
             return response()->json(['message' => 'Meal Plan not found']);
        }
        
        $mealPlan->delete();

        return response()->json(['message' => 'Meal plan deleted']);
    }

}
