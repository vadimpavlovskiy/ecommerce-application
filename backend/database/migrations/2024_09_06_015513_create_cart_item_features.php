<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cart_item_features', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\CartItem::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\Feature::class)->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_item_features');
    }
};
