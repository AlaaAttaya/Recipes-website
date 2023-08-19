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
        
        Route::post("createrecipe", [AuthController::class, "createRecipe"]);
        Route::get("getrecipes", [AuthController::class, "getUserRecipes"]);
        Route::post('updaterecipe', [AuthController::class, 'updateRecipe']);
        Route::delete('deleterecipe', [AuthController::class, 'removeRecipe']);

        Route::post('like', [AuthController::class, 'likeRecipe']);
        Route::delete('unlike', [AuthController::class, 'unlikeRecipe']);
        
    });

});


Route::group(["prefix" => "guest"], function () {
    
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);

});