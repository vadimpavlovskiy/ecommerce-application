import Image from 'next/image'
import React from 'react'

import {Nunito} from 'next/font/google'

const nunito = Nunito({ subsets: ['latin'], weight: ['900'] })
export const Banner = () => {
  return (
    <div className='flex flex-col'>
        <h1 className={`text-center font-sans text-9xl uppercase font-bold max-md:text-[35px] ${nunito.className}`}>
            <span className='mb-5'>Soft furniture</span>
            <br />
            <span className='text-8xl max-md:text-[35px]'>made in US</span>
        </h1>
        <Image className='mt-7 max-md:h-[143px] w-full' src={'/ph.png'} alt='' width={1620} height={373} />
    </div>
  )
}