import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import ProductList from '@/components/Product/ProductList'
import { useTranslation } from 'react-i18next'
import Banner from '@/components/Banner'

export default function HomePage() {
  const { t } = useTranslation()
  const images: IImage[] = [
    { name: 'Basic Tee Long Sleeves Striped', url: '/imgs/sliders/3.jpeg' },
    { name: 'Basic Tee Long Sleeves Blue', url: '/imgs/sliders/2.jpeg' },
    { name: 'Basic Tee Long Sleeves Black', url: '/imgs/sliders/1.jpeg' },
  ]
  const promoProduct: IProduct[] = [
    { name: 'Basic Tee Long Sleeves Blue', thumbnail: '/imgs/productPromo/1.jpg', price: 180000 },
    { name: 'Basic Tee Long Sleeves Black', thumbnail: '/imgs/productPromo/2.jpg', price: 200000 },
    { name: 'Basic Tee Long Sleeves Striped', thumbnail: '/imgs/productPromo/3.jpg', price: 220000 },
  ]
  const productHighlight: IProduct[] = [
    { name: 'Basic Tee With Long Sleeves Red', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg', price: 120000 },
    { name: 'Classic Short Sleeves Shirt', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg', price: 120000 },
    { name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', price: 120000 },
    { name: 'Paris Shirt', thumbnail: '/imgs/productHighlight/Paris Shirt.jpg', price: 120000 },
    { name: 'Paris Tee', thumbnail: '/imgs/productHighlight/Paris Tee.jpg', price: 120000 },
    { name: 'Striped Shirt', thumbnail: '/imgs/productHighlight/Striped Shirt.jpg', price: 120000 },
    { name: 'Winter-Striped Tee Dress Black', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg', price: 120000 },
    { name: 'Winter-Striped Tee Dress White', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg', price: 120000 },
  ]
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <Banner images={images} />
      <ProductList title="Sản phẩm nổi bật" products={productHighlight} />
      <ProductList title="Sản phẩm khuyến mãi" products={promoProduct} />
    </>
  )
}
