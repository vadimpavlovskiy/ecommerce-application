<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Stripe\Charge;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $validatedData = $request->validate([
            'cart_id' => 'required|string'
        ]);

        $cart = Cart::where('cart_id', $validatedData['cart_id'])->first();

        $cart_items = json_decode($cart->items, true);

        $total_price = 0;
    
        foreach ($cart_items as $item) {
            $total_price += $item['totalPrice'];
        }
    

        $payment_intent = PaymentIntent::create([
            'amount' => $total_price*100,
            'currency' => 'usd',
            'payment_method' => 'pm_card_visa'
        ]);

        return response()->json([
            'clientSecret' => $payment_intent->client_secret,
            'stripeId' => $payment_intent->id,
            'totalPrice' => $total_price,
            'cartItems' => $cart_items
        ]);
}
public function updatePaymentIntent(Request $request)  {
            Stripe::setApiKey(env('STRIPE_SECRET'));
            $validatedData = $request->validate([
                'cart_id' => 'required|string',
                'stripe_id' => 'required|string'
            ]);

            $cart = Cart::where('cart_id', $validatedData['cart_id'])->first();
            
            $cart_items = json_decode($cart->items, true);
            $total_price = 0;

            foreach ($cart_items as $item) {
                $total_price += $item['totalPrice'];
            }

            $payment_intent = PaymentIntent::update($validatedData['stripe_id'], 
            [
                'amount' => $total_price*100,
                'currency' => 'usd',
                'payment_method' => 'pm_card_visa'
            ]);
            return response()->json([
                'clientSecret' => $payment_intent->client_secret,
                'stripe_id' => $payment_intent->id,
                'totalPrice' => $total_price,
                'cartItems' => $cart_items,
            ]);
    }
}