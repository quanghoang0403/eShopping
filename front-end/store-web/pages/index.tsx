'use client'
import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import ProductList from '@/components/Product/ProductList'
import { useTranslation } from 'react-i18next'
import Banner from '@/components/Common/Banner'
import Image from 'next/image'

export default function HomePage() {
  const { t } = useTranslation()
  const images: string[] = ['/imgs/sliders/3.jpeg', '/imgs/sliders/2.jpeg', '/imgs/sliders/1.jpeg']
  const promoProduct: IProduct[] = [
    {
      id: '1',
      code: 1,
      percentNumber: -10,
      name: 'Basic Tee Long Sleeves Blue',
      thumbnail: '/imgs/productPromo/1.jpg',
      priceValue: 180000,
      priceDiscount: 170000,
    },
    { id: '1', code: 1, name: 'Basic Tee Long Sleeves Black', thumbnail: '/imgs/productPromo/2.jpg', priceValue: 200000, priceDiscount: 200000 },
    { id: '1', code: 1, name: 'Basic Tee Long Sleeves Striped', thumbnail: '/imgs/productPromo/3.jpg', priceValue: 220000, priceDiscount: 220000 },
    {
      id: '1',
      code: 1,
      percentNumber: -10,
      name: 'Basic Tee Long Sleeves Red',
      thumbnail: '/imgs/productPromo/4.jpg',
      priceValue: 230000,
      priceDiscount: 200000,
    },
  ]
  const productHighlight: IProduct[] = [
    {
      id: '1',
      code: 1,
      percentNumber: -10,
      name: 'Basic Tee With Long Sleeves Red',
      thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg',
      priceValue: 120000,
      priceDiscount: 100000,
    },
    {
      id: '1',
      code: 1,
      name: 'Classic Short Sleeves Shirt',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      priceValue: 120000,
      priceDiscount: 120000,
    },
    { id: '1', code: 1, name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', priceValue: 120000, priceDiscount: 120000 },
    { id: '1', code: 1, name: 'Paris Shirt', thumbnail: '/imgs/productHighlight/Paris Shirt.jpg', priceValue: 120000, priceDiscount: 120000 },
    { id: '1', code: 1, name: 'Paris Tee', thumbnail: '/imgs/productHighlight/Paris Tee.jpg', priceValue: 120000, priceDiscount: 120000 },
    { id: '1', code: 1, name: 'Striped Shirt', thumbnail: '/imgs/productHighlight/Striped Shirt.jpg', priceValue: 120000, priceDiscount: 120000 },
    {
      id: '1',
      code: 1,
      name: 'Winter-Striped Tee Dress Black',
      thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg',
      priceValue: 120000,
      priceDiscount: 120000,
    },
    {
      id: '1',
      code: 1,
      percentNumber: -20,
      name: 'Winter-Striped Tee Dress White',
      thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg',
      priceValue: 120000,
      priceDiscount: 100000,
    },
  ]
  const images2: string[] = ['/imgs/cuchoami/2.jpg']
  const images3: string[] = ['/imgs/cuchoami/3.jpg']
  return (
    <>
      <SEO title={t('home.test')} description="Describe the home page" />
      <Banner images={images} />
      <ProductList title="Sản phẩm mới về" products={productHighlight} />
      <Image src="/imgs/cuchoami/3.jpg" width={1024} height={209} className="container w-full mx-auto" alt="" />
      <ProductList title="Sản phẩm kẻ sọc thời trang" products={promoProduct} />
    </>
  )
}
