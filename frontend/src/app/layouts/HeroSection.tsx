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
    console.log(fetchProducts());
  }, [])
  
    return (
      <div className='flex w-full min-w-[1620px] mt-[150px]'>
        <div className='relative w-[547px] h-[550px] flex-shrink-0'>
          <Image src={imageSrc} layout='fill' objectFit='cover' alt='heroSection' />
        </div>
        <div className='flex flex-col justify-between h-[550px] ml-[113px]'>
          <h2 className={`${nunito.className} text-[2.75rem] mb-10`}>{heading}</h2>
          <p className={`${raleway.className} text-[1.263rem]`}>
            {desc}
          </p>
          <div className='flex justify-between mt-auto'>
            {stats.map((stat, index) => (
              <div key={index} className='flex flex-col border-l-2 pl-5'>
                <span className='text-[5.625rem]'>{stat.value}</span>
                <span className='text-[1.563rem]'>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  