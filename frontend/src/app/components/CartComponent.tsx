'use client'
import axios from 'axios';
import { Raleway } from 'next/font/google';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useCart } from '../context/CartProvider';

const raleway = Raleway({subsets: ['latin'], weight: ['300', '400', '600']})


export default function CartComponent() {
  const { state: cartState, dispatch } = useCart();
  const savedCartId = localStorage.getItem('cart_id');
  console.log(cartState.items)

  async function updateCart(quantity: number, key:string) {
    try {
      const response = await axios.put(`http://157.230.208.159/api/cart/update?cart_id=${savedCartId}&quantity=${Number(quantity)}&key=${key}`);
      console.log(response.data.items)
      dispatch({ type: 'UPDATE_CART', payload: response.data.items });

    } catch (error) {
      console.log(error);
    }
  }
  async function getCart() {
    try {
      const response = await axios.get(`http://157.230.208.159/api/cart?cart_id=${savedCartId}`);
      dispatch({ type: 'SET_CART', payload: response.data });

    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async function deleteItem(key:string) {
    try {
      await axios.delete(`http://157.230.208.159/api/cart/delete?cart_id=${savedCartId}&key=${key}`)
      dispatch({ type: 'DELETE_ITEM', payload: key });

    } catch(error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCart();
  }, [])
  
  return (
    <>
    <div className={`drawer z-50 join drawer-end ${raleway.className}`} >
  <input id="my-drawer-4" type="checkbox" className="drawer-toggle peer" />
  <div className="drawer-content">
    <label htmlFor="my-drawer-4" className="drawer-button">
      <div className='m-5'>
        <div className="indicator cursor-pointer">
          <span className="indicator-item indicator-bottom indicator-start badge badge-warning">                  {Object.keys(cartState.items).length}
          </span>
          <div className="grid h-15 w-16d place-items-center">
            <Image width={30} height={36} src={'/cart.svg'} alt='' />
          </div>
        </div>
      </div>
    </label>
  </div>
  <div className="drawer-side ">
    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
    <div className="menu bg-base-200 text-base-content min-h-full w-1/3 p-4">
      <h2 className='text-[1.875rem] font-semibold'>Your cart: {Object.keys(cartState.items).length} products</h2>
      <div className="divider" />
      <div className="flex flex-col gap-y-7">
      {cartState.items ? (
        Object.entries(cartState.items).map(([key, item], index) => {
          return (
                  <div className='flex justify-between p-5 items-center' key={index}>
                    <div className='flex flex-col gap-y-5'>
                      <h3>{item.name}</h3>
                      <div className='flex flex-col text-xs'>
                        <ul className='flex flex-col italic gap-x-1'>
                          {item.color ? <li className='font-bold'>Color: {item.color}</li> :''}
                          {item.textile ? <li className='font-bold'>Textile: {item.textile}</li> :''}
                          {item.matress ? <li className='font-bold'>Matress: {item.matress}</li> :''}
                          {item.additionalFeatures ? item.additionalFeatures.map((feature, index) => (
                            <li className='font-bold' key={index}>Additional feature: {feature}</li>
                          )) : ''}
                        </ul>
                      </div>
                      <p className='text-[1.563rem] font-semibold'>{item.totalPrice} $</p>
                    </div>
                    <div className='flex space-x-5'>
                    <div className="join flex items-center w-[7.313rem] justify-around divide-x bg-gray-300 rounded-full text-center">
                                        <button onClick={()=>updateCart(item.quantity - 1, key)} className='p-3'>{'<'}</button>
                                        <span className='p-3 pl-4'>{item.quantity}</span>
                                        <button onClick={()=>updateCart(item.quantity + 1, key)} className='p-3'>{'>'}</button>
                                    </div>
                      <div onClick={()=>deleteItem(key)}>
                        <Image className='cursor-pointer' src={'/bin.svg'} alt='' width={30} height={30} />
                      </div>                                                 
                    </div>
                  </div>
                )})
              ) : (
                <li><a>No items in cart</a></li>
              )}

      </div>
    </div>
  </div>
</div>
    </>
  )
}
