<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index() {
        $products = Product::all();
        return response()->json($products);
    }

    public function show($slug) {
        $product = Product::where('slug', $slug)->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found', 404]);
        };
        $contents = Storage::url($product['image']);

        return response()->json([
            "products" => $product,
            "contents" => $contents
        ]);
    }
}
