'use client'
import { StripeError, loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/app/context/CartProvider';
import { CartLayout } from '../cart/CartLayout';
import { DeliveryForm } from './DeliveryForm';

import { useConfirmAddress } from '@mapbox/search-js-react';
import { IDeliveryForm } from '@/app/types/formTypes/deliveryForm';
import axios from 'axios';
import Stripe from 'stripe';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { fetchClientSecret, updateClientSecret } from '@/app/api/stripeApi';

const stripePromise = loadStripe(String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
const CheckoutForm = ({ clientSecret, stripeId, totalAmount, formData }: { clientSecret: string, stripeId:string, totalAmount:number, formData:IDeliveryForm }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter()

  const [error, setError] = useState<StripeError | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null >(null);
  const {state: cartState, dispatch} = useCart();
  const savedCartId = localStorage.getItem('cart_id');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    // Add error handling later
    const checkoutData = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,

        address: formData.address ? formData.address : null,
        apartment: formData.addressLine2 ? formData.addressLine2 : null,
        city: formData.city ? formData.city : null,
        postal_code: formData.postalCode ? formData.postalCode : null,
        comment: formData.comment ? formData.comment : null,

        items: JSON.stringify(cartState.items),
        total_amount: totalAmount,

        id: stripeId
    }
    
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/checkout/validate`, checkoutData, {
            headers: {
                Accept: 'application/json'
            }
        })
        if(res) {
          const checkout = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: 'http://localhost:3000',
              receipt_email: formData.email ? formData.email : undefined,
              shipping: {
                address: {
                  city: formData.city ? formData.city : undefined,
                  line1: String(formData.address),
                  line2: String(formData.addressLine2),
                  postal_code: String(formData.postalCode)
                },
                name: String(formData.name),
                phone: String(formData.phone)
              }
            },
            redirect: 'if_required'
          }).then(async function (result) {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/checkout`, checkoutData, {
              headers: {
                Accept: 'application/json'
              }
              })
              if(res.status === 200) { 
                const res = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart/destroy/?cart_id=${savedCartId}`);
                dispatch({type: 'SET_CART', payload: res.data.items})
                console.log(res.data.items)
                router.replace('/');
              }
          }          
          );
          console.log(res)
          dispatch({type: 'SET_CART', payload: res.data.items})
        }
        if (error) {
          console.error(error); 
          setError(error);
        }
    
        setIsProcessing(false);
        console.log(res);
    } catch (error) {
        console.error('Error submitting order:', error);
    }
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
        {message && <p>{message}</p>}
    </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeId, setStripeId] = useState<string | null>(null);
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
    const fetchData = async () => {
      try {
        const { clientSecret, totalPrice, stripeId } = await fetchClientSecret(String(savedCartId));
        setTotalPrice(totalPrice);
        setClientSecret(clientSecret);
        setStripeId(stripeId);

      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateData = async () => {
      try {
        if(stripeId) {
          const {clientSecret, totalPrice, stripe_id} = await updateClientSecret(String(savedCartId), String(stripeId));
          setTotalPrice(totalPrice)
          setClientSecret(clientSecret)
          setStripeId(stripe_id);
        }
      } catch(error) {
        console.log('Error: ', error)
      }
    }
    updateData()
  }, [cartState.items])

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
            <CheckoutForm stripeId={String(stripeId)} clientSecret={clientSecret} totalAmount={totalPrice} formData={formData} />
        </Elements>
    </div>
  );
}
