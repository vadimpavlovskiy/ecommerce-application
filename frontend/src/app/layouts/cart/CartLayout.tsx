'use client'
import { useCart } from '@/app/context/CartProvider';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect } from 'react'

export const CartLayout = () => {
    const { state: cartState, dispatch } = useCart();
    const savedCartId = localStorage.getItem('cart_id');

  async function updateCart(quantity: number, key:string) {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart/update?cart_id=${savedCartId}&quantity=${Number(quantity)}&key=${key}`);
      (response.data.items)
      dispatch({ type: 'UPDATE_CART', payload: response.data.items });

    } catch (error) {
      (error);
    }
  }
  async function getCart() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart?cart_id=${savedCartId}`);
      console.log(response.data)
      dispatch({ type: 'SET_CART', payload: response.data });

    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async function deleteItem(key:string) {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/cart/delete?cart_id=${savedCartId}&key=${key}`)
      dispatch({ type: 'DELETE_ITEM', payload: key });

    } catch(error) {
      (error)
    }
  }
  useEffect(() => {
    getCart();
  }, [])
    return (
        <div className="overflow-x-auto">
        <table className="table">
        {/* head */}
        <thead>
            <tr>
            <th></th>
            <th>Product and quality</th>
            <th>Additional features</th>
            <th>Total</th>
            </tr>
        </thead>
        <tbody>
            {cartState.items ? (
        Object.entries(cartState.items).map(([key, item], index) => {
            return (
                <tr>
                        <th className='flex justify-between'>
                            <Image onClick={()=>deleteItem(key)} className='cursor-pointer' src={'/bin.svg'} alt='' width={30} height={30} />
                            <Image className='rounded-lg' src={item.image} width={152} height={152} alt={'Item description'} />
                        </th> 
            <td>
                <p>{item.name}</p>
                <div className="join flex items-center w-[7.313rem] justify-around divide-x bg-gray-300 rounded-full text-center">
                    <button onClick={()=>updateCart(item.quantity - 1, key)} className='p-3'>{'<'}</button>
                    <span className='p-3 pl-4'>{item.quantity}</span>
                    <button onClick={()=>updateCart(item.quantity + 1, key)} className='p-3'>{'>'}</button>
                </div>
            </td>
            <td>
                    {item.color ? <li className='font-bold'>Color: {item.color}</li> :''}
                    {item.textile ? <li className='font-bold'>Textile: {item.textile}</li> :''}
                    {item.matress ? <li className='font-bold'>Matress: {item.matress}</li> :''}
                    {item.additionalFeatures ? item.additionalFeatures.map((feature, index) => (
                    <li className='font-bold' key={index}>Additional feature: {feature}</li>
                )) 
                : ''}
            </td>
            <td>
                {item.totalPrice} $
            </td>
                </tr>
            )
        }
    )) : <></>
    }       
        </tbody>
        </table>
    </div>
  )
}
