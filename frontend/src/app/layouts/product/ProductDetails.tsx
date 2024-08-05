'use client'
import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image';
import React, { useState } from 'react'
import { Raleway } from 'next/font/google';
import axios from 'axios';
import { OrderData } from '@/app/types/componentTypes/CartComponent';
import { useCart } from '@/app/context/CartProvider';
const raleway = Raleway({subsets: ['latin'], weight: ['300', '400', '600']})

const ProductDetails = ({productData}:{productData:any}) => {
    const sanitizedThumbnail =  DOMPurify.sanitize(productData.thumbnail);
    const sanitizedDescription =  DOMPurify.sanitize(productData.description);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedTextile, setSelectedTextile] = useState('');
    const [selectedMatress, setSelectedMatress] = useState('');
    const [additionalFeatures, setAdditionalFeatures] = useState([]);
    const [quantity, setQuantity] = useState(1);  
    const { state: cartState, dispatch } = useCart();
    const [cartId, setCartId] = useState(() => {
        // Generate or retrieve a cart ID
        let savedCartId = localStorage.getItem('cart_id');
        if (!savedCartId) {
            savedCartId = `cart_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('cart_id', savedCartId);
        }
        return savedCartId;
    });

    const handleFeatureChange = (feature:any) => {
        setAdditionalFeatures((prev:any) =>
          prev.includes(feature)
            ? prev.filter((f) => f !== feature)
            : [...prev, feature]
        );
      };

      const handleSubmitOrder = async () => {
        const orderData:OrderData = {
            cart_id: cartId,
            productId: productData.id,
            sku: productData.sku,
            color: selectedColor,
            textile: selectedTextile ? selectedTextile : null,
            matress: selectedMatress,
            additionalFeatures: additionalFeatures,
            quantity,
        };
        try {
          const response = await axios.post('http://157.230.208.159/api/cart/add', orderData);
          dispatch({ type: 'ADD_ITEMS', payload: response.data.cart });
          console.log('Order submitted successfully:', response.data.cart);

        } catch (error) {
          console.error('Error submitting order:', error);
        }
      };
    
    
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
                                    <select className="select select-bordered bg-[#EAEAEA] mr-5" onChange={(e) => setSelectedColor(e.target.value)} value={selectedColor}>
                                    <option disabled selected value=''>Please, select</option>
                                        {
                                            productData.custom_properties.map((property:any, index) => {
                                                if(property.type==='color') {
                                                    return (
                                                        <option value={String(property.name).toLowerCase()}>{property.name}</option>
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
                                    <select className="select select-bordered bg-[#EAEAEA] mr-5" onChange={(e) => setSelectedTextile(e.target.value)} value={selectedTextile}>
                                    <option disabled selected value=''>Please, select</option>
                                        {
                                            productData.custom_properties.map((property, index) => {
                                                if(property.type==='textile') {
                                                    return (
                                                        <option value={String(property.name).toLowerCase()}>{property.name}</option>
                                                    )
                                                }
                                            })
                                            
                                        }
                                    </select>
                                    </label>
                                </div>
                                <div className='flex w-full flex-col gap-x-4 gap-y-5 p-5 border rounded-xl'>
                                    <h3 className=''>Select the matress:</h3>
                                    <div className="join carousel rounded-box flex gap-x-4 isolate">
                                    <div className="carousel-item z-0">
                                            <div className="card w-25">
                                                <figure className="px-10 pt-10">
                                                    <Image
                                                    src="/prohibited.svg"
                                                    width={45}
                                                    height={45}
                                                    alt="Shoes"
                                                    className="rounded-xl" />
                                                </figure>
                                                    <div className="card-body isolate items-center text-center">
                                                        <p>No matress</p>
                                                        <input type='radio' name='matress' value='none' onChange={(e) => setSelectedMatress(e.target.value)} />
                                                    </div>
                                            </div>
                                    </div>
                                    <div className="carousel-item z-0">
                                            <div className="card w-36">
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
                                                        <input className='isolate' type='radio' name='matress' value='matress' onChange={(e) => setSelectedMatress(e.target.value)} />

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
                                                {
                                                    productData.custom_properties.map((property, index) => {
                                                        if(property.type === 'additional_features') {
                                                            return (
                                                                <label className="label cursor-pointer flex justify-start gap-x-2">
                                                                    <input type="checkbox" className="checkbox" value={String(property.name).toLowerCase()} onChange={(e) => handleFeatureChange(e.target.value)} />
                                                                    <span className="label-text">{property.name} (+{property.price}$)</span>
                                                                </label>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-3/4 flex items-center justify-end gap-x-5'>
                                    <div className="join flex items-center w-[7.313rem] justify-around divide-x bg-gray-100 rounded-full text-center">
                                        <button onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}  className='p-3'>{'<'}</button>
                                        <span className='p-3 pl-4'>{quantity}</span>
                                        <button onClick={() => setQuantity((prev) => Math.max(prev + 1, 1))} className='p-3'>{'>'}</button>
                                    </div>
                                    <button onClick={handleSubmitOrder} className="btn btn-info text-white">Add to cart</button>
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