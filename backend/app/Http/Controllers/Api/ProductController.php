<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class ProductController extends Controller
{
    public function index() {
        $products = Product::all();
        $sessionData = Session::get()->all();
        return response()->json($products, $sessionData);
    }

    public function show($id) {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found', 404]);
        };

        return response()->json($product);
    }
}
