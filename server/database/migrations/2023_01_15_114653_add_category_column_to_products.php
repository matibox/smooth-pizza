<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCategoryColumnToProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('pizzas');
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['pizza', 'sauce', 'cold-drinks', 'hot-drinks', 'beer', 'wine'])->default('pizza');
            $table->string('name');
            $table->string('slug');
            $table->string('description');
            $table->decimal('price', 5, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
        Schema::create('pizzas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('description');
            $table->decimal('price', 5, 2);
            $table->timestamps();
        });
    }
}
