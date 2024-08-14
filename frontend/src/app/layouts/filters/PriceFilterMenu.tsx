'use client'
import { useStore } from '@/app/context/StoreProvider';
import React, { useState } from 'react'

export const PriceFilterMenu = ({highestPrice}:{highestPrice:number}) => {
  const [value, setValue] = useState(40);
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
        <span>$0</span>
        <span>${value}</span>
        <span>${highestPrice}</span>
      </div>
      <input       
        type="range"
        min={0}
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
