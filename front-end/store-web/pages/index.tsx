import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import HomeCarousel from '@/components/Home/HomeCarousel'
import ProductList from '@/components/ProductList'

export default function HomePage() {
  const promoProduct: IProduct[] = [
    { name: 'Basic Tee Long Sleeves Blue', url: '/imgs/productPromo/1.jpg', price: 180000 },
    { name: 'Basic Tee Long Sleeves Black', url: '/imgs/productPromo/2.jpg', price: 200000 },
    { name: 'Basic Tee Long Sleeves Striped', url: '/imgs/productPromo/3.jpg', price: 220000 },
  ]
  const productHighlight: IProduct[] = [
    { name: 'Basic Tee With Long Sleeves Red', url: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg', price: 120000 },
    { name: 'Classic Short Sleeves Shirt', url: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg', price: 120000 },
    { name: 'Paris Long Tee', url: '/imgs/productHighlight/Paris Long Tee.jpg', price: 120000 },
    { name: 'Paris Shirt', url: '/imgs/productHighlight/Paris Shirt.jpg', price: 120000 },
    { name: 'Paris Tee', url: '/imgs/productHighlight/Paris Tee.jpg', price: 120000 },
    { name: 'Striped Shirt', url: '/imgs/productHighlight/Striped Shirt.jpg', price: 120000 },
    { name: 'Winter-Striped Tee Dress Black', url: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg', price: 120000 },
    { name: 'Winter-Striped Tee Dress White', url: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg', price: 120000 },
  ]
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <HomeCarousel />
      <ProductList title="Top products" products={productHighlight} />
      <ProductList title="Sale products" products={promoProduct} />
    </>
  )
}
