<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecipeImages extends Model
{
    use HasFactory;
    protected $table = 'recipe_images';
    protected $fillable = ['recipe_id', 'image_url'];
    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }
    
}
