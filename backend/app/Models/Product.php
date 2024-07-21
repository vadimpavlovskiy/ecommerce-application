<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'sku', 'length', 'width', 'height', 'sleeping_area_length', 'sleeping_area_width', 'price', 'discounted_price', 'description'
    ];

}
