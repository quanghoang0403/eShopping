import React, { useState } from 'react'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { cx } from '@/utils/common.helper'
import { IconButton } from '@material-tailwind/react'
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'

interface IProps {
  isSmall?: boolean
}

export default function CartList(props: IProps) {
  const { isSmall } = props
  const cartItems = useAppSelector((state) => state.session.cartItems)
  const dispatch = useAppDispatch()

  const removeCartItem = (productId: string, priceId: string) => {
    dispatch(sessionActions.removeProductFromCart({ productId, priceId }))
  }

  const updateCartItem = (productId: string, priceId: string, quantity: number) => {
    dispatch(sessionActions.updateProductInCart({ productId, priceId, quantity }))
  }

  return (
    <>
      {cartItems?.length > 0 &&
        cartItems.map((cart, index) => {
          return (
            <div key={index} className={cx('justify-between rounded-lg bg-white shadow-md sm:flex sm:justify-start', isSmall ? 'mb-2 p-2' : 'mb-6 p-6')}>
              <Image
                width={300}
                height={300}
                src={cart.thumbnail}
                alt={cart.productName}
                className={cx('rounded-lg h-fit', isSmall ? 'w-28' : 'w-full sm:w-40')}
              />
              <div className={cx('flex flex-col w-full', isSmall ? 'ml-2' : ' sm:ml-6')}>
                <div className="flex flex-row justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className={cx('text-gray-900', isSmall ? 'text-base line-clamp-1' : 'text-lg line-clamp-2')}>{cart.productName}</h2>
                    {cart.priceName && <p className={cx('text-sm text-gray-700', isSmall ? '' : 'mt-1')}>{cart.priceName}</p>}
                  </div>
                  <IconButton variant="text" color="blue-gray" onClick={() => removeCartItem(cart.productId, cart.priceId)}>
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
                    <div className="relative inline-block text-left">
                      {/* <div className="flex items-center border-gray-100">
                            <span className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"> - </span>
                            <input className="h-8 w-8 border bg-white text-center text-xs outline-none" type="number" value={cart.quantity} min="1" />
                            <span className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"> + </span>
                        </div> */}
                      <select
                        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-3 py-1 pr-7 rounded shadow leading-tight focus:outline-none focus:ring focus:border-blue-500"
                        defaultValue={cart.quantity}
                        onChange={(e) => updateCartItem(cart.productId, cart.priceId, Number(e.target.value))}
                      >
                        {[...Array(10)].map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center space-x-4">
                      <p className="text-sm">{formatCurrency(cart.priceValue)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-row justify-end">
                  <p className="text-sm font-bold">Tổng: {formatCurrency(cart.priceValue * cart.quantity)}</p>
                </div>
              </div>
            </div>
          )
        })}
    </>
  )
}
