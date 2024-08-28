import { fetchCategories, fetchCategoriesBySlug } from '@/app/api/categoryApi';
import CartComponent from '@/app/components/CartComponent';
import { ProductCard } from '@/app/components/ProductCard';
import { Features } from '@/app/layouts/Features';
import { Breadcrumbs } from '@/app/layouts/breadcrumbs/Breadcrumbs';
import { AsideSelectiveMenu } from '@/app/layouts/categories/AsideSelectiveMenu';
import { AllProducts } from '@/app/layouts/product/AllProducts';
import ProductDetails from '@/app/layouts/product/ProductDetails';
import { Category, Product } from '@/app/types/layoutTypes/CategorySection';
import { Raleway } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'

const raleway = Raleway({ subsets: ['latin'], weight: ['600', '300'] })
export default async function Page({
    params: { slug },
  }: {
    params: { slug: string }
  }) {
    const data:Category = await fetchCategoriesBySlug(slug)
    const categories:Category[] = await fetchCategories()
  return (
    <>
    <CartComponent />
    <main className="mx-[150px] max-lg:mx-[20px] flex flex-col">
    <Breadcrumbs />
      <div className='flex gap-x-5 max-md:flex-col'>
        <AsideSelectiveMenu categories={categories} />
        <div className="flex w-full max-md:flex-col max-md:text-center max-md:mt-2">
          <h2 className='font-semibold text-2xl'>{data.name.toUpperCase()}</h2>
          <AllProducts products={data.products} />
        </div>
      </div>
    </main>
    </>
  )
}