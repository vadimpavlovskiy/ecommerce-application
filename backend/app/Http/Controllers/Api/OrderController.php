<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'productId' => 'required|integer',
            'color' => 'required|string',
            'textile' => 'required|string',
            'matress' => 'required|string',
            'additionalFeatures' => 'array',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validatedData['productId']);


        $totalPrice = $product->discounted_price ? $product->discounted_price : $product->price;

        foreach ($product->custom_properties as $property) {
            if($property['type'] === 'color' && strtolower($property['name'])  === $validatedData['color']) {
                $totalPrice += $property['price'];
            }
        }
        foreach ($product->custom_properties as $property) {
            if($property['type'] === 'textile' && strtolower($property['name']) === $validatedData['textile']) {
                $totalPrice += $property['price'];
            }
        }
        if (!empty($validatedData['additionalFeatures'])) {
            foreach ($validatedData['additionalFeatures'] as $feature) {
                foreach ($product->custom_properties as $property) {
                    if ($property['type'] === 'additional_features' && strtolower($property['name']) === strtolower($feature)) {
                        $totalPrice += $property['price'];
                        break;
                    }
                }
            }
        }


    
        $totalPrice *= $validatedData['quantity'];

        // Return a response
        return response()->json([
            'message' => 'Order submitted successfully',            
            'user_data' => $validatedData,
            'data' => $product,
            'price' => $totalPrice
        ], 201);
    }
}