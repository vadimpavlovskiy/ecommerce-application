'use client'
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

export const Pagination = ({currentPage, lastPage}:{currentPage:number, lastPage:number}) => {
    const path = usePathname();
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1';

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= lastPage; i++) {
          if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pages.push(
              <Link
                key={i}
                href={`${path}?page=${i}`}
                className={`px-4 py-1 ${i === currentPage ? 'font-bold bg-blue-200 rounded-full max-w-4 flex justify-center' : ''}`}
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
