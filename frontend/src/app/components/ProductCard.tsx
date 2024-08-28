import { Raleway } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import { Product } from '../types/layoutTypes/CategorySection'
import Image from 'next/image'

const raleway = Raleway({ subsets: ['latin'], weight: ['600', '300'] })

export const ProductCard = ({product}:{product:Product}) => {
  (product)
  return (
    <div className={`${raleway.className} text-2xl flex max-w-fit max-md:max-w-full`}>
              <Link href={`/store/${product.slug}`} className='flex flex-col items-center justify-center max-md:w-full max-md:text-center'>
              <Image className='rounded-2xl' src={product.image} alt='alt' width={250} height={200} />
              <div>
                <h4 className='font-semibold'>{product.name}</h4>
                <div className='flex gap-x-5 font-light text-sm justify-center'>
                  <span className='flex items-center'>
                    <Image src={'/length.svg'} width={10} height={10} className='mr-1' alt='Product length' />
                    L: {product.length}
                    </span>
                  <span className='flex items-center'><Image src={'/width.svg'} alt='Product length' width={15} height={15} className='mr-1'/>W: {product.width}</span>
                  <span className='flex items-center'><Image src={'/height.svg'} alt='Product length' width={10} height={10} className='mr-1'/>H: {product.height}</span>
                </div>
                <div className='text-[#252525] text-center'>
                  <p className="line-through text-base">{product.price} $</p>
                  <p className="text-2xl font-semibold">{product.discounted_price} $</p>
                </div>
                </div>
              </Link>
            </div>

  )
}
