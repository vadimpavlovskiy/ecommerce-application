<?php

namespace Database\Seeders;

use App\Models\Attribute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Color',
                'values' => ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'],
            ],
        ];
    foreach ($attributes as $attribute) {
        DB::transaction(function() use ($attribute) {
            $createdAttribute = Attribute::create(['name' => $attribute['name']]);
                foreach ($attribute['values'] as $value) {
                    $createdAttribute->attributeOptions()->create(['value' => $value]);
                }
        });
    };
    }
}
