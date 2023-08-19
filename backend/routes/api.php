<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::group(["middleware" => "auth:api"], function () {
    Route::group(["prefix" => "user"], function () {
        Route::get("profile", [AuthController::class, "profile"]);
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);

        Route::get("search/{id?}", [AuthController::class, "getAllUsers"]);
        Route::post("create-post", [AuthController::class, "createPost"]);
        Route::get("posts", [AuthController::class, "getPostsForUser"]);
        Route::post("add-following", [AuthController::class, "addFollowing"]);
        Route::post("remove-following", [AuthController::class, "removeFollowing"]);
        Route::get("followers", [AuthController::class, "getFollowers"]);
        Route::get("following", [AuthController::class, "getFollowing"]);
        Route::get("posts-for-following", [AuthController::class, "getPostsForFollowing"]);
        Route::post("like-post/{postId}", [AuthController::class, "likePost"]);
        Route::post("unlike-post/{postId}", [AuthController::class, "unlikePost"]);

        
    });
});


Route::group(["prefix" => "guest"], function () {
    
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
   
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);
});