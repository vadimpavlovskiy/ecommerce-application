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
        'discounted_price' => MoneyCast::class,
        'custom_properties' => 'array',
    ];
    protected $fillable = [
        'name', 
        'description', 
        'sku', 
        'length', 
        'width',
        'height', 
        'sleeping_area_length', 'sleeping_area_width', 
        'price', 
        'discounted_price', 
        'thumbnail',
        'image',
        'custom_properties'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
    

    

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            unset($model->is_discount);
        });
    }


}
