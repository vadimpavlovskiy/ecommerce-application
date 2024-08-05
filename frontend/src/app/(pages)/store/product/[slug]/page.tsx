import { fetchProductBySlug } from '@/app/api/productApi'
import CartComponent from '@/app/components/CartComponent';
import { Features } from '@/app/layouts/Features';
import ProductDetails from '@/app/layouts/product/ProductDetails';
import React from 'react'

export default async function Page({
    params: { slug },
  }: {
    params: { slug: string }
  }) {
    const productData = await fetchProductBySlug(slug);
  return (
    <>
    <CartComponent />
    <main className="mx-[150px] max-lg:mx-[20px]">
            <ProductDetails productData={productData} />
            <Features />
    </main>
    </>
  )
}