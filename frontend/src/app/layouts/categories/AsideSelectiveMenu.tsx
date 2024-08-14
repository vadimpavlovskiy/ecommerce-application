'use client'
import { fetchCategories } from '@/app/api/categoryApi';
import { useStore } from '@/app/context/StoreProvider';
import { Category, Product } from '@/app/types/layoutTypes/CategorySection';
import { Raleway } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import { PriceFilterMenu } from '../filters/PriceFilterMenu';

const raleway = Raleway({ subsets: ['latin'], weight: ['400','600'] })
export const AsideSelectiveMenu = ({categories}:{categories:Category[]}) => {
  const {state, dispatch} = useStore();
  const highestPrice = state.originalProducts.reduce((max: number, product: Product) => {
    if(product.discounted_price) {
      return product.discounted_price > max ? product.discounted_price : max
    } else {
      return product.price > max ? product.price : max;
    }
  }, 0);
  
  const pathname = usePathname()
  return (
    <div className="flex flex-col gap-y-2">
      <div className={`${raleway.className} text-base font-normal border border-gray-200 rounded-xl py-5`}>
            <ul>
              <li 
              className={ pathname === '/store' ? 'font-semibold bg-[#FBA33D] text-white px-4 py-3' : 'font-normal px-4 py-3'}
              >
                <Link href={'/store'}>
                  <span>All Categories</span>
                </Link>
              </li>
              {categories.map((category, index) => {
                const isActive = pathname.includes(`/store/category/${category.slug}`);
                return (
                  <li className={`py-5 ${isActive ? 'font-semibold bg-[#FBA33D] text-white px-4 py-3' : 'font-normal px-4 py-3'}`} key={category.id}>
                    <Link href={`/store/category/${category.slug}`}>{category.name}</Link>
                  </li>
                )
                })}
            </ul>
      </div>
      <PriceFilterMenu highestPrice={highestPrice} />
    </div>
  )
}
