'use client'
import { StripeError, loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartProvider';
import { CartLayout } from '../cart/CartLayout';
import { DeliveryForm } from './DeliveryForm';

import { useConfirmAddress } from '@mapbox/search-js-react';
import { IDeliveryForm } from '@/app/types/formTypes/deliveryForm';

const stripePromise = loadStripe(String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));

const CheckoutForm = ({ clientSecret, totalAmount }: { clientSecret: string, totalAmount:number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<StripeError | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000',
      },

    });

    if (error) {
      console.error(error);
      setError(error);
    }

    setIsProcessing(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const, // Correctly typed layout
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className='flex flex-col gap-y-2 my-2'>
        <h2 className='text-2xl font-bold'>Total: ${totalAmount.toFixed(2)}</h2>
        <button className="btn btn-info text-white w-full" type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay'}
        </button>
        {error && <div>{error.message}</div>}
    </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const savedCartId = localStorage.getItem('cart_id');
  const {state: cartState} = useCart()

  // States for Delivery Form
  const [formData, setFormData] = useState<IDeliveryForm>({
    name: null,
    email: null,
    address: null,
    addressLine2: null,
    city: null,
    postalCode: null,
    phone: undefined,
    comment: null,
})
const [minimapFeature, setMinimapFeature] = useState()
const { formRef, showConfirm } = useConfirmAddress({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
});

  useEffect(() => {
    async function fetchClientSecret() {
      const { clientSecret, totalPrice, cartItems } = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart_id: savedCartId }), // Example amount in cents
        }
      ).then((res) => res.json());
      setTotalPrice(totalPrice);
      setClientSecret(clientSecret);
    }
    fetchClientSecret();
  }, [cartState.items, formRef.current]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }
  const hasAdditionalFeatures = Object.values(cartState.items).some(item =>
    item.additionalFeatures && item.additionalFeatures.includes('moving')
  );

  return (
    <div className='flex flex-col'>
        <CartLayout />
        <DeliveryForm formData={formData} hasAdditionalFeatures={hasAdditionalFeatures} setFormData={setFormData} formRef={formRef} setMinimapFeature={setMinimapFeature} />
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} totalAmount={totalPrice} />
        </Elements>
    </div>
  );
}
