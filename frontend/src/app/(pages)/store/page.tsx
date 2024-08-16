import { fetchCategories } from '@/app/api/categoryApi';
import { fetchAllProducts } from '@/app/api/storeApi';
import CartComponent from '@/app/components/CartComponent';
import { Pagination } from '@/app/components/Pagination';
import { AsideSelectiveMenu } from '@/app/layouts/categories/AsideSelectiveMenu';
import { AllProducts } from '@/app/layouts/product/AllProducts';
import { useParams, usePathname } from 'next/navigation';
import React from 'react'

const Page = async ({searchParams}:{searchParams:{page?: number}}) => {
  const currentPage:number = searchParams.page || 1;
  const { data, current_page, last_page } = await fetchAllProducts({page:currentPage});
  const categories = await fetchCategories();
  return (
    <>
      <CartComponent />
      <main className="mx-[150px] max-lg:mx-[20px] flex flex-col">
        <div className="flex gap-x-5">
          <AsideSelectiveMenu categories={categories} />
          <div className="flex w-full">
            <h2 className="font-semibold text-2xl">All Products</h2>
            <AllProducts products={data} />
          </div>
        </div>
        <Pagination currentPage={current_page} lastPage={last_page} />
      </main>
    </>
  );

}

export default Page;