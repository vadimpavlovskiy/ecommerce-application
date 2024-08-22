'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

export const Breadcrumbs = () => {
    const paths = usePathname();
    const pathNames = paths.split('/').filter(path => path)
    return (
        <div className='my-5 breadcrumbs'>
            <ul className='flex gap-x-2 items-center'>
                {pathNames.map((url, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join('/')}`
                    const formattedUrl = url.replace(/-/g, ' ');
                    return (
                        <>
                            <li key={index} className={`text-sm space-x-2 ${paths === href ? 'font-bold' : ''}`}>
                                <Link href={href}>{formattedUrl.toUpperCase()}</Link>
                            </li>
                        </>
                    )
                })}
            </ul>
        </div>
    )
}
