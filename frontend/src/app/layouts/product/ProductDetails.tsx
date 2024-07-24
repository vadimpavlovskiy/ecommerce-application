import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image';
import React from 'react'
import { Raleway } from 'next/font/google';
const raleway = Raleway({subsets: ['latin'], weight: ['300', '400', '600']})

const ProductDetails = async ({productData}:{productData:any}) => {
    const sanitizedThumbnail =  DOMPurify.sanitize(productData.thumbnail);
    const sanitizedDescription =  DOMPurify.sanitize(productData.description);
    return (
        <div className={`${raleway.className} font-normal text-[1.25rem] w-full`}>
                    <div className='flex'>
                        <div className='relative w-[800px] h-[887px] flex-shrink-0 mr-5'>
                        <Image src={'/sofa.png'} layout='fill' objectFit='cover' alt='heroSection' />
                        </div>
                        <div>
                            <h2 className={`${raleway.className} font-semibold text-[2.5rem]`}>{productData.name}</h2>
                            <div className='flex gap-x-5'>    
                                <span className='flex items-center'><Image src={'/length.svg'} width={15} height={15} className='mr-1' alt='Product length' /> L: {productData.length}</span>
                                <span className='flex items-center'><Image src={'/width.svg'} alt='Product length' width={15} height={15} className='mr-1'/>W: {productData.width}</span>
                                <span className='flex items-center'><Image src={'/height.svg'} alt='Product length' width={10} height={10} className='mr-1'/>H: {productData.height}</span>
                            </div>
                            <div>
                                <p>
                                    Sleeping space: {productData.sleeping_area_length} x {productData.sleeping_area_width}
                                </p>
                            </div>
                            <div>
                                <div className='my-[2.5rem]' dangerouslySetInnerHTML={{ __html: sanitizedThumbnail }} />
                            </div>
                            <div>
                                <p className={`${productData.discounted_price ? 'line-through' : ''} p-0 font-light`}>{productData.price} $</p>
                                <p className={`text-[1.875rem]`}>{productData.discounted_price} $</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-[9.375rem]'>
                        <h2 className={`${raleway.className} text-[1.563rem] font-semibold`}>Description</h2>
                        <div className='my-[2.5rem]' dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                    </div>
                    <div className='w-full'>
                        <h2 className={`${raleway.className} text-[1.563rem] font-semibold`}>
                            Product features
                        </h2>
                        <div className='my-[2.5rem] w-full flex flex-wrap gap-y-4 gap-x-4'>
                            {
                            productData.custom_properties.map((property, index) => (
                                <div className='flex w-[calc(50%-1rem)] justify-between border-b-2' key={index}>
                                    <span className='p-0 pb-4'>{property.key}</span>
                                    <span>{property.value}</span>
                                </div>
                            ))
                            }
                        </div>
                    </div>
        </div>
    )
}

export default ProductDetails;