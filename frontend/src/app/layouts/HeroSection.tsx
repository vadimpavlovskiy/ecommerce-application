'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { HeroSectionProps } from '../types/layoutTypes/HeroSection'

import {Nunito} from 'next/font/google'
import {Raleway} from 'next/font/google'
import { fetchProducts } from '../api/productApi'

const nunito = Nunito({ subsets: ['latin'], weight: ['700'] })
const raleway = Raleway({ subsets: ['latin'] })

export const HeroSection = ({imageSrc, heading, desc, stats}: HeroSectionProps) => {
  useEffect(() => {
    (fetchProducts());
  }, [])
  
    return (
      <div className='flex w-full min-w-full mt-[150px] max-lg:flex-col max-lg:min-w-full max-lg:h-fit max-lg:mt-[50px]'>
        <div className='relative w-[547px] h-[550px] flex-shrink-0 max-lg:w-full max-lg:h-[320px]'>
          <Image src={imageSrc} layout='fill' objectFit='cover' alt='heroSection' />
        </div>
        <div className='flex flex-col justify-between h-[550px] ml-[113px] max-lg:ml-0 max-lg:justify-start max-lg:h-fit'>
          <h2 className={`${nunito.className} text-[2.75rem] mb-5 max-lg:text-[1.263rem] max-lg:text-center max-lg:my-2`}>{heading}</h2>
          <p className={`${raleway.className} text-[1.263rem] mb-2 max-lg:text-base`}>
            {desc}
          </p>
          <div className='flex justify-between mt-auto max-lg:mt-2'>
            {stats.map((stat, index) => (
              <div key={index} className='flex flex-col border-l-2 pl-5'>
                <span className='text-[5.625rem] max-lg:text-[2.5rem]'>{stat.value}</span>
                <span className='text-[1.563rem] max-lg:text-[0.875rem]'>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  