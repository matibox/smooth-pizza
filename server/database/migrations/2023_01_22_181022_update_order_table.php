<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('orders');
        Schema::create('orders', function (Blueprint $table) {
          $table->id();
          $table->timestamps();
          $table->enum('payment', ['BLIK', 'Transfer', 'Visa/Mastercard'])->default('BLIK');
          $table->decimal('price', 8, 2);
          $table->integer('user_id');
          $table->string('street');
          $table->integer('house_number');
          $table->string('city');
          $table->integer('apartment_number')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
        Schema::create('orders', function (Blueprint $table) {
          $table->id();
          $table->timestamps();
          $table->enum('payment', ['BLIK', 'Transfer', 'Visa/Mastercard'])->default('BLIK');
          $table->decimal('price', 8, 2);
          $table->integer('user_id');
        });
    }
}
