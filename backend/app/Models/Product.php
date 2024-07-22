<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $casts = [
        'price' => MoneyCast::class,
        'discounted_price' => MoneyCast::class
    ];
    protected $fillable = [
        'name', 'sku', 'length', 'width', 'height', 'sleeping_area_length', 'sleeping_area_width', 'price', 'discounted_price', 'description'
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            unset($model->is_discount);
        });
    }


}
