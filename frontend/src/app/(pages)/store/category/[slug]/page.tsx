import { fetchCategoriesBySlug } from '@/app/api/categoryApi';
import CartComponent from '@/app/components/CartComponent';
import { Features } from '@/app/layouts/Features';
import ProductDetails from '@/app/layouts/product/ProductDetails';
import { Category, Product } from '@/app/types/layoutTypes/CategorySection';
import { Raleway } from 'next/font/google';
import Link from 'next/link';
import React, { useEffect } from 'react'

const raleway = Raleway({ subsets: ['latin'], weight: ['600', '300'] })
export default async function Page({
    params: { slug },
  }: {
    params: { slug: string }
  }) {
    const data:Category = await fetchCategoriesBySlug(slug)
    console.log(data);
  return (
    <>
    <CartComponent />
    <main className="mx-[150px] max-lg:mx-[20px]">
      {data.products.map((product:Product, index:number)=> {
        return (
          <Link href={`/store/product/${product.id}`}>
            <div className={`${raleway.className} text-2xl flex`}>
              <div className='flex flex-col items-center justify-center'>
              <h4 className='font-semibold'>{product.name}</h4>
              <div className='flex gap-x-5 font-light text-sm'>
                  <span>L: {product.length}</span>
                  <span>W: {product.width}</span>
                  <span>H: {product.height}</span>
              </div>
              <div className='text-[#252525] text-center'>
                <p className="line-through text-base">{product.price} $</p>
                <p className="text-2xl font-semibold">{product.discounted_price} $</p>
              </div>
              </div>
            </div>
          </Link>
        )
      })}
    </main>
    </>
  )
}