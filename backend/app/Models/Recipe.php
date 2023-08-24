<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cuisine',
        
        'user_id',
    
    ];
    protected $appends = ['user_liked'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->with('user'); 
    }

    public function shoppingLists()
    {
        return $this->belongsToMany(ShoppingList::class);
    }
    public function images()
    {
        return $this->hasMany(RecipeImages::class);
    }
    public function ingredients()
    {
        return $this->hasMany(Ingredient::class);
    }
   
    public function getUserLikedAttribute()
    {
        $user = auth()->user();
        if (!$user) {
            return false;
        }

        return $this->likes()->where('user_id', $user->id)->exists();
    }

   
}
