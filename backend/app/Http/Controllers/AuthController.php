<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Like;
use App\Models\Recipe;
use App\Models\Comment;
use App\Models\MealPlan;
use App\Models\Day;
use App\Models\ShoppingList;
use App\Models\RecipeShoppingList;
use App\Models\RecipeImages;
use App\Models\Ingredient;


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

        public function editProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public/images/u_'.$user->id.'_'.$request->username);
            $image_path = "/storage".str_replace('public', '', $imagePath);
        } else {
            $image_path = $user->image; 
        }

        $user->name = $request->name;
        $user->username = $request->username;
        $user->image = $image_path;

        $user->save();

        return response()->json([
            'status' => 'Success',
            'data' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'oldpassword' => 'required|string',
            'newpassword' => 'required|string|min:8',
        ]);

        if (!Hash::check($request->oldpassword, $user->password)) {
            return response()->json(['message' => 'Incorrect old password']);
        }

        $user->password = Hash::make($request->newpassword);
        $user->save();

        return response()->json([
        
            'message' => 'Password changed successfully'
        ]);
    }


    
    //Recipes

    
    public function createRecipe(Request $request)
    {
        $user = Auth::user();
    
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'cuisine' => 'required|string|max:50',
            'image_urls.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'ingredients.*' => 'required|string',
        ]);
    
        $recipe = new Recipe();
        $recipe->name = $request->name;
        $recipe->cuisine = $request->cuisine;
        $recipe->user_id = $user->id;
        $recipe->save();
        foreach ($request->ingredients as $ingredientJson) {
            $ingredientData = json_decode($ingredientJson, true);
        
           
                $newIngredient = new Ingredient();
                $newIngredient->name = $ingredientData['name'];
                $newIngredient->amount = $ingredientData['amount'];
                $recipe->ingredients()->save($newIngredient);
            
        }
    
        if ($request->hasFile('image_urls')) {
            foreach ($request->file('image_urls') as $image) {
                $imagePath = $image->store('public/images/u_' . $user->id . '_' . $user->username . '/recipes');
                $image_path = "/storage" . str_replace('public', '', $imagePath);
    
                $recipeImage = new RecipeImages();
                $recipeImage->image_url = $image_path;
                $recipe->images()->save($recipeImage);
            }
        }
    
        return response()->json(['message' => 'Recipe created successfully', 'recipe' => $recipe]);
    }
    

    public function updateRecipe(Request $request)
    {
        $user = Auth::user();
        $recipe_id = $request->recipe_id;
        $recipe = Recipe::find($recipe_id);
    
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found']);
        }
    
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'cuisine' => 'required|string|max:50',
            'image_urls.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'ingredients.*' => 'required|array',
        ]);
    
        $recipe->name = $request->name;
        $recipe->cuisine = $request->cuisine;
        $recipe->save();
    
        $recipe->ingredients()->delete();
        foreach ($request->ingredients as $ingredient) {
            $newIngredient = new Ingredient();
            $newIngredient->name = $ingredient['name'];
            $newIngredient->amount = $ingredient['amount'];
            $recipe->ingredients()->save($newIngredient);
        }
    
        if ($request->hasFile('image_urls')) {
            $recipe->images()->delete();
    
            foreach ($request->file('image_urls') as $image) {
                $imagePath = $image->store('public/images/u_' . $user->id . '_' . $user->username . '/recipes');
                $image_path = "/storage" . str_replace('public', '', $imagePath);
    
                $recipeImage = new RecipeImages();
                $recipeImage->image_url = $image_path;
                $recipe->images()->save($recipeImage);
            }
        } else {
            $recipe->images()->delete();
        }
    
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
        $recipes = $user->recipes()->withCount('likes')->withCount('comments')->with('comments', 'images','ingredients')->get();
        return response()->json(['recipes' => $recipes , 'user' => $user]);
    }
    
    public function getAllRecipes(Request $request)
    {
        $perPage = $request->query('per_page', 10); 
        $recipes = Recipe::withCount('likes')->with('comments', 'images', 'user','ingredients')
                          ->paginate($perPage);
    
        return response()->json(['recipes' => $recipes]);
    }

    public function likeRecipe(Request $request)
    {   $recipe_id = $request->recipe_id; 
        $user = Auth::user();

       
        $existingLike = Like::where('user_id', $user->id)
            ->where('recipe_id', $recipe_id)
            ->first();

        if ($existingLike) {
            $recipe = Recipe::withCount('likes')->find($recipe_id);
            return response()->json(['message' => 'Recipe already liked','likesCount' => $recipe->likes->count()]);
        }

       
        $like= new Like;
        $like->user_id= $user->id;
        $like->recipe_id = $recipe_id;
        $like->save();

        $recipe = Recipe::withCount('likes')->find($recipe_id);
        return response()->json(['message' => 'Recipe Liked' , 'likesCount' => $recipe->likes->count()]);
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
            return response()->json(['message' => 'Recipe unliked', 'likesCount' => $recipe->likes->count()]);
        }

        return response()->json(['message' => 'Error: Recipe already unliked']);
    }



    public function createComment(Request $request)
    {   
        $user = Auth::user();
        $comment = new Comment();

        $comment->body = $request->body;
        $comment->user_id = $user->id;
        $comment->recipe_id = $request->recipe_id;

        $comment->save();

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment],200);
    }
    
    public function deleteComment(Request $request)
    {   $comment_id=$request->comment_id; 
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

    public function getUserShoppingList(Request $request)
    {
        $user = Auth::user();
        
        $shoppingLists = $user->shoppingLists;
        
        return response()->json(['shoppingLists' => $shoppingLists]);
    }


    public function removeShoppingList(Request $request)
    {
        $user = Auth::user();
        $shoppingListId = $request->shopping_list_id;

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
        $shoppingListId = $request->shopping_list_id; 
        
        $recipe = Recipe::find($recipeId);
        if (!$recipe) {
            return response()->json(['message' => 'Recipe not found']);
        }

        $shoppingList = ShoppingList::find($shoppingListId); 
        if (!$shoppingList) {
            return response()->json(['message' => 'Shopping List not found']);
        }

        if ($shoppingList->user_id !== $user->id) {
            return unauthorized();
        }

        if ($shoppingList->recipes->contains($recipeId)) {
            return response()->json(['message' => 'Recipe already in shopping list']);
        }
        
        $shoppingList->recipes()->attach($recipeId, ['created_at' => now(), 'updated_at' => now()]); 

        return response()->json(['message' => 'Recipe added to shopping list', 'shoppingList' => $shoppingList]);
    }


    public function removeRecipeShoppingList(Request $request)
    {
        $user = Auth::user();
        $recipeShoppingListId = $request->recipe_shopping_list_id;
    
        $recipeShoppingList = RecipeShoppingList::find($recipeShoppingListId);
    
        if (!$recipeShoppingList) {
            return response()->json(['message' => 'Recipe shopping list not found']);
        }
    
        $shoppingList = $recipeShoppingList->shoppingList;
        if (!$shoppingList || $shoppingList->user_id !== $user->id) {
            return unauthorized();
        }
    
        $recipeShoppingList->delete();
    
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



    public function getMealPlans(Request $request)
    {
        $user = Auth::user();

        $mealPlans = $user->mealPlans()->with('days.recipes')->get();

        return response()->json(['mealPlans' => $mealPlans]);
    }


    public function deleteMealPlan(Request $request)
    {
        $user = Auth::user();
        $mealPlanId=$request->meal_plan_id;
        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if(!$mealPlan){
             return response()->json(['message' => 'Meal Plan not found']);
        }
        
        $mealPlan->delete();

        return response()->json(['message' => 'Meal plan deleted']);
    }




        public function addDayToMealPlan(Request $request)
    {
        $mealPlanId = $request->meal_plan_id;
        $user = Auth::user();

        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if (!$mealPlan) {
            return response()->json(['message' => 'Meal Plan not found']);
        }

        $date = $request->date;
        
        
        $existingDay = $mealPlan->days()->where('date', $date)->first();
        if ($existingDay) {
            return response()->json(['message' => 'Day with the same date already exists']);
        }

        $day = new Day;
        $day->date = $date;
        $mealPlan->days()->save($day);

        return response()->json(['message' => 'Day added to meal plan', 'day' => $day]);
    }




        public function addRecipeToDay(Request $request)
    {
        $user = Auth::user();
        $mealPlanId = $request->meal_plan_id;
        $dayId = $request->day_id;
        $mealType = $request->meal_type; 

        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if (!$mealPlan) {
            return response()->json(['message' => 'Meal Plan not found']);
        }

        $day = $mealPlan->days()->find($dayId);

        if (!$day) {
            return response()->json(['message' => 'Day not found']);
        }

        $recipeId = $request->recipe_id;
        if ($day->recipes->contains($recipeId)) {
            return response()->json(['message' => 'Recipe already in meal plan']);
        }

        if (!$recipeId) {
            return response()->json(['message' => 'Recipe not found']);
        }

        $day->recipes()->attach($recipeId, ['meal_type' => $mealType, 'created_at' => now(), 'updated_at' => now()]);

        return response()->json(['message' => 'Recipes added to day', 'day' => $day]);
    }


        public function removeRecipeFromDay(Request $request)
    {
        $user = Auth::user();
        $mealPlanId=$request->meal_plan_id;
        $dayId=$request->day_id;
        $recipeId=$request->recipe_id;

        $mealPlan = MealPlan::where('user_id', $user->id)->find($mealPlanId);

        if(!$mealPlan){
            return response()->json(['message' => 'Meal Plan not found']);
        }

        $day = $mealPlan->days()->find($dayId);

         if(!$day){
            return response()->json(['message' => 'Day not found']);
        }

        if(!$recipeId){
            return response()->json(['message' => 'Recipe not found']);
        }
        
        if (!$day->recipes->contains($recipeId)) {
            return response()->json(['message' => 'Recipe already deleted.']);
        }

        $day->recipes()->detach($recipeId);

        return response()->json(['message' => 'Recipe removed from day']);
    }


  


}
