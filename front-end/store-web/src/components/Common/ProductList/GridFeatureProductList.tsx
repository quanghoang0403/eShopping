import React, { FC } from 'react'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import HeaderFilterSection from './components/HeaderFilterSection'
import ProductList from './components/ProductList'
import { PRODUCTS } from '@/data/data'
//
export interface GridFeatureProductListProps {
  data: IProduct[]
}

const GridFeatureProductList: FC<GridFeatureProductListProps> = ({ data = PRODUCTS }) => {
  return (
    <div className="nc-GridFeatureProductList relative">
      <HeaderFilterSection />
      <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 `}>
        <ProductList data={data} />
      </div>
      <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Xem thêm</ButtonPrimary>
      </div>
    </div>
  )
}

export default GridFeatureProductList
