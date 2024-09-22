<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use function PHPUnit\Framework\countOf;

/**
 * @method static where()
 */
class Cart extends Model
{
    use HasFactory;

    public function items():HasMany
    {
        return $this->hasMany(CartItem::class);
    }
    public function getTotalPriceAttribute() {
        return $this->items->sum(function ($item) {
            return $item->total_price; // Ensure CartItem has a total_price accessor that considers SKU price and features
        });
    }
    public function addItem($skuId, $features, $quantity) {
        usort($features, fn($a, $b) => $a['id'] <=> $b['id']);

        // $existingFeatures = $this->items()->with('features')->get();
        $existingItem = $this->items()->with('features')->whereHas('sku', function ($query) use ($skuId) {
            $query->where('id', $skuId);
        })->get()->filter(function ($item) use ($features) {
            $existingFeatures = $item->features->pluck('id')->sort()->values()->all();
            $incomingFeatureIds = array_column($features, 'id');
            sort($incomingFeatureIds);
            
            // Check if all incoming features match the existing ones
            return $existingFeatures === $incomingFeatureIds; // Strict comparison of sorted arrays
    
        })->first();
        if ($existingItem) {
            // If item exists, update the quantity
            $existingItem->increment('quantity', $quantity);
        } else {
            // Otherwise, create a new cart item with the specified features
            $item = $this->items()->create([
                'sku_id' => $skuId,
                'quantity' => $quantity
            ]);
            $item->features()->attach(array_column($features, 'id'));
        };
}
}