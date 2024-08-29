import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export const HamburgerHeaderMenu = () => {
  const path = usePathname();
  return (
    <div className="drawer drawer-end w-fit">
        <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
        <div  className="drawer-content">
        <label htmlFor="my-drawer-5" className="drawer-button z-10 cursor-pointer">
            <Image src={'./hamb_menu.svg'} width={43} height={43} alt='' />
        </label>
        </div>
        <div className="drawer-side z-50">
            <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 text-2xl">
                <li className='hover:text-gray-500'><Link href={'/'} className={path === '/' ? `font-semibold` : 'font-normal'}>Main Page</Link></li>
                <li className='hover:text-gray-500'><Link href={'/store'} className={path === '/store' ? `font-semibold` : 'font-normal'}>Store</Link></li>
                <li className='hover:text-gray-500'><Link href={'/'}>About Us</Link></li>
                <li className='hover:text-gray-500'><Link href={'/contact-us/'}>Contact Us</Link></li>
            </ul>
        </div>
    </div>
  )
}
