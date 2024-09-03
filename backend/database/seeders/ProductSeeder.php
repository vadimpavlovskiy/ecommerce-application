<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeOption;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Simplified attributes mapping for the example
        $attributesMapping = Attribute::pluck('id', 'name')->toArray();

        // Detailed product and SKU configuration
        $productsConfig = [
            [
                'name' => 'Luxury Sofa',
                'slug' => 'luxury-sofa',
                'base_price' => 230,
                'discounted_price' => 190,
            ],
        ];

        foreach ($productsConfig as $productData) {
            DB::transaction(function () use ($productData, $attributesMapping) {
                // Create the product
                $product = Product::create([
                    'name' => $productData['name'],
                    'slug' => $productData['slug'],
                ]);

                // Get the available attribute options for "Color"
                $colorAttributeId = $attributesMapping['Color'];
                $colorOptions = AttributeOption::where('attribute_id', $colorAttributeId)->get();

                // Loop through each color and create an SKU for each
                foreach ($colorOptions as $colorOption) {
                    $sku = $product->skus()->create([
                        'code' => 'SOFA-LUXURY-' . strtoupper($colorOption->value),
                        'price' => $productData['base_price'],
                        'discounted_price' => $productData['discounted_price'],
                    ]);

                    // Attach the color attribute option to the SKU
                    $sku->attributeOptions()->attach($colorOption->id);
                }
            });
        }
    }
}
