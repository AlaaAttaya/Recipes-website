<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{ 
    public function up()
    {
        Schema::create('days', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('meal_plan_id'); 
            $table->timestamps();

            $table->foreign('meal_plan_id')->references('id')->on('meal_plans')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('days');
    }
};
