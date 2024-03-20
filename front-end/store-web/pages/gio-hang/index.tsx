import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { IconButton } from '@material-tailwind/react'
import CartList from '@/components/CartList'

export default function CartPage() {
  const cartItems: ICartItem[] = [
    { name: 'Basic Tee Long Sleeves', priceName: 'Blue', thumbnail: '/imgs/productPromo/1.jpg', priceValue: 180000, quantity: 3 },
    { name: 'Basic Tee Long Sleeves', priceName: 'Black', thumbnail: '/imgs/productPromo/2.jpg', priceValue: 200000, quantity: 2 },
    {
      name: 'Basic Tee With Long Sleeves Red',
      thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg',
      priceValue: 120000,
      quantity: 1,
    },
    {
      name: 'Classic Short Sleeves Shirt',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      priceValue: 120000,
      quantity: 1,
    },
    { name: 'Paris Long Tee', thumbnail: '/imgs/productHighlight/Paris Long Tee.jpg', priceValue: 120000, quantity: 1 },
  ]
  return (
    <>
      <SEO title="Cart Page" description="Describe the cart page" />
      <div className="bg-gray-100 pt-10">
        <h1 className="mb-10 text-center text-2xl text-gray-900 uppercase">Giỏ hàng</h1>
        <div className="container mx-auto justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <section className="rounded-lg md:w-2/3">
            <CartList cartItems={cartItems} />
          </section>
          <section className="rounded-lg mt-6 md:mt-0 md:w-1/3 h-full">
            <div className="rounded-lg border bg-white p-6 shadow-md mb-6 "></div>
            <div className="rounded-lg border bg-white p-6 shadow-md">
              <div className="mb-2 flex justify-between">
                <p className="text-gray-700">Tổng tiền</p>
                <p className="text-gray-700">{formatCurrency(600000)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">{formatCurrency(20000)}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold text-gray-900">THANH TOÁN</p>
                <p className="mb-1 text-lg font-bold text-gray-900">{formatCurrency(620000)}</p>
              </div>
              <p className="text-sm text-gray-700">Đã bao gồm thuế VAT</p>
              <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">Thanh toán</button>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
