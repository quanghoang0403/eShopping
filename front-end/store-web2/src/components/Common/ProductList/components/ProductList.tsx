import React, { FC } from 'react'
import ProductCard from '@/components/Product/ProductCard'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import HeaderFilterSection from './HeaderFilterSection'

export interface ProductListProps {
  data: IProduct[]
}

const ProductList: FC<ProductListProps> = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <ProductCard data={item} key={index} />
      ))}
    </>
  )
}

export default ProductList
