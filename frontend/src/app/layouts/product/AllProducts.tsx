'use client';
import React, { FC, useEffect } from 'react';
import { useStore } from '@/app/context/StoreProvider';
import { Product } from '@/app/types/layoutTypes/CategorySection';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/app/components/ProductCard';

export const AllProducts: FC<{ products: Product[] }> = ({ products }) => {
  const { state, dispatch } = useStore();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = 3; // Change this number based on how many items per page you want

  useEffect(() => {
    dispatch({ type: 'SET_PRODUCTS', payload: products });
  }, [products, dispatch]);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedProducts = state.products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full">
      <div className="py-10 flex justify-end">
        <select onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value as 'none' | 'low-to-high' | 'high-to-low' })}>
          <option value="none">No Sorting</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>
      <div className="flex gap-[2.188rem]">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
