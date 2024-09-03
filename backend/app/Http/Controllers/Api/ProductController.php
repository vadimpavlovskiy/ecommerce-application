<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(): JsonResponse {
        $products = Product::with('skus')->get();
        $products->transform(function($product) {
            $product->image = Storage::url($product->image);
            return $product;
        });
        return response()->json($products);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        $product_show = Product::where('slug', $request->slug)->with(['skus.images', 'features'])->firstOrFail();

        $product_show->image = Storage::url($product_show->image);


        $options = $this->fetchAvailableAttributeOptions($product_show);

        foreach ($product_show->skus as $sku) {
            $sku->images->transform(function($image) {
                $image->name = Storage::url($image->name);
                return $image;
            });
        }

        if (!$product_show) {
            return response()->json([
                'error' => 'Product not found'
            ], 404);
        }
        return response()->json([
            'options' => $options,
            'product' => $product_show,
        ]);

    }


    public function search (Request $request) {
        $searchValue = $request->input('search');
        $products = Product::when($searchValue, function ($q) use ($searchValue) {
            return $q->where('name', 'like', "%{$searchValue}%");
        })->get();

        $products->transform(function ($product) {
            $product['image'] = Storage::url($product['image']);
            return $product;
        });

        // $products->transform(function ($product) {
        //     $product['image'] = Storage::url($product['image']);
        // });

        return response()->json([
            "products" => $products,
            'search' => $searchValue
        ]);
    }

    private function fetchAvailableAttributeOptions(Product $product): array
    {
        // Initialize an empty array to hold attribute options
        $options = [];

        // Loop through each SKU of the product
        foreach ($product->skus as $sku) {
            // Loop through each attribute option of the SKU
            foreach ($sku->attributeOptions as $option) {
                // Organize attribute options by attribute ID
                $attributeName = $option->attribute->name;
                $options[$attributeName][$option->id] = $option->value;
            }
        }

        // Return the compiled options
        return $options;
    }

}
