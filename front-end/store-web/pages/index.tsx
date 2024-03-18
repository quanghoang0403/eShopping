import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import { Carousel } from '@material-tailwind/react'
import Image from 'next/image'
import ProductList from '@/components/ProductList'

export default function HomePage() {
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
      <div className="max-w-[1600px] h-[50vh] mx-auto">
        <Carousel placeholder={undefined} loop>
          <Image fill src="/imgs/sliders/1.jpeg" alt="image 1" className="h-full w-full object-cover" />
          <Image fill src="/imgs/sliders/2.jpeg" alt="image 2" className="h-full w-full object-cover" />
          <Image fill src="/imgs/sliders/3.jpeg" alt="image 3" className="h-full w-full object-cover" />
        </Carousel>
        {/* <section className="max-w-[1600px] h-[32rem] w-full mx-auto bg-nordic-gray-light flex pt-12 md:pt-0 md:items-center bg-cover bg-right bg-[url('/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg')]">
          <div className="container mx-auto">
            <div className="flex flex-col w-full lg:w-1/2 justify-center items-start  px-6 tracking-wide">
              <h1 className="text-black text-2xl my-4">Stripy Zig Zag Jigsaw Pillow and Duvet Set</h1>
              <a className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black" href="#">
                products
              </a>
            </div>
          </div>
        </section> */}
      </div>
      <ProductList title="Top products" products={productHighlight} />
      <ProductList title="Sale products" products={promoProduct} />
    </>
  )
}
