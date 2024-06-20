import React, { FC } from 'react'
import { Transition } from '@headlessui/react'
import Price from '@/shared/Price'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  cartItem: ICartItem
  show: boolean
}

const NotifyAddToCart: FC<Props> = ({ cartItem, show }) => {
  return (
    <Transition
      appear
      show={show}
      className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      <p className="block text-base font-semibold leading-none">Đã thêm vào giỏ hàng!</p>
      <hr className=" border-slate-200 dark:border-slate-700 my-4" />
      <div className="flex ">
        <div className="h-24 w-20 relative flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <Image src={cartItem.thumbnail} alt={cartItem.productName} fill sizes="100px" className="h-full w-full object-contain object-center" />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{cartItem.productName}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{cartItem.productVariantName}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{cartItem.productSizeName}</span>
                </p>
              </div>
              <Price priceValue={cartItem.priceValue} priceDiscount={cartItem.priceDiscount} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">Số lượng: {cartItem.quantity}</p>
            <div className="flex">
              <Link href="/checkout" type="button" className="font-medium text-primary-6000 dark:text-primary-500 ">
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default NotifyAddToCart
