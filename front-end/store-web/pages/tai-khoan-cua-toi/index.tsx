import React, { useCallback, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import { IconButton, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import Title from '@/components/Common/Title'
import { useAppMutation, useAppQuery } from '@/hooks/queryHook'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import CustomerInfo, { defaultCustomerInfo } from '@/components/Common/CustomerInfo'
import { FaUser } from 'react-icons/fa'
import { IoSettingsSharp } from 'react-icons/io5'
import { FaCartShopping } from 'react-icons/fa6'
import CustomerService from '@/services/customer.service'
import Input from '@/components/Controller/Input'
import { INPUT_TYPES } from '@/components/Controller/CustomInputText'
import WhiteCard from '@/components/Common/WhiteCard'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/utils/string.helper'
import authMiddleware from '@/middlewares/authMiddleware'
import { GetServerSideProps } from 'next'

const orderList: IOrder[] = [
  {
    id: '1',
    code: '1',
    status: 6,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Now',
    statusName: 'Completed',
    totalQuantity: 3,
    totalPrice: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [
      { quantity: 1, priceName: 'Áo kẻ sọc trắng', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg' },
      { quantity: 2, priceName: 'Áo kẻ sọc đen', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' },
    ],
  },
  {
    id: '2',
    code: '3',
    status: 6,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Now',
    statusName: 'Completed',
    totalQuantity: 3,
    totalPrice: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [{ quantity: 2, priceName: 'Áo kẻ sọc đen', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' }],
  },
]

// export const getServerSideProps: GetServerSideProps<IProps> = authMiddleware(async (context) => {})

export default function MyAccountPage() {
  const {
    handleSubmit: handleSubmitUpdateProfile,
    register: registerUpdateProfile,
    formState: { errors: errorsUpdateProfile },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })

  const {
    handleSubmit: handleSubmitUpdatePassword,
    register: registerUpdatePassword,
    formState: { errors: errorsUpdatePassword },
  } = useForm({ mode: 'onBlur', criteriaMode: 'all' })

  const mutationUpdateProfile = useAppMutation(async (data: IUpdateCustomerRequest) => CustomerService.updateCustomer(data))
  const mutationUpdatePassword = useAppMutation(async (data: IUpdatePasswordRequest) => CustomerService.updatePassword(data))
  const onSubmitUpdateProfile: SubmitHandler<FieldValues> = (data: any) => mutationUpdateProfile.mutate(data)
  const onSubmitUpdatePassword: SubmitHandler<FieldValues> = (data: any) => mutationUpdatePassword.mutate(data)
  return (
    <>
      <SEO title="Tài khoản của tôi" />
      <Title title="Tài khoản của tôi" />
      <div className="max-w-screen-md mx-auto bg-gray-100 mx-auto">
        <Tabs value="1">
          <TabsHeader className="mx-4 mt-8 p-3 bg-gray-300">
            <Tab className="p-1 md:p-2 text-lg" value="1">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <FaCartShopping width={5} height={5} className="hidden md:block" />
                Đơn hàng của tôi
              </div>
            </Tab>
            <Tab className="p-1 md:p-2 text-lg" value="2">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <FaUser width={5} height={5} className="hidden md:block" />
                Thông tin cá nhân
              </div>
            </Tab>
            <Tab className="p-1 md:p-2 text-lg" value="3">
              <div className="flex items-center gap-2 text-sm md:text-base">
                <IoSettingsSharp width={5} height={5} className="hidden md:block" />
                Đổi mật khẩu
              </div>
            </Tab>
          </TabsHeader>
          <TabsBody className="mb-8">
            <TabPanel value="1">
              {orderList?.length > 0 &&
                orderList.map((order, index) => {
                  return (
                    <Link key={index} href={`/don-hang/${order.id}`}>
                      <WhiteCard className="justify-between flex justify-start mb-3 md:mb-6 cursor-pointer !p-3">
                        <div className="relative mr-4">
                          <Image width={150} height={150} src={order.orderItems[0].thumbnail} alt="" className="rounded-lg h-fit w-full w-32" />
                          <span className="shadow absolute top-3 right-2 px-1 py-0.5 text-xs rounded-lg text-gray-900 bg-white font-semibold">
                            #{order.code}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between w-full">
                          <div className="flex flex-col">
                            <div>
                              <p className="text-sm text-gray-900 line-clamp-2">Đ/c giao hàng: {order.shipFullAddress}</p>
                            </div>
                            {order.orderItems.length > 0 &&
                              order.orderItems.slice(0, 3).map((item, index) => {
                                return (
                                  <div key={index} className="flex items-center mt-1">
                                    <p className="text-sm mr-2">{`${item.quantity} x ${item.priceName}`}</p>
                                  </div>
                                )
                              })}
                            {order.orderItems.length > 3 && (
                              <div key={index} className="flex items-center mt-1">
                                <p className="text-sm mr-2">...</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-row justify-between mt-4 text-sm zmd:text-base text-gray-900 font-semibold">
                            <div>
                              <p>{order.statusName}</p>
                            </div>
                            <div>
                              <p>{formatCurrency(order.totalAmount)}</p>
                            </div>
                          </div>
                        </div>
                      </WhiteCard>
                    </Link>
                  )
                })}
            </TabPanel>
            <TabPanel value="2">
              <WhiteCard>
                <form onSubmit={handleSubmitUpdateProfile(onSubmitUpdateProfile)}>
                  <CustomerInfo register={registerUpdateProfile} errors={errorsUpdateProfile} isShipping customer={defaultCustomerInfo} />
                  <button className="text-lg mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Cập nhật thông tin</button>
                </form>
              </WhiteCard>
            </TabPanel>
            <TabPanel value="3">
              <WhiteCard>
                <form onSubmit={handleSubmitUpdatePassword(onSubmitUpdatePassword)} className="space-y-3">
                  <div>
                    <Input
                      inputType={INPUT_TYPES.TEXT}
                      label="Mật khẩu hiện tại"
                      password
                      name="currentPassword"
                      register={registerUpdatePassword}
                      patternValidate={{
                        required: true,
                      }}
                      errors={errorsUpdatePassword}
                    />
                  </div>
                  <div>
                    <Input
                      inputType={INPUT_TYPES.TEXT}
                      label="Mật khẩu mới"
                      password
                      name="currentPassword"
                      register={registerUpdatePassword}
                      patternValidate={{
                        required: true,
                      }}
                      errors={errorsUpdatePassword}
                    />
                  </div>
                  <div>
                    <Input
                      inputType={INPUT_TYPES.TEXT}
                      label="Nhập lại mật khẩu mới"
                      password
                      name="confirmPassword"
                      register={registerUpdatePassword}
                      patternValidate={{
                        required: true,
                      }}
                      errors={errorsUpdatePassword}
                    />
                  </div>
                  <button className="text-lg mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Cập nhật mật khẩu</button>
                </form>
              </WhiteCard>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </>
  )
}
