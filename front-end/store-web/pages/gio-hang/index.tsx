import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'

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
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <section className="rounded-lg md:w-2/3">
            {cartItems?.length > 0 &&
              cartItems.map((cart, index) => {
                return (
                  <div key={index} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                    <Image width={300} height={300} src={cart.thumbnail} alt={cart.name} className="w-full rounded-lg sm:w-40" />
                    <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div className="mt-5 sm:mt-0">
                        <h2 className="text-lg font-bold text-gray-900">{cart.name}</h2>
                        {cart.priceName && <p className="mt-1 text-xs text-gray-700">{cart.priceName}</p>}
                      </div>
                      <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div className="flex items-center border-gray-100">
                          <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"> - </span>
                          <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value={cart.quantity} min="1" />
                          <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"> + </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm">{formatCurrency(cart.priceValue)}</p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </section>
          <section className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
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
          </section>
        </div>
      </div>
    </>
  )
}
