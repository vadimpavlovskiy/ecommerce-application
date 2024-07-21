import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { IFeatureBlock } from '../types/componentTypes/FeatureBlock'
import {Raleway} from 'next/font/google'

const raleway = Raleway({ subsets: ['latin'] })


export const FeatureBlock = ({width, height, src, alt, text}:IFeatureBlock) => {
  return (
    <div className='flex flex-col items-center w-full gap-y-10 max-sm:flex-row max-sm:gap-3'>
        <div className='bg-[#F4ECE2] p-5 rounded-full '>
            <Image 
            alt={alt} 
            width={width} 
            height={height} 
            className='max-sm:w-[47px] max-sm:h-[47px] max-w-none'
            src={src} />
        </div>
        <p className={`text-center text-[25px] max-md:text-[16px] ${raleway.className}`}>
          {text}
        </p>
    </div>
  )
}

export default FeatureBlock
