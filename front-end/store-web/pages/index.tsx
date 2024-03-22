import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import ProductList from '@/components/Product/ProductList'
import { useTranslation } from 'react-i18next'
import Banner from '@/components/Banner'
import Image from 'next/image'

export default function HomePage() {
  const { t } = useTranslation()
  const images: IImage[] = [
    { name: 'Basic Tee Long Sleeves Striped', url: '/imgs/sliders/3.jpeg' },
    { name: 'Basic Tee Long Sleeves Blue', url: '/imgs/sliders/2.jpeg' },
    { name: 'Basic Tee Long Sleeves Black', url: '/imgs/sliders/1.jpeg' },
  ]
  const promoProduct: IProduct[] = [
    { name: 'Basic Tee Long Sleeves Blue', thumbnail: '/imgs/productPromo/1.jpg', priceOrigin: 180000, price: 170000 },
    { name: 'Basic Tee Long Sleeves Black', thumbnail: '/imgs/productPromo/2.jpg', priceOrigin: 200000, price: 200000 },
    { name: 'Basic Tee Long Sleeves Striped', thumbnail: '/imgs/productPromo/3.jpg', priceOrigin: 220000, price: 220000 },
    { name: 'Basic Tee Long Sleeves Red', thumbnail: '/imgs/productPromo/4.jpg', priceOrigin: 230000, price: 200000 },
  ]
  const productHighlight: IProduct[] = [
    { name: 'Basic Tee With Long Sleeves Red', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg', priceOrigin: 120000, price: 100000 },
    { name: 'Classic Short Sleeves Shirt', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg', priceOrigin: 120000, price: 120000 },
    { name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', priceOrigin: 120000, price: 120000 },
    { name: 'Paris Shirt', thumbnail: '/imgs/productHighlight/Paris Shirt.jpg', priceOrigin: 120000, price: 120000 },
    { name: 'Paris Tee', thumbnail: '/imgs/productHighlight/Paris Tee.jpg', priceOrigin: 120000, price: 120000 },
    { name: 'Striped Shirt', thumbnail: '/imgs/productHighlight/Striped Shirt.jpg', priceOrigin: 120000, price: 120000 },
    { name: 'Winter-Striped Tee Dress Black', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg', priceOrigin: 120000, price: 120000 },
    { name: 'Winter-Striped Tee Dress White', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg', priceOrigin: 120000, price: 100000 },
  ]
  const images2: IImage[] = [{ name: 'New arrivals', url: '/imgs/cuchoami/2.jpg' }]
  const images3: IImage[] = [{ name: 'Striped', url: '/imgs/cuchoami/3.jpg' }]
  return (
    <>
      <SEO title="Thời trang" description="Describe the home page" />
      <Banner images={images} />
      <ProductList title="Sản phẩm mới về" products={productHighlight} />
      <Image src="/imgs/cuchoami/3.jpg" width={1024} height={209} className="container w-full mx-auto" alt="" />
      <ProductList title="Sản phẩm kẻ sọc thời trang" products={promoProduct} />
    </>
  )
}
