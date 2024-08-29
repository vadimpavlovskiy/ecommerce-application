import CartComponent from '@/app/components/CartComponent'
import { SearchButtonComponent } from '@/app/components/SearchButtonComponent'
import { Raleway } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const raleway = Raleway({ subsets: ['latin'], weight: ['400', '600'] })
export const HeaderBigScreens = () => {
    const path = usePathname();
    return (
        <header className={`flex w-full justify-between items-center mt-7 ${raleway.className}`}>
            <div className='w-1/3 max-lg:flex-none'>
                <Image src='./logo.svg' width={112} height={56} alt='logo' />
            </div>
            <ul className='flex list-none gap-x-5 text-xl w-fit whitespace-nowrap max-xl:gap-x-4'>
                <li className='hover:text-gray-500'><Link href={'/'} className={path === '/' ? `font-semibold` : 'font-normal'}>Main Page</Link></li>
                <li className='hover:text-gray-500'><Link href={'/store'} className={path === '/store' ? `font-semibold` : 'font-normal'}>Store</Link></li>
                <li className='hover:text-gray-500'><Link href={'/'}>About Us</Link></li>
                <li className='hover:text-gray-500'><Link href={'/contact-us/'}>Contact Us</Link></li>
            </ul>
            <div className='w-1/3 flex justify-end gap-x-5 items-center'>
                <SearchButtonComponent />
                <CartComponent />
            </div>
        </header>

    )
}
