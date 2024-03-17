import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import HomeCarousel from '@/components/Home/HomeCarousel'
import ProductList from '@/components/ProductList'

export default function HomePage() {
  const promoProducts: IProduct[] = [
    { name: 'Product 1', url: 'https://example.com/product1', price: 10 },
    { name: 'Product 2', url: 'https://example.com/product2', price: 20 },
    { name: 'Product 3', url: 'https://example.com/product3', price: 30 },
  ];
  return (
    <>
      <SEO title="Home Page" description="Describe the home page" />
      <HomeCarousel />
      <ProductList />
    </>
  )
}
