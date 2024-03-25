import React, { useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { IconButton } from '@material-tailwind/react'
import CartList from '@/components/CartList'
import Title from '@/components/Title'
import { useAppSelector } from '@/hooks/reduxHook'

export default function CartPage() {
  const totalQuantity = useAppSelector((state) => state.session.totalQuantity)
  const totalPrice = useAppSelector((state) => state.session.totalPrice)

  return (
    <>
      <SEO title="Giỏ hàng" />
      {totalQuantity > 0 ? (
        <div className="bg-gray-100">
          <Title title="Giỏ hàng" />
          <div className="container mx-auto justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <section className="rounded-lg md:w-2/3">
              <CartList />
            </section>
            <section className="rounded-lg mt-6 md:mt-0 md:w-1/3 h-full">
              <div className="rounded-lg border bg-white p-6 shadow-md mb-6 "></div>
              <div className="rounded-lg border bg-white p-6 shadow-md">
                <div className="mb-2 flex justify-between">
                  <p className="text-gray-700">Tổng tiền</p>
                  <p className="text-gray-700">{formatCurrency(totalPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-700">{formatCurrency(20000)}</p>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between">
                  <p className="text-lg font-bold text-gray-900">THANH TOÁN</p>
                  <p className="mb-1 text-lg font-bold text-gray-900">{formatCurrency(totalPrice + 20000)}</p>
                </div>
                <p className="text-sm text-gray-700">Đã bao gồm thuế VAT</p>
                <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">Thanh toán</button>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div>Không có sản phẩm nào trong giỏ hàng</div>
      )}
    </>
  )
}
