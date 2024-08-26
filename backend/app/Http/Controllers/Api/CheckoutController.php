<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\StripeClient;

class CheckoutController extends Controller
{
    public function generateUniqueCode()
    {
    do {
        // Generate a random numeric code (e.g., 6 digits)
        $order_number = mt_rand(100000, 999999);
    } while (Order::where('order_number', $order_number)->exists()); // Check if the code already exists in the 'orders' table

    return $order_number;
}

    public function validate(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'full_name' => 'required|string',
                'email' => 'required|string|email',
                'phone' => 'string|required',
                'address' => 'string | nullable',
                'apartment'=>'string | nullable',
                'city'=>'string | nullable',
                'postal_code'=>'string | nullable',
                'comment' => 'string | nullable',
                'items' => 'required | json',
                'total_amount' => 'required | integer',
                'id' => 'required | string'
            ]);
            return response()->json([
                "data" => $validatedData
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle the validation errors
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        }    
    }

    public function add(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'full_name' => 'required|string',
                'email' => 'required|string|email',
                'phone' => 'string|required',
                'address' => 'string | nullable',
                'apartment'=>'string | nullable',
                'city'=>'string | nullable',
                'postal_code'=>'string | nullable',
                'comment' => 'string | nullable',
                'items' => 'required | json',
                'total_amount' => 'required | integer',
                'id' => 'required | string'
            ]);
            $order_number = $this->generateUniqueCode();

            Order::create([
                'order_number' => $order_number,
                'full_name' => $validatedData['full_name'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'address' => $validatedData['address'],
                'apartment' => $validatedData['apartment'],
                'city' => $validatedData['city'],
                'postalCode' => $validatedData['postal_code'],
                'comment' => $validatedData['comment'],
                'items' => $validatedData['items'],
                'total_amount' => $validatedData['total_amount'],
                'status' => 'pending',
            ]);
            
            return response()->json([
                "data" => $validatedData
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle the validation errors
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        }    
    }
}
