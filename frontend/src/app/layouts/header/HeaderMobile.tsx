import CartComponent from '@/app/components/CartComponent'
import { HamburgerHeaderMenu } from '@/app/components/HamburgerHeaderMenu'
import { SearchButtonComponent } from '@/app/components/SearchButtonComponent'
import { Raleway } from 'next/font/google'
import Image from 'next/image'
import React from 'react'

const raleway = Raleway({ subsets: ['latin'], weight: ['400', '600'] })
export const HeaderMobile = () => {
    return (
        <header className={`flex w-full justify-around items-center mt-7 gap-x-5 ${raleway.className}`}>
            <Image src='./logo.svg' width={112} height={56} alt='logo' />
            <SearchButtonComponent />
            <CartComponent />
            <HamburgerHeaderMenu />
        </header>
    )
}
