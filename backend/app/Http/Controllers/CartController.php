<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function add(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'cart_id' => 'required|string',
            'productId' => 'required|numeric|exists:products,id',
            'color' => 'required|string',
            'textile' => 'required|string',
            'matress' => 'required|string',
            'additionalFeatures' => 'array',
            'quantity' => 'required|numeric|min:1',
        ]);

        $cart = Cart::firstOrCreate(['cart_id' => $validatedData['cart_id']]);
        $product = Product::findOrFail($validatedData['productId']);
        $totalPrice = $product->discounted_price ? $product->discounted_price : $product->price;
        $items = json_decode($cart->items, true) ?: [];

        foreach ($product->custom_properties as $property) {
            if ($property['type'] === 'color' && strtolower($property['name']) === strtolower($validatedData['color'])) {
                $totalPrice += $property['price'];
            }
            if ($property['type'] === 'textile' && strtolower($property['name']) === strtolower($validatedData['textile'])) {
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

        // Generate a unique key for the product configuration
        $productKey = $validatedData['productId'] . '-' . $validatedData['color'] . '-' . $validatedData['textile'] . '-' . $validatedData['matress'] . '-' . implode('-', $validatedData['additionalFeatures']);

        if (isset($items[$productKey])) {
            $items[$productKey]['quantity'] += $validatedData['quantity'];
        } else {
            $items[$productKey] = [
                'productId' => $validatedData['productId'],
                'color' => $validatedData['color'],
                'textile' => $validatedData['textile'],
                'matress' => $validatedData['matress'],
                'additionalFeatures' => $validatedData['additionalFeatures'],
                'quantity' => $validatedData['quantity'],
                'totalPrice' => $totalPrice,
            ];
        }

        $cart->items = json_encode($items);
        $cart->save();


        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart' => json_decode($cart->items),
        ], 201);


    }

    public function removeFromCart(Request $request)
    {
        $validatedData = $request->validate([
            'cart_id' => 'required|string',
            'product_id' => 'required|string'
        ]);

        $cart = Cart::where('cart_id', $validatedData['cart_id'])->first();

        if ($cart) {
            $items = $cart->items ?: [];
            if (isset($items[$validatedData['product_id']])) {
                unset($items[$validatedData['product_id']]);
                $cart->items = $items;
                $cart->save();
            }
        }

        return response()->json(['message' => 'Product removed from cart']);
    }

    public function show (Request $request) {
        $validatedData = $request->validate([
            'cart_id' => 'required|string'
        ]);

        $cart = Cart::where('cart_id', $validatedData['cart_id']);

        return response()->json($cart ? $cart->items : []);

    }
}