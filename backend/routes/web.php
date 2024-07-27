<?php

use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Youre on main page']);
});

Route::controller(ProductController::class)->group(function () {
    Route::get('/api/products', [ProductController::class, 'index']);
    Route::get('/api/products/{id}', [ProductController::class, 'show']);
});

Route::controller(OrderController::class)->group(function () {
    Route::post('/api/orders', [OrderController::class, 'store']);
});


