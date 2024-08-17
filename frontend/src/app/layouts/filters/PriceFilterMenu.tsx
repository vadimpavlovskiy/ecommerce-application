'use client'
import { useStore } from '@/app/context/StoreProvider';
import React, { useState } from 'react'

export const PriceFilterMenu = ({highestPrice, lowestPrice}:{highestPrice:number, lowestPrice:number}) => {
  const [value, setValue] = useState(highestPrice);
  const {state, dispatch} = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));

  };

  const handlePriceSubmit = () => {
    dispatch({type: 'SET_PRICE_FILTER', payload: value})
  }

  return (
    <div className="collapse border border-gray-200">
    <input type="checkbox" />
    <div className="collapse-title text-xl font-medium">Price</div>
    <div className="collapse-content">
      <div className="flex justify-between text-xs mb-2">
        <span>${lowestPrice}</span>
        <span>${value}</span>
        <span>${highestPrice}</span>
      </div>
      <input       
        type="range"
        min={lowestPrice}
        max={highestPrice}
        value={value}
        onChange={handleChange}
        className="range range-sm"
      />
      <button onClick={handlePriceSubmit} className="btn btn-active w-full">Apply</button>
    </div>
  </div>

  )
}
