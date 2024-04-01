import React, { useCallback, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { IconButton } from '@material-tailwind/react'
import CartList from '@/components/CartList'
import Title from '@/components/Title'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook'
import Input from '@/components/Controller/Input'
import { useAppMutation, useAppQuery } from '@/hooks/queryHook'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import AuthService from '@/services/auth.service'
import { sessionActions } from '@/redux/features/sessionSlice'
import CustomerInfo from '@/components/CustomerInfo'
import OrderService from '@/services/order.service'
import WhiteCard from '@/components/WhiteCard'

// export async function getServerSideProps() {
//   const cities = await fetch('API_ENDPOINT_1')
//   const productHighlight1 = await res1.json()

//   const res2 = await fetch('API_ENDPOINT_2')
//   const promoProduct2 = await res2.json()

//   // Pass fetched data to the page component as props
//   return {
//     props: {
//       productHighlight1,
//       promoProduct2,
//     },
//   }
// }

export default function CartPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })

  const dispatch = useAppDispatch()
  const totalQuantity = useAppSelector((state) => state.session.totalQuantity)
  const totalPrice = useAppSelector((state) => state.session.totalPrice)

  const handleCheckout = useCallback(async (data: ICreateOrderRequest) => {
    return OrderService.checkout(data)
  }, [])

  const mutation = useAppMutation(handleCheckout, async (res: ICreateOrderResponse) => {
    // Handle after create
  })

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)

  const renderCart = () => {
    return (
      <>
        <section className="md:w-2/3">
          <CartList />
        </section>
        <section className="mt-6 md:mt-0 md:w-1/3 h-full">
          <WhiteCard>
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
          </WhiteCard>
          <WhiteCard className="mt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomerInfo register={register} errors={errors} isShipping cityId={0} districtId={0} wardId={0} />
            </form>
            <button className="text-lg mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Thanh toán</button>
          </WhiteCard>
        </section>
      </>
    )
  }
  return (
    <>
      <SEO title="Giỏ hàng" />
      <div className="bg-gray-100">
        <Title title="Giỏ hàng" />
        <div className="container mx-auto pb-6 sm:pb-16 justify-center px-6 md:flex md:space-x-6 xl:px-0">
          {totalQuantity > 0 ? renderCart() : <div>Không có sản phẩm nào trong giỏ hàng</div>}
        </div>
      </div>
    </>
  )
}
