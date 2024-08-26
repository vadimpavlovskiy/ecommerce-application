'use client'
import { IDeliveryForm } from '@/app/types/formTypes/deliveryForm'
import { AddressAutofill, useConfirmAddress } from '@mapbox/search-js-react'
import { E164Number } from 'libphonenumber-js/core'
import React, { ChangeEvent, Dispatch, RefObject, SetStateAction, useState } from 'react'
import PhoneInput from 'react-phone-number-input/input'

export const DeliveryForm = ({formData, setFormData, formRef, setMinimapFeature, hasAdditionalFeatures}:{
    formData: IDeliveryForm,
    setFormData: Dispatch<SetStateAction<IDeliveryForm>>,
    formRef: RefObject<HTMLFormElement>,
    setMinimapFeature: Dispatch<SetStateAction<undefined>>,
    hasAdditionalFeatures: boolean
}) => {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
    const handleAutofillRetrieve = (response:any) => {
        setMinimapFeature(response.features[0])
    }

    return (
        <>
            <div className='flex flex-col gap-y-4 my-4 w-full'>
                <h2 className="font-bold text-xl">Contant Information</h2>
                <input value={formData.name ?? ''} onChange={(e) => setFormData({
                    ...formData,
                    name :e.target.value
                })} type="text" placeholder="Full Name*" required className="input input-bordered min-w-full max-w-xs" />
                <input value={formData.email ?? ''} onChange={(e) => setFormData({
                    ...formData,
                    email: e.target.value
                    })} type="email" placeholder="Email*" required className="input input-bordered min-w-full max-w-xs" />
                <PhoneInput onChange={(e)=>setFormData({
                    ...formData,
                    phone: e
                })} value={formData.phone} className={'input input-bordered min-w-full max-w-xs'} placeholder={'Enter your phone number'} />
            </div>
            {hasAdditionalFeatures && 
            <div className='flex flex-col gap-y-4 w-full my-4'>
                <h2 className="font-bold text-xl">Shipping Information</h2>
                <form ref={formRef} className='flex flex-col gap-y-2 min-w-full'>
                    <AddressAutofill onRetrieve={handleAutofillRetrieve} accessToken={`${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}>
                        <input className="input input-bordered min-w-full max-w-xs" placeholder='Address ( fill this area first )' autoComplete="address-line1" name="address" onChange={handleInputChange} required />
                    </AddressAutofill>
                    <div className='flex justify-between'>
                        <input className="input input-bordered w-full max-w-xs" placeholder='Apartment, suite, etc.' autoComplete="address-line2" name="addressLine2" onChange={handleInputChange} required />
                        <input className="input input-bordered w-full max-w-xs" placeholder='City' autoComplete="address-level2" name="city" onChange={handleInputChange} required />
                        <input className="input input-bordered w-full max-w-xs" autoComplete="postal-code" placeholder='ZIP/ Postcode' name="postalCode" onChange={handleInputChange} required />
                    </div>
                </form>
            </div>
            }
            <div className='flex flex-col gap-y-4 w-full my-2'>
                    <h2 className="font-bold text-xl">{"Additional message (optional)"}</h2>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">Your comment</span>
                        </div>
                        <textarea name="comment" className="textarea textarea-bordered" placeholder="Write something important..." onChange={handleInputChange}></textarea>
                    </label>
            </div>
        </>
    )
}
