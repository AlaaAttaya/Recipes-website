<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DayRecipe extends Model
{
    use HasFactory;
    protected $table = 'day_recipe'; 

    protected $fillable = [
        'day_id',
        'recipe_id',
    ];
}
