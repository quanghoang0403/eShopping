import React, { useCallback, useState } from 'react'
import SEO from '@/components/Layout/SEO'
import { IconButton, Tab, TabPanel, Tabs, TabsBody, TabsHeader } from '@material-tailwind/react'
import Title from '@/components/Title'
import { useAppMutation, useAppQuery } from '@/hooks/queryHook'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import CustomerInfo from '@/components/CustomerInfo'
import { FaUser } from 'react-icons/fa'
import { IoSettingsSharp } from 'react-icons/io5'
import { FaCartShopping } from 'react-icons/fa6'
import CustomerService from '@/services/customer.service'
import Input from '@/components/Controller/Input'
import { INPUT_TYPES } from '@/components/Controller/CustomInputText'
import WhiteCard from '@/components/WhiteCard'
import Link from 'next/link'
import Image from 'next/image'

const orderList: IOrder[] = [
  {
    id: '1',
    code: '1',
    status: EnumOrderStatus.Completed,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Now',
    statusName: 'Completed',
    totalQuantity: 3,
    totalPriceValue: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [{ quantity: 1, priceName: 'Áo kẻ sọc trắng', thumbnail: '/imgs/productHighlight/Classic Short Sleeves Shirt.jpg' }],
  },
  {
    id: '2',
    code: '3',
    status: EnumOrderStatus.Completed,
    shipFullAddress: '465 Nguyễn Văn Cừ',
    createdTime: 'Now',
    statusName: 'Completed',
    totalQuantity: 3,
    totalPriceValue: 300000,
    totalAmount: 250000,
    deliveryFee: 20000,
    orderItems: [{ quantity: 2, priceName: 'Áo kẻ sọc đen', thumbnail: '/imgs/productHighlight/Basic Tee With Long Sleeves Red.jpg' }],
  },
]

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
            <Tab className="p-2 text-lg" value="1">
              <div className="flex items-center gap-2">
                <FaUser width={5} height={5} />
                Thông tin cá nhân
              </div>
            </Tab>
            <Tab className="p-2 text-lg" value="2">
              <div className="flex items-center gap-2">
                <IoSettingsSharp width={5} height={5} />
                Đổi mật khẩu
              </div>
            </Tab>
            <Tab className="p-2 text-lg" value="3">
              <div className="flex items-center gap-2">
                <FaCartShopping width={5} height={5} />
                Đơn hàng của tôi
              </div>
            </Tab>
          </TabsHeader>
          <TabsBody className="mb-8">
            <TabPanel value="1">
              <WhiteCard>
                <form onSubmit={handleSubmitUpdateProfile(onSubmitUpdateProfile)}>
                  <CustomerInfo register={registerUpdateProfile} errors={errorsUpdateProfile} isShipping cityId={0} districtId={0} wardId={0} />
                </form>
                <button className="text-lg mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Cập nhật thông tin</button>
              </WhiteCard>
            </TabPanel>
            <TabPanel value="2">
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
                </form>
                <button className="text-lg mt-6 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600">Cập nhật mật khẩu</button>
              </WhiteCard>
            </TabPanel>
            <TabPanel value="3">
              {orderList?.length > 0 &&
                orderList.map((item, index) => {
                  const link = `/don-hang/${item.id}`
                  return (
                    <WhiteCard key={index} className="justify-between sm:flex sm:justify-start mb-6">
                      <Link href={link} className="relative">
                        <Image width={300} height={300} src={item.thumbnail} alt={item.productName} className="rounded-lg h-fit w-full sm:w-40" />
                        {item.percentNumber && (
                          <span className="shadow absolute top-3 right-2 px-1 py-0.5 text-xs rounded-lg text-gray-900 bg-white font-semibold">
                            {item.percentNumber}%
                          </span>
                        )}
                      </Link>
                      <div className={cx('flex flex-col w-full', isSmall ? 'ml-2' : ' sm:ml-6')}>
                        <div className="flex flex-row justify-between">
                          <div className="mt-5 sm:mt-0">
                            <Link href={link} className={cx('text-gray-900', isSmall ? 'text-base line-clamp-1' : 'text-lg line-clamp-2')}>
                              {item.productName}
                            </Link>
                            {item.priceName && <p className={cx('text-sm text-gray-700', isSmall ? '' : 'mt-1')}>{cart.priceName}</p>}
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
                        <div className="flex flex-row justify-between mt-4">
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
                                <span className={item.priceDiscount ? 'line-through pr-2' : ''}>{formatCurrency(cart.priceValue)}</span>
                                {item.priceDiscount && <span className="text-red-500">{formatCurrency(cart.priceDiscount)}</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-row justify-end">
                          <p className="text-sm font-bold">Tổng: {formatCurrency((cart.priceDiscount ?? cart.priceValue) * cart.quantity)}</p>
                        </div>
                      </div>
                    </WhiteCard>
                  )
                })}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </>
  )
}
