import React from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import Price from '@/shared/Price'

interface IProps {
  orderItems: IOrderItem[]
}

const OrderItemList = ({ orderItems }: IProps) => {
  return orderItems.map((item, index) => {
    const { percentNumber, thumbnail, productVariantName, priceValue, priceDiscount, productName, quantity, totalPrice } = item
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="relative h-24 w-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image fill sizes="100px" src={thumbnail} alt={productName} className="h-full w-full object-cover object-center" />
          {percentNumber && (
            <span className="shadow absolute top-2 right-1.5 px-1 py-0.5 text-xs rounded-lg text-gray-900 bg-white font-semibold">{percentNumber}%</span>
          )}
        </div>
        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium line-clamp-1">{productName}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{productVariantName}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>XL</span>
                </p>
              </div>
              <div className="flex flex-col items-end ">
                <Price priceValue={priceValue} priceDiscount={priceDiscount} className="mt-0.5 ml-2" contentClass="text-sm" />
                <div>
                  <p className="float-right mt-1 text-base text-gray-900 font-medium">Tổng: {formatCurrency(totalPrice)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400 flex items-center">
              <span className="hidden sm:inline-block">Số lượng:</span>
              <span className="inline-block sm:hidden">x</span>
              <span className="ml-2">{quantity}</span>
            </p>
            <div className="flex">
              <button type="button" className="font-medium text-indigo-600 dark:text-primary-500 ">
                Đánh giá sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  })
}

export default OrderItemList
