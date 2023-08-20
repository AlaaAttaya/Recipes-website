<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeShoppingList extends Model
{
    use HasFactory;
    protected $table = 'recipe_shopping_list'; 
    
    protected $fillable = [
        'recipe_id',
        'shopping_list_id',
        'meal_type'
    ];

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }

    public function shoppingList()
    {
        return $this->belongsTo(ShoppingList::class);
    }

}
