import React, { useEffect, useState } from 'react'
import { ImageService } from '@/services'
import { ISearchImageResponse } from '@/services/image.service'
import SEO from '@/components/Layout/SEO'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetStaticProps } from 'next'
import Image from 'next/image'
import ProductList from '@/components/Product/ProductList'
import ProductGallery from '@/components/Product/ProductGallery'
import { formatCurrency } from '@/utils/string.helper'

export default function ProductPage({ params }: { params: { url: string } }) {
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large']
  const [activePrice, setActivePrice] = useState(sizes[0])
  console.log(params)
  const productHighlight: IProduct[] = [
    { name: 'Basic Tee With Long Sleeves Red', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg', price: 120000, priceOrigin: 120000 },
    { name: 'Classic Short Sleeves Shirt', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg', price: 120000, priceOrigin: 130000 },
    { name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', price: 120000, priceOrigin: 120000 },
    { name: 'Paris Shirt', thumbnail: '/imgs/productHighlight/Paris Shirt.jpg', price: 120000, priceOrigin: 120000 },
    { name: 'Paris Tee', thumbnail: '/imgs/productHighlight/Paris Tee.jpg', price: 120000, priceOrigin: 150000 },
    { name: 'Striped Shirt', thumbnail: '/imgs/productHighlight/Striped Shirt.jpg', price: 120000, priceOrigin: 120000 },
    { name: 'Winter-Striped Tee Dress Black', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg', price: 120000, priceOrigin: 120000 },
    { name: 'Winter-Striped Tee Dress White', thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg', price: 120000, priceOrigin: 120000 },
  ]
  const images: IImage[] = [
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/1.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/2.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/3.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/4.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/5.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/6.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/7.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/8.jpg',
    },
    {
      name: 'Paris Long Tee',
      url: '/imgs/productDetail4/9.jpg',
    },
  ]
  return (
    <>
      <SEO title="Paris Long Tee" />
      <div className="container lg:py-24 mx-auto">
        <div className="container mx-auto flex flex-wrap lg:px-0 px-3">
          <div className="lg:w-3/5 w-full">
            <ProductGallery images={images} />
          </div>
          <div className="lg:w-2/5 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 className="text-gray-900 text-4xl title-font font-medium mb-5">The Catcher in the Rye</h1>
            <p className="leading-relaxed">
              Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw
              denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo
              tattooed umami cardigan.
            </p>
            <div className="flex flex-wrap my-6 space-x-2 items-center">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  // Add active class if the size is active, otherwise add regular class
                  className={`cursor-pointer px-4 py-2 rounded-full border border-gray-300 ${
                    activePrice === size ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  }`}
                  onClick={() => setActivePrice(size)}
                >
                  {size}
                </div>
              ))}
            </div>
            <div className="flex">
              <p className="title-font font-medium text-2xl text-gray-800 ">
                <span className="line-through pr-3">{formatCurrency(400000)}</span>
                <span className="text-red-500">{formatCurrency(360000)}</span>
              </p>
            </div>
            <button className="mt-6 w-full flex justify-between ml-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded">
              Thêm vào giỏ hàng
              <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M21,7H7.462L5.91,3.586C5.748,3.229,5.392,3,5,3H2v2h2.356L9.09,15.414C9.252,15.771,9.608,16,10,16h8 c0.4,0,0.762-0.238,0.919-0.606l3-7c0.133-0.309,0.101-0.663-0.084-0.944C21.649,7.169,21.336,7,21,7z M17.341,14h-6.697L8.371,9 h11.112L17.341,14z" />
                <circle cx="10.5" cy="18.5" r="1.5" />
                <circle cx="17.5" cy="18.5" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
        <ProductList title="Sản phẩm liên quan" products={productHighlight} />
      </div>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return {
//     props: { params: context.params },
//   }
// }
