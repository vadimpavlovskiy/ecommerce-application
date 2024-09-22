import { fetchProductBySlug } from "@/app/api/productApi";
import CartComponent from "@/app/components/CartComponent";
import { Features } from "@/app/layouts/Features";
import { Breadcrumbs } from "@/app/layouts/breadcrumbs/Breadcrumbs";
import { HeaderLayout } from "@/app/layouts/header/HeaderLayout";
import ProductDetails from "@/app/layouts/product/ProductDetails";
import React from "react";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const productData = await fetchProductBySlug(slug);
  return (
    <>
      <HeaderLayout />
      <main>
        <Breadcrumbs />
        <ProductDetails
          options={productData.options}
          productData={productData.product}
        />
        <Features />
      </main>
    </>
  );
}
