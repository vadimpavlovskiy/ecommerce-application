import { fetchCategories } from '@/app/api/categoryApi';
import { fetchAllProducts, searchProduct } from '@/app/api/storeApi';
import CartComponent from '@/app/components/CartComponent';
import { Pagination } from '@/app/components/Pagination';
import { Breadcrumbs } from '@/app/layouts/breadcrumbs/Breadcrumbs';
import { AsideSelectiveMenu } from '@/app/layouts/categories/AsideSelectiveMenu';
import { HeaderLayout } from '@/app/layouts/header/HeaderLayout';
import { AllProducts } from '@/app/layouts/product/AllProducts';
import { useParams, usePathname } from 'next/navigation';
import React from 'react'

const Page = async ({searchParams}:{searchParams:{page?: number, search: string}}) => {
  const currentPage:number = searchParams.page || 1;
  const search = searchParams.search || '';
  const data = !search ? await fetchAllProducts() : await searchProduct({page: currentPage, searchValue: search});
  const categories = await fetchCategories();
  return (
    <>
      <HeaderLayout />
      <main className="flex flex-col">
      <Breadcrumbs />
        <div className="flex gap-x-5 max-md:flex-col">
          <AsideSelectiveMenu categories={categories} />
          <div className="flex w-full max-md:flex-col max-md:text-center max-md:mt-2">
            <h2 className="font-semibold text-2xl">All Products</h2>
            <AllProducts products={data} />
          </div>
        </div>
        <Pagination />
      </main>
    </>
  );

}

export default Page;