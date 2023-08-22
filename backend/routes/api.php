<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group(["middleware" => "auth:api"], function () {
    Route::group(["prefix" => "user"], function () {

        Route::get("profile", [AuthController::class, "profile"]);
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);
        Route::get("search", [AuthController::class, "getAllUsers"]);
        Route::get("searchbyname", [AuthController::class, "searchByName"]);
        Route::get("searchbycuisine", [AuthController::class, "searchByCuisine"]);
        Route::get("searchbyingredients", [AuthController::class, "searchByIngredients"]);
        Route::post('editprofile', [AuthController::class, "editProfile"]);
        Route::post('changepassword',  [AuthController::class, "changePassword"]);


        Route::post("createrecipe", [AuthController::class, "createRecipe"]);
        Route::get("getrecipes", [AuthController::class, "getUserRecipes"]);
        Route::get("getallrecipes", [AuthController::class, "getAllRecipes"]);
        Route::post('updaterecipe', [AuthController::class, 'updateRecipe']);
        Route::delete('deleterecipe', [AuthController::class, 'removeRecipe']);

        Route::post('like', [AuthController::class, 'likeRecipe']);
        Route::delete('unlike', [AuthController::class, 'unlikeRecipe']);

        Route::post('comment', [AuthController::class, 'createComment']);
        Route::delete('deletecomment', [AuthController::class, 'deleteComment']);

           
        Route::post('create-shopping-list', [AuthController::class, 'createShoppingList']);
        Route::get("get-shopping-list", [AuthController::class, "getUserShoppingList"]);
        Route::delete('delete-shopping-list', [AuthController::class, 'removeShoppingList']);
        Route::post('shopping-lists/add-recipe',  [AuthController::class, 'addrecipeShoppingList']);
        Route::delete('shopping-lists/remove-recipe', [AuthController::class, 'removerecipeShoppingList']);


        Route::post('create-meal-plan', [AuthController::class, 'createMealPlan']);
        Route::get('get-meal-plan', [AuthController::class, 'getMealPlans']);
        Route::delete('delete-meal-plan',  [AuthController::class, 'deleteMealPlan']);
        Route::post('meal-plans/add-day',  [AuthController::class, 'addDayToMealPlan']);
        Route::delete('meal-plans/delete-day', [AuthController::class, 'deleteDayFromMealPlan']);
        Route::post('meal-plans/add-recipe-to-day',  [AuthController::class, 'addRecipeToDay']);
        Route::delete('meal-plans/remove-recipe-from-day', [AuthController::class, 'removeRecipeFromDay']);
       

    });

});


Route::group(["prefix" => "guest"], function () {
    
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);

});