import { NoSymbolIcon, CheckIcon } from '@heroicons/react/24/outline'
import NcInputNumber from '@/shared/NcInputNumber'
import Price from '@/shared/Price'
import { Product, PRODUCTS } from '@/data/data'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import Image from 'next/image'
import Link from 'next/link'
import SummaryPrice from '@/components/Checkout/SummaryPrice'
import CartList from '@/components/Checkout/CartList'

const CartPage = () => {
  const renderStatusSoldout = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <NoSymbolIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">Sold Out</span>
      </div>
    )
  }

  const renderStatusInstock = () => {
    return (
      <div className="rounded-full flex items-center justify-center px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <CheckIcon className="w-3.5 h-3.5" />
        <span className="ml-1 leading-none">In Stock</span>
      </div>
    )
  }

  return (
    <div className="nc-CartPage">
      <div className="container py-16 lg:pb-28 lg:pt-20 ">
        <div className="mb-12 sm:mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">Giỏ hàng của bạn</h2>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12" />

        <div className="flex flex-col lg:flex-row">
          <CartList />
          <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="sticky top-28">
              <h3 className="text-lg font-semibold ">Giá tiền đơn hàng</h3>
              <SummaryPrice />
              <ButtonPrimary href="/checkout" className="mt-8 w-full">
                Thanh toán
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
