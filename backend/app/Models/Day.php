<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Day extends Model
{
    use HasFactory;
    public function mealPlan()
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function recipes()
    {
        return $this->belongsToMany(Recipe::class, 'day_recipe');
    }
    
    
}
