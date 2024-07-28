'use client'
import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image';
import React from 'react'
import { Raleway } from 'next/font/google';
const raleway = Raleway({subsets: ['latin'], weight: ['300', '400', '600']})

const ProductDetails = async ({productData}:{productData:any}) => {
    const sanitizedThumbnail =  DOMPurify.sanitize(productData.thumbnail);
    const sanitizedDescription =  DOMPurify.sanitize(productData.description);
    console.log(productData);
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
                            <div className='flex flex-col gap-y-7'>
                                <div>
                                    <p className={`${productData.discounted_price ? 'line-through' : ''} p-0 font-light`}>{productData.price} $</p>
                                    <p className={`text-[1.875rem]`}>
                                        {productData.discounted_price} $
                                    </p>
                                </div>
                                <div className='flex justify-between w-full gap-x-4 items-center p-5 border rounded-xl'>
                                <label className="form-control w-1/2 max-w-xs flex flex-row justify-between gap-x-5">
                                    <div className="label">
                                        <span className="label-text text-[1.563rem]">Color: </span>
                                    </div>
                                    <select className="select select-bordered bg-[#EAEAEA] mr-5">
                                    <option disabled selected>Please, select</option>
                                        {
                                            productData.custom_properties.map((property, index) => {
                                                if(property.type==='color') {
                                                    return (
                                                        <option>{property.name}</option>
                                                    )
                                                }
                                            })
                                        }
                                    </select>
                                    </label>
                                    <label className="form-control w-1/2 max-w-xs flex flex-row justify-between gap-x-5">
                                    <div className="label">
                                        <span className="label-text text-[1.563rem]">Textile: </span>
                                    </div>
                                    <select className="select select-bordered bg-[#EAEAEA] mr-5">
                                    <option disabled selected>Please, select</option>
                                        {
                                            productData.custom_properties.map((property, index) => {
                                                if(property.type==='color') {
                                                    return (
                                                        <option>{property.name}</option>
                                                    )
                                                }
                                            })
                                        }
                                    </select>
                                    </label>
                                </div>
                                <div className='flex w-full flex-col gap-x-4 gap-y-5 p-5 border rounded-xl'>
                                    <h3 className=''>Select the matress:</h3>
                                    <div className="join carousel rounded-box flex gap-x-4">
                                    <div className="carousel-item">
                                            <div className="card bg-gray-200 w-25">
                                                <figure className="px-10 pt-10">
                                                    <Image
                                                    src="/prohibited.svg"
                                                    width={45}
                                                    height={45}
                                                    alt="Shoes"
                                                    className="rounded-xl" />
                                                </figure>
                                                    <div className="card-body items-center text-center">
                                                        <p>No matress</p>
                                                    </div>
                                            </div>
                                    </div>
                                    <div className="carousel-item">
                                            <div className="card bg-gray-50 w-36">
                                                <figure className="px-10 pt-10">
                                                <Image
                                                    src="/matress.svg"
                                                    width={67}
                                                    height={67}
                                                    alt="Shoes"
                                                    className="rounded-xl" />
                                                </figure>
                                                    <div className="card-body items-center text-center">
                                                        <p>Matress</p>
                                                    </div>
                                            </div>
                                    </div>
                                    </div>
                                </div>
                                <div className='flex w-full justify-between gap-x-4 gap-y-5 p-5 border rounded-xl'>
                                    <div className='w-1/3'>
                                    <h3 className=''>Additional features:</h3>
                                        <div className='flex flex-col'>
                                            <div className="form-control">
                                                <label className="label cursor-pointer flex justify-start gap-x-2">
                                                    <input type="checkbox" className="checkbox" />
                                                    <span className="label-text">Furniture assambling (+30$)</span>
                                                </label>
                                                <label className="label cursor-pointer flex justify-start gap-x-2">
                                                    <input type="checkbox" className="checkbox" />
                                                    <span className="label-text">Furniture moving (+25$)</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-3/4 flex items-center justify-end gap-x-5'>
                                    <div className="join flex items-center w-[7.313rem] justify-around divide-x bg-gray-100 rounded-full text-center">
                                        <button className='p-3'>{'<'}</button>
                                        <span className='p-3 pl-4'>1</span>
                                        <button className='p-3'>{'>'}</button>
                                    </div>
                                    <button className="btn btn-info text-white">Add to cart</button>
                                    </div>
                                </div>
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
                            { productData.custom_properties.map((property, index) => {
                                if(property.type === 'characteristic') {
                                    return (
                                        <div className='flex w-[calc(50%-1rem)] justify-between border-b-2' key={index}>
                                            <span className='p-0 pb-4'>{property.key}</span>
                                            <span>{property.value}</span>
                                        </div>
                                    )}}
                                )
                                }
                        </div>
                    </div>
        </div>
    )
}

export default ProductDetails;