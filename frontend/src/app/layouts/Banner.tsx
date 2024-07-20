import Image from 'next/image'
import React from 'react'

export const Banner = () => {
  return (
    <div className='flex flex-col'>
        <h1 className='text-center font-sans text-9xl uppercase font-bold'>
            <span className='mb-5'>Soft furniture</span>
            <br />
            <span className='text-8xl'>made in US</span>
        </h1>
        <Image className='mt-7' src={'/ph.png'} alt='' width={1620} height={373} />
    </div>
  )
}