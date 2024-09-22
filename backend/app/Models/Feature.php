<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Feature extends Model
{
    use HasFactory;

    public function cartItems():BelongsToMany
    {
        return $this->belongsToMany(CartItem::class, 'cart_item_features');
    }
}
