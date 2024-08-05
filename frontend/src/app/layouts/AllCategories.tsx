'use client'
import { Nunito, Raleway } from 'next/font/google'
import React, { useEffect, useState } from 'react'
import { fetchCategories } from '../api/categoryApi'
import { Category } from '../types/layoutTypes/CategorySection'
import Link from 'next/link'
const nunito = Nunito({ subsets: ['latin'], weight: ['700'] })
const raleway = Raleway({ subsets: ['latin'], weight: ['600'] })
export const AllCategories = () => {
    const [categories, setCategories] = useState<Category[] | []>([])
    const getCategoriesRequest = async () => {
        const response = await fetchCategories();
        setCategories(response)
    }
    useEffect(() => {
        getCategoriesRequest()
    }, [])
    
  return (
    <div className='flex flex-col mt-[9.375rem]'>
        <h2 className={`text-center text-[3.75rem] ${nunito.className} mb-[2.5rem]`}>Categories</h2>
        <div className='grid grid-cols-3 gap-5'>
        {categories.map((category:Category, index:number) => {
            return (
                <Link href={`/store/category/${category.slug}`}>
                    <div key={category.id} className={`bg-[#C6DDFD] h-[13.438rem] flex flex-col justify-center items-center rounded-xl text-[1.875rem] ${raleway.className}`}>
                        <span>
                            {category.name}
                        </span>
                        <span className="text-base text-[#7E7E7E]">
                            {category.products.length}
                        </span>
                    </div>
                </Link>
            )
        })}
        </div>
    </div>
  )
}