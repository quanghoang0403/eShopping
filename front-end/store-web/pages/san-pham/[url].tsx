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
import { useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'

export default function ProductPage({ params }: { params: { url: string } }) {
  console.log(params)
  const productDetail: IProductDetail = {
    id: '1',
    name: 'The Catcher in the Rye',
    thumbnail: '/imgs/productDetail4/1.jpg',
    productCategoryName: 'Áo',
    urlSEO: 'the-catcher-in-the-rye',
    description: `Fam locavore kickstarter distillery. Mixtape chillwave tumeric sriracha taximy chia microdosing tilde DIY. XOXO fam indxgo juiceramps cornhole raw
    denim forage brooklyn. Everyday carry +1 seitan poutine tumeric. Gastropub blue bottle austin listicle pour-over, neutra jean shorts keytar banjo
    tattooed umami cardigan.`,
    productPrices: [
      {
        id: '1',
        priceName: 'Large',
        percentNumber: -20,
        priceDiscount: 300000,
        priceValue: 400000,
        quantityLeft: 3,
      },
      {
        id: '2',
        priceName: 'Medium',
        percentNumber: -30,
        priceDiscount: 200000,
        priceValue: 300000,
        quantityLeft: 3,
      },
      {
        id: '3',
        priceName: 'Small',
        priceDiscount: 200000,
        priceValue: 200000,
        quantityLeft: 4,
      },
    ],
    gallery: [
      '/imgs/productDetail4/1.jpg',
      '/imgs/productDetail4/2.jpg',
      '/imgs/productDetail4/3.jpg',
      '/imgs/productDetail4/4.jpg',
      '/imgs/productDetail4/5.jpg',
      '/imgs/productDetail4/6.jpg',
      '/imgs/productDetail4/7.jpg',
      '/imgs/productDetail4/8.jpg',
      '/imgs/productDetail4/9.jpg',
    ],
    content: '',
  }
  const productHighlight: IProduct[] = [
    {
      id: '1',
      name: 'Basic Tee With Long Sleeves Red',
      thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg',
      priceDiscount: 120000,
      priceValue: 120000,
    },
    {
      id: '2',
      percentNumber: -10,
      name: 'Classic Short Sleeves Shirt',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      priceDiscount: 120000,
      priceValue: 130000,
    },
    { id: '3', name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', priceDiscount: 120000, priceValue: 120000 },
    { id: '4', name: 'Paris Shirt', thumbnail: '/imgs/productHighlight/Paris Shirt.jpg', priceDiscount: 120000, priceValue: 120000 },
    { id: '5', percentNumber: -30, name: 'Paris Tee', thumbnail: '/imgs/productHighlight/Paris Tee.jpg', priceDiscount: 120000, priceValue: 150000 },
    { id: '6', name: 'Striped Shirt', thumbnail: '/imgs/productHighlight/Striped Shirt.jpg', priceDiscount: 120000, priceValue: 120000 },
    {
      id: '7',
      name: 'Winter-Striped Tee Dress Black',
      thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-black.jpg',
      priceDiscount: 120000,
      priceValue: 120000,
    },
    {
      id: '8',
      name: 'Winter-Striped Tee Dress White',
      thumbnail: '/imgs/productHighlight/Winter-Striped Tee Dress-white.jpg',
      priceDiscount: 120000,
      priceValue: 120000,
    },
  ]
  const [activePrice, setActivePrice] = useState<IProductPrice>(productDetail.productPrices[0])
  const dispatch = useAppDispatch()

  const handleAddProduct = () => {
    const cartItem: ICartItem = {
      productId: productDetail.id,
      productName: productDetail.name,
      priceId: activePrice.id,
      priceName: activePrice.priceName,
      priceValue: activePrice.priceValue,
      priceDiscount: activePrice.priceDiscount,
      percentNumber: activePrice.percentNumber,
      thumbnail: activePrice.thumbnail ?? productDetail.thumbnail,
      quantity: 1,
      quantityLeft: activePrice.quantityLeft,
    }
    dispatch(sessionActions.addProductToCart(cartItem))
  }
  return (
    <>
      <SEO title="Paris Long Tee" />
      <div className="container lg:py-24 mx-auto">
        <div className="container mx-auto flex flex-wrap lg:px-0 px-3">
          <div className="lg:w-3/5 w-full relative">
            <ProductGallery images={productDetail.gallery} />
            {activePrice.percentNumber && (
              <span className="shadow absolute top-5 right-5 px-2 py-1 text-base md:text-lg rounded-lg text-gray-900 bg-white">
                {activePrice.percentNumber}%
              </span>
            )}
          </div>
          <div className="lg:w-2/5 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h1 className="text-gray-900 text-4xl title-font font-medium mb-5">{productDetail.name}</h1>
            <p className="leading-relaxed">{productDetail.description}</p>
            <div className="flex flex-wrap my-6 space-x-2 items-center">
              {productDetail.productPrices?.length > 1 &&
                productDetail.productPrices.map((price, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer px-4 py-2 rounded-full border border-gray-300 ${
                      activePrice.id === price.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    onClick={() => setActivePrice(price)}
                  >
                    {price.priceName}
                  </div>
                ))}
            </div>
            <div className="flex">
              <p className="title-font font-medium text-2xl text-gray-800 ">
                <span className={activePrice.priceDiscount ? 'line-through pr-3' : ''}>{formatCurrency(activePrice.priceValue)}</span>
                {activePrice.priceDiscount && <span className="text-red-500">{formatCurrency(activePrice.priceDiscount)}</span>}
              </p>
            </div>
            <button
              onClick={() => handleAddProduct()}
              className="mt-6 w-full flex justify-between ml-auto text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded"
            >
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
