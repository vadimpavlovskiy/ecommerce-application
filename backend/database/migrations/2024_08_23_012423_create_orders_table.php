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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('full_name')->required();
            $table->string('email')->required();
            $table->string('phone')->required();
            $table->string('address')->nullable()->default(null);
            $table->string('apartment')->nullable()->default(null);
            $table->string('city')->nullable()->default(null);
            $table->string('postalCode')->nullable()->default(null);    
            $table->text('comment')->nullable()->default(null);
            $table->json('items');
            $table->integer('total_amount');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
