<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
      'street',
      'houseNumber',
      'city',
      'apartmentNumber'
    ];

    public function order() {
      return $this->hasOne(Order::class);
    }
}
