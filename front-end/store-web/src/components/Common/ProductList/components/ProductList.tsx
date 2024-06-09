import React, { FC } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import HeaderFilterSection from './HeaderFilterSection'
import { PRODUCTS } from '@/data/data'
export interface ProductListProps {
  data?: IProduct[]
}

const ProductList: FC<ProductListProps> = ({ data = PRODUCTS }) => {
  return (
    <>
      {data.map((item, index) => (
        <ProductCard product={item} key={index} />
      ))}
    </>
  )
}

export default ProductList
