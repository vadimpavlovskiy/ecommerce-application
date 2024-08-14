import { fetchCategories } from '@/app/api/categoryApi';
import { fetchAllProducts } from '@/app/api/storeApi';
import CartComponent from '@/app/components/CartComponent';
import { AsideSelectiveMenu } from '@/app/layouts/categories/AsideSelectiveMenu';
import { AllProducts } from '@/app/layouts/product/AllProducts';
import React from 'react'

const Page = async () => {
  const products = await fetchAllProducts();
  const categories = await fetchCategories();
  console.log(products)
  return (
    <>
      <CartComponent />
    <main className="mx-[150px] max-lg:mx-[20px]">
      <div className='flex gap-x-5'>
      <AsideSelectiveMenu categories={categories} />
        <div className='flex w-full'>
        <h2 className='font-semibold text-2xl'>All Products</h2>
          <AllProducts products={products} />
        </div>
      </div>
    </main>
    </>
  )
}

export default Page;