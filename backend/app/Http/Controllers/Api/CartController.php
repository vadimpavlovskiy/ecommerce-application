<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\Sku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CartController extends Controller
{
    public function add(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'cart_id' => 'required|string',
            'sku' => 'required|numeric|exists:skus,id',
            'additionalFeatures' => 'array',
            'quantity' => 'required|numeric|min:1',
        ]);

        $cart = Cart::firstOrCreate(['cart_id' => $validatedData['cart_id']]);
        $sku = Sku::findOrFail($validatedData['sku']);
        $product = Product::findOrFail($sku->product_id);
        $res = $cart->addItem($sku->id, $validatedData['additionalFeatures'], $validatedData['quantity']);
        return response()->json([
            'message' => "Created!",
            'cart' => $cart,
        ], 201);


    }


    public function show (Request $request) {
        $validatedData = $request->validate([
            'cart_id' => 'required|string' // Assuming 'cart_id' is an integer
        ]);

        try {
            // Fetch the cart using the validated 'cart_id'
            // Include the necessary relationships if they affect pricing calculations
            $cart = Cart::with(['items.sku.product', 'items.features', 'items.sku.attributeOptions.attribute'])
                ->where('cart_id', $validatedData['cart_id'])
                ->firstOrFail();

                foreach($cart->items as $val) {
                    $product = $val->sku->product;
                    $product->image = Storage::url($product->image);
                }
            // Access the total price attribute which needs to be defined in the Cart model
            $totalPrice = $cart->total_price;

            // Return the cart data and the total price in a JSON response
            return response()->json([
                'cart' => $cart,
                'totalPrice' => $totalPrice,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Handle the case where the cart is not found
            return response()->json(['message' => 'Cart not found', $validatedData['cart_id']], 404);
        }

        return response()->json([
            'cart' => $cart,
            'totalPrice' => $totalPrice,
        ]);

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

        $items = collect($items)->map(function ($item) {
            $item['image'] = Storage::url($item['image']);
            return $item;
        })->toArray();

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

    public function destroy ( Request $request) {
        $validatedData = $request->validate([
            'cart_id' => 'required | string'
        ]);
        Cart::where('cart_id', $validatedData['cart_id'])->delete();

        return response()->json(['message' => 'Cart deleted', 'items' => []]);
    }
}
