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

        // Generate a unique key for the product configuration
        $productKey = $validatedData['productId'] . '-' . $validatedData['color'] . '-' . $validatedData['textile'] . '-' . $validatedData['matress'] . '-' . implode('-', $validatedData['additionalFeatures']);

        if (isset($items[$productKey])) {
            $items[$productKey]['quantity'] += $validatedData['quantity'];
            $items[$productKey]['totalPrice'] = $totalPrice * $items[$productKey]['quantity'];
            
        } else {
            $items[$productKey] = [
                'productId' => $validatedData['productId'],
                'name' => $product['name'],
                'image' => $product['image'],
                'color' => $validatedData['color'],
                'textile' => $validatedData['textile'],
                'matress' => $validatedData['matress'],
                'additionalFeatures' => $validatedData['additionalFeatures'],
                'quantity' => $validatedData['quantity'],
                'totalPrice' => $totalPrice * $validatedData['quantity'],
            ];
        }
        unset($items[$productKey]['cart_id']);

        $cart->items = json_encode($items);
        $cart->save();


        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart' => json_decode($cart->items),
            'total_price' => $items[$productKey]
        ], 201);


    }


    public function show (Request $request) {
        $validatedData = $request->validate([
            'cart_id' => 'required|string'
        ]);

        $cart = Cart::where('cart_id', $validatedData['cart_id'])->first();

        return response()->json(json_decode($cart->items));

    }

    public function update (Request $request) {
        $validatedData = $request->validate([
            'cart_id' => 'required|string',
            'quantity' => 'integer|required|min:1',
            'key' => 'string|required'
        ]);
        $cart = Cart::where('cart_id', $validatedData['cart_id'])->first();
        $items = json_decode($cart->items, true);
        $product = Product::findOrFail($items[$validatedData['key']]['productId']);
        $totalPrice = $product->discounted_price ? $product->discounted_price : $product->price;
        if (array_key_exists($validatedData['key'], $items)) {
            // Here we must recalculate an price base on product data to be sure that price would be stable
            foreach ($product->custom_properties as $property) {
                if ($property['type'] === 'color' && strtolower($property['name']) === strtolower($items[$validatedData['key']]['color'])) {
                    $totalPrice += $property['price'];
                }
                if ($property['type'] === 'textile' && strtolower($property['name']) === strtolower($items[$validatedData['key']]['textile'])) {
                    $totalPrice += $property['price'];
                }
            }
    
            if (!empty($items[$validatedData['key']]['additionalFeatures'])) {
                foreach ($items[$validatedData['key']]['additionalFeatures'] as $feature) {
                    foreach ($product->custom_properties as $property) {
                        if ($property['type'] === 'additional_features' && strtolower($property['name']) === strtolower($feature)) {
                            $totalPrice += $property['price'];
                            break;
                        }
                    }
                }
            }
            $totalPrice *= $validatedData['quantity'];
            
            $items[$validatedData['key']]['quantity'] = (int)$validatedData['quantity'];
            $items[$validatedData['key']]['totalPrice'] = $totalPrice;
        } else {
            return response()->json(['message' => 'Item not found'], 404);
        }
    
        // Encode the items back to JSON and save
        $cart->items = json_encode($items);
        $cart->save();
    
        return response()->json(['message' => 'Updated', 'items'=> $items, 'total'=>$totalPrice]);
    }

    public function delete (Request $request) {
        $validatedData = $request->validate([
            'cart_id' => 'required|string',
            'key' => 'string|required'
        ]);
        $cart = Cart::where('cart_id', $validatedData['cart_id'])->first();
        $items = json_decode($cart->items, true);

        if (array_key_exists($validatedData['key'], $items)) {
            unset($items[$validatedData['key']]);

        } else {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $cart->items = json_encode($items);
        $cart->save();
    
        return response()->json(['message' => 'Item deleted', 'items' => $items]);
    
    }
}