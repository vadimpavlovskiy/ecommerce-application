'use client'
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useStore } from '../context/StoreProvider';

export const Pagination = () => {
    const path = usePathname();
    const {state, dispatch} = useStore();
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1';
    const itemsPerPage = 3; // Set your desired items per page here
    const totalPages = Math.ceil(state.products.length / itemsPerPage);

    const renderPageNumbers = () => {
      console.log('state length: ' + totalPages)
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
          if (i === 1 || i === totalPages || (i >= Number(page) - 1 && i <= Number(page) + 1)) {
            pages.push(
              <Link
                key={i}
                href={`${path}?page=${i}`}
                className={`px-4 py-1 ${i === Number(page) ? 'font-bold bg-blue-200 rounded-full max-w-4 flex justify-center' : ''}`}
              >
                {i}
              </Link>
            );
          } else if (React.isValidElement(pages[pages.length - 1]) && pages[pages.length - 1].props.children !== '...') {
            pages.push(<span key={i}>...</span>);
          }
          
        }
        return pages;
      };
    
    return (
        <div className='flex gap-x-2 justify-center mt-10'>
                  {renderPageNumbers()}
        </div>
    )
}
