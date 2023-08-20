<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingList extends Model
{
    use HasFactory;
 
    public function recipes()
    {
        return $this->belongsToMany(Recipe::class);
    }

    public function shoppingLists()
    {
        return $this->belongsToMany(ShoppingList::class);
    }
}
