import React, { FC } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import { Product, PRODUCTS } from '@/data/data'
import HeaderFilterSection from './components/HeaderFilterSection'

//
export interface GridFeatureProductListProps {
  data?: Product[]
}

const GridFeatureProductList: FC<GridFeatureProductListProps> = ({ data = PRODUCTS }) => {
  return (
    <div className="nc-GridFeatureProductList relative">
      <HeaderFilterSection />
      <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}>
        {data.map((item, index) => (
          <ProductCard data={item} key={index} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div>
    </div>
  )
}

export default GridFeatureProductList
