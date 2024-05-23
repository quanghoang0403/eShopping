import React, { useEffect, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetStaticProps } from 'next'
import Image from 'next/image'
import ProductList from '@/components/Product/ProductList'
import ProductGallery from '@/components/Product/ProductGallery'
import { formatCurrency } from '@/utils/string.helper'
import { useAppDispatch } from '@/hooks/reduxHook'
import { sessionActions } from '@/redux/features/sessionSlice'
import Title from '@/components/Common/Title'
import WhiteCard from '@/components/Common/WhiteCard'
import Link from 'next/link'
import CustomerInfo, { ICustomerInfo, defaultCustomerInfo } from '@/components/Common/CustomerInfo'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useAppMutation } from '@/hooks/queryHook'
import OrderService from '@/services/order.service'

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
      itemName: 'Áo kẻ sọc trắng - Size medium',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      productUrl: '/san-pham/1',
      quantity: 3,
      percentNumber: 10,
      priceValue: 100000,
      priceDiscount: 80000,
      totalPrice: 240000,
      totalPriceValue: 300000,
      totalPriceDiscount: 240000,
    },
    {
      itemName: 'Áo kẻ sọc trắng - Size medium',
      thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg',
      productUrl: '/san-pham/1',
      quantity: 2,
      priceValue: 100000,
      totalPrice: 200000,
      totalPriceValue: 200000,
      totalPriceDiscount: 0,
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
      <div className="bg-gray-100">
        <Title title={`Đơn hàng #${order.code}`} />
        <div className="container mx-auto pb-6 sm:pb-16 justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <section className="md:w-1/2">
            {order.orderItems.map((item, index) => {
              return (
                <Link key={index} href={`/san-pham/${item.productUrl}`}>
                  <WhiteCard className="justify-between flex justify-start mb-2 md:mb-4 cursor-pointer !p-3">
                    <div className="relative mr-3">
                      <Image width={150} height={150} src={order.orderItems[0].thumbnail} alt="" className="rounded-lg h-fit w-full w-32 mr-4" />
                      {item.percentNumber && (
                        <span className="shadow absolute top-2 right-1.5 px-1 py-0.5 text-xs rounded-lg text-gray-900 bg-white font-semibold">
                          {item.percentNumber}%
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex flex-col">
                        <div>
                          <p className="text-base text-gray-900 line-clamp-2">{item.itemName}</p>
                        </div>
                        <div className="text-sm text-gray-800 mt-1">
                          <p>Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-sm text-gray-800 mt-1">
                          <p>
                            Giá: <span className={item.priceDiscount ? 'line-through pr-2' : ''}>{formatCurrency(item.priceValue)}</span>
                            {item.priceDiscount && <span className="text-red-500">{formatCurrency(item.priceDiscount)}</span>}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm zmd:text-base text-gray-900 font-semibold">
                        <p className="float-right">Tổng: {formatCurrency(item.totalPrice)}</p>
                      </div>
                    </div>
                  </WhiteCard>
                </Link>
              )
            })}
          </section>
          <section className="mt-6 md:mt-0 md:w-1/2 h-full">
            <WhiteCard>
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
                <div className="mt-2">
                  <label>
                    <b>Lý do hủy: </b>
                    {order.reason}
                  </label>
                </div>
              )}
              <button className="text-lg mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Cập nhật</button>
            </WhiteCard>
          </section>
        </div>
      </div>
    </>
  )
}
