'use client'
import { fetchCategories } from '@/app/api/categoryApi';
import { fetchAllProducts } from '@/app/api/storeApi';
import { ProductCard } from '@/app/components/ProductCard';
import { useStore } from '@/app/context/StoreProvider';
import { Product } from '@/app/types/layoutTypes/CategorySection';
import React, { FC, useEffect } from 'react'


interface AllProductsProps {
    products: Product[];
  }
  

export const AllProducts:FC<AllProductsProps> = ({products}:{products:Product[]}) => {
    const { state, dispatch } = useStore();

    useEffect(() => {
        dispatch({ type: 'SET_PRODUCTS', payload: products });
      }, [products, dispatch]);
      const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'SET_SORT', payload: e.target.value as 'none' | 'low-to-high' | 'high-to-low' });
      };
    
  return (
    <div className='w-full'>
        <div className='py-10 flex justify-end'>
            <select onChange={handleSortChange}>
                <option value="none">No Sorting</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
            </select>
        </div>
        <div className='flex gap-[2.188rem]'>
        {state.products.map((product:Product, index) => {
            return (
                <ProductCard product={product} />
                )
                })}
        </div>
    </div>
  )
}
