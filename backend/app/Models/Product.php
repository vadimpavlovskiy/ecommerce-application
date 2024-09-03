<?php

namespace App\Models;

use App\Casts\MoneyCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @method static where(string $string, string $string1)
 * @method static create(array $array)
 */
class Product extends Model
{
    use HasFactory;

     protected $casts = [
         'custom_properties' => 'array',
     ];
    protected $fillable = [
        "name",
        "slug",
        "description",
        "length",
        "width",
        "height",
        "thumbnail"
    ];
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function skus(): HasMany
    {
        return $this->hasMany(Sku::class);
    }

    public function attributeOptions(): HasManyThrough
    {
        return $this->hasManyThrough(
            AttributeOption::class,
            Sku::class,
            'product_id', // Foreign key on Sku table
            'id', // Foreign key on AttributeOption table
            'id', // Local key on Product table
            'attribute_option_id' // Local key on Sku table
        );
    }

    public function images(): HasManyThrough {
        return $this->hasManyThrough(
            Image::class,
            Sku::class,
            'product_id',
            'id',
            'id',
            'image_id'
        );
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class);
    }


    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            unset($model->is_discount);
        });
    }


}
