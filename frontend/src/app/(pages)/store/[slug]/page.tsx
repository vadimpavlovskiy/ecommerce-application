import { fetchProductBySlug } from '@/app/api/productApi'
import CartComponent from '@/app/components/CartComponent';
import { Features } from '@/app/layouts/Features';
import { Breadcrumbs } from '@/app/layouts/breadcrumbs/Breadcrumbs';
import ProductDetails from '@/app/layouts/product/ProductDetails';
import React from 'react'

export default async function Page({
    params: { slug },
  }: {
    params: { slug: string }
  }) {
    const productData = await fetchProductBySlug(slug);
    (productData)
  return (
    <>
    <CartComponent />
    <Breadcrumbs />
    <main className="mx-[150px] max-lg:mx-[20px]">
            <ProductDetails productData={productData.products} image={productData.contents} />
            <Features />
    </main>
    </>
  )
}