import React, { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { cx } from '@/utils/string.helper'
import { IconButton } from '@material-tailwind/react'
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'
import Selection from '../Controller/Selection'
import Link from 'next/link'
import WhiteCard from '../Common/WhiteCard'

interface IProps {
  isSmall?: boolean
}

export default function CartList(props: IProps) {
  const { isSmall } = props
  const cartItems = useAppSelector((state) => state.session.cartItems)
  const dispatch = useAppDispatch()

  const removeCartItem = (productId: string, productPriceId: string) => {
    dispatch(sessionActions.removeProductFromCart({ productId, productPriceId }))
  }

  const updateCartItem = (productId: string, productPriceId: string, quantity: number) => {
    dispatch(sessionActions.updateProductInCart({ productId, productPriceId, quantity }))
  }

  return (
    <>
      {cartItems?.length > 0 &&
        cartItems.map((cart: any, index: number) => {
          const link = `/san-pham/${cart.productUrl}`
          const options: IOption[] = [...Array(cart.quantityLeft)].map((_, index) => {
            return { id: index + 1 }
          })
          return (
            <WhiteCard key={index} className={cx('justify-between sm:flex sm:justify-start', isSmall ? 'mb-2 p-2' : 'mb-6')}>
              <Link href={link} className="relative">
                <Image
                  width={300}
                  height={300}
                  src={cart.thumbnail}
                  alt={cart.productName}
                  className={cx('rounded-lg h-fit', isSmall ? 'w-28' : 'w-full sm:w-40')}
                />
                {cart.percentNumber ? (
                  <span className="shadow absolute top-3 right-2 px-1 py-0.5 text-xs rounded-lg text-gray-900 bg-white font-semibold">
                    {cart.percentNumber}%
                  </span>
                ):''}
              </Link>
              <div className={cx('flex flex-col w-full', isSmall ? 'ml-2' : ' sm:ml-6')}>
                <div className="flex flex-row justify-between">
                  <div className="mt-5 sm:mt-0">
                    <Link href={link} className={cx('text-gray-900', isSmall ? 'text-base line-clamp-1' : 'text-lg line-clamp-2')}>
                      {cart.productName}
                    </Link>
                    {cart.priceName && <p className={cx('text-sm text-gray-700', isSmall ? '' : 'mt-1')}>{cart.priceName}</p>}
                  </div>
                  <IconButton variant="text" color="blue-gray" onClick={() => removeCartItem(cart.productId, cart.productPriceId)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-5 w-5 cursor-pointer duration-150 hover:text-gray-900"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </IconButton>
                </div>
                <div className={cx('flex flex-row justify-between', isSmall ? 'mt-1' : 'mt-4')}>
                  <div className="flex items-center">
                    <p className="text-sm mr-2">Số lượng</p>
                    <Selection
                      name="quantity"
                      defaultValue={cart.quantity}
                      options={options}
                      onChange={(value: any) => updateCartItem(cart.productId, cart.productPriceId, value)}
                    />
                  </div>
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center space-x-4">
                      <p className="text-sm">
                        <span className={cart.priceDiscount ? 'line-through pr-2' : ''}>{formatCurrency(cart.priceValue)}</span>
                        {cart.priceDiscount ? <span className="text-red-500">{formatCurrency(cart.priceDiscount)}</span>:''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-row justify-end">
                  <p className="text-sm font-bold">Tổng: {formatCurrency((cart.priceDiscount || cart.priceValue) * cart.quantity)}</p>
                </div>
              </div>
            </WhiteCard>
          )
        })}
    </>
  )
}
