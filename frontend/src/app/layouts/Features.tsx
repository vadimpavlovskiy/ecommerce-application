import React from 'react'
import FeatureBlock from '../components/FeatureBlock'

export const Features = () => {
  return (
    <div className='flex xl:gap-x-32 w-auto flex-grow max-md:flex-col max-md:gap-y-2 max-sm:w-full'>
        <FeatureBlock width={80} height={70} src='/price_tag.svg' alt={'Best Price'} text={'Low prices guaranteed'} />
        <FeatureBlock width={80} height={70} src='/box.svg' alt={'Best Price'} text={'90% of products always in stock'} />
        <FeatureBlock width={80} height={70} src='/delivery.svg' alt={'Best Price'} text={'Always quick delivery'} />
        <FeatureBlock width={80} height={70} src='/calendar.svg' alt={'Best Price'} text={'Installment up to 3 months'} />
    </div>
  )
}