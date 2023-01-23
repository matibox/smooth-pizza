<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
      'payment',
      'price',
      'street',
      'house_number',
      'city',
      'apartment_number',
      'user_id'
    ];

    public function products() {
      return $this->belongsToMany(Product::class)->withPivot('amount');
    } 

    public function user() {
      return $this->belongsTo(User::class);
    }
}
