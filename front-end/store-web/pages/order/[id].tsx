import React, { useEffect, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import { sessionActions } from '@/redux/features/sessionSlice'
import Link from 'next/link'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import OrderService from '@/services/order.service'
import { useAppMutation } from '@/hooks/useQuery'
import CustomerInfo, { ICustomerInfo } from '@/components/Common/Customer/CustomerInfo'
import ButtonPrimary from '@/shared/Button/ButtonPrimary'
import OrderItemList from '@/components/Common/Order/OrderItemList'

const order: IOrderDetail = {
  id: '1',
  code: '1',
  status: 6,
  shipPhoneNumber: '0946290739',
  shipName: 'Nguyễn Thị Thi',
  shipAddress: '465 Nguyễn Văn Cừ',
  shipEmail: 'quanghoang0403@gmail.com',
  shipFullAddress: '465 Nguyễn Văn Cừ Tp. Buôn Ma Thuột, Đăk Lăk',
  cityId: 1,
  districtId: 3,
  wardId: 0,
  createdTime: 'Now',
  statusName: 'Completed',
  totalQuantity: 3,
  totalPrice: 560000,
  totalAmount: 580000,
  deliveryFee: 20000,
  note: 'Gấp gọn gàng cho em',
  reason: 'Đổi ý không mua nữa',
  orderItems: [
    {
      productName: 'Áo kẻ sọc trắng',
      priceName: 'Size medium',
      itemName: 'Áo kẻ sọc trắng - Size medium',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      productUrl: '/san-pham/1',
      quantity: 3,
      percentNumber: 10,
      priceValue: 100000,
      priceDiscount: 80000,
      totalPrice: 240000,
    },
    {
      productName: 'Áo kẻ sọc trắng',
      priceName: 'Size medium',
      itemName: 'Áo kẻ sọc trắng - Size medium',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      productUrl: '/san-pham/1',
      quantity: 2,
      priceValue: 100000,
      totalPrice: 200000,
    },
  ],
}

const customerInfo: ICustomerInfo = {
  name: order.shipName,
  phoneNumber: order.shipPhoneNumber,
  email: order.shipEmail,
  address: order.shipAddress,
  note: order.note,
  cityId: order.cityId ?? 0,
  districtId: order.districtId ?? 0,
  wardId: order.wardId ?? 0,
}

export default function OrderPage() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })

  const mutation = useAppMutation(
    async (data: IUpdateOrderRequest) => OrderService.updateOrder(data),
    async (res: boolean) => {
      // Handle after update
    }
  )

  const onSubmit: SubmitHandler<FieldValues> = (data: any) => mutation.mutate(data)
  return (
    <>
      <SEO title="Paris Long Tee" />
      <div className="container py-4 lg:pb-28 lg:pt-12 ">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">{`Đơn hàng #${order.code}`}</h2>
        </div>
        <div className="mx-auto pb-6 sm:pb-16 justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="w-full lg:w-[50%] ">
            <div className="divide-y divide-y-slate-200 dark:divide-slate-700">
              <OrderItemList orderItems={order.orderItems} />
            </div>
          </div>
          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16 "></div>
          <div className="flex-1">
            <div className="mb-2 flex justify-between gap-3">
              <div>
                <label>
                  <b>Mã đơn hàng: </b> #{order.code}
                </label>
              </div>
              <div>
                <div>
                  <label className="px-2 py-1 rounded-full bg-green-700 text-white">{order.statusName}</label>
                </div>
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <b>Tổng tiền</b>
              <p className="text-gray-700">{formatCurrency(order.totalPrice)}</p>
            </div>
            <div className="mb-2 flex justify-between">
              <b>Shipping</b>
              <p className="text-gray-700">{formatCurrency(order.deliveryFee)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg font-bold text-gray-900">ĐÃ THANH TOÁN</p>
              <p className="mb-1 text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
            </div>
            <hr className="my-4" />
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomerInfo register={register} errors={errors} isShipping customer={customerInfo} />
            </form>
            {order.reason && (
              <div className="mt-4">
                <label>
                  <b>Lý do hủy: </b>
                  {order.reason}
                </label>
              </div>
            )}
            <ButtonPrimary className="mt-4 w-full" type="submit">
              Cập nhật
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </>
  )
}
