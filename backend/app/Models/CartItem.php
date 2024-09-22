<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CartItem extends Model
{
    use HasFactory;

    public function sku(): BelongsTo {
        return $this->belongsTo(Sku::class);
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'cart_item_features');
    }

    public function getTotalPriceAttribute() {
        $price = $this->sku->price; // Start with the SKU's base price
        if ($this->sku->discounted_price) {
            $price = $this->sku->discounted_price;
        }
        foreach ($this->features as $feature) {
            $price += $feature->price; // Modify price based on features
        }
        return $price * $this->quantity; // Include quantity in the calculation
    }
}
