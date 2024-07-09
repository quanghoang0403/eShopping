'use client'

import { Route } from '@/routers/types'
import AddressService from '@/services/address.service'
import CustomerService from '@/services/customer.service'
import { getCustomerId } from '@/utils/common.helper'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { createContext, Suspense, useContext, useEffect, useState } from 'react'

const customerContext = createContext<ICustomer>({
  id: '',
  accountId: '',
  cityId: null,
  districtId: null,
  wardId: null,
  address: '',
  note: '',
  email: '',
  emailConfirmed: false,
  phoneNumber: '',
  fullName: '',
  thumbnail: '',
  birthday: null,
  gender: 0,
  code: 0
})

enum AccountTab {
  Information = 'account-information',
  Savelist = 'account-savelist',
  Order = 'account-order',
  Pass = 'account-pass',
}
interface ITab {
  name: string
  tab: AccountTab
}

const tabs = [
  {
    name: 'Thông tin tài khoản',
    tab: AccountTab.Information,
  },
  {
    name: 'Đơn hàng của tôi',
    tab: AccountTab.Order,
  },
  {
    name: 'Danh sách yêu thích',
    tab: AccountTab.Savelist,
  },
  {
    name: 'Đổi mật khẩu',
    tab: AccountTab.Pass,
  },
]

const AccountInformation = React.lazy(() => import('@/components/Account/AccountInformation'))
const AccountOrder = React.lazy(() => import('@/components/Account/AccountOrder'))
const AccountPass = React.lazy(() => import('@/components/Account/AccountPass'))
const AccountWishList = React.lazy(() => import('@/components/Account/AccountWishList'))

const PageAbout = () => {
  const searchParams = useSearchParams()
  const tabId = searchParams?.get('tab')
  const pathname = usePathname()
  const router = useRouter()
  const thisPathname = usePathname()
  const [customer,setCustomer] = useState<ICustomer>()
  const [city,setCity] = useState<string>('')

  const getCustomer = async()=>{
    const cities = await AddressService.getCities()
    const customerId = await getCustomerId()
    if(customerId){
      const res = await CustomerService.getCustomerById(customerId)
      if(res){
        setCustomer(res)
      }
    }
    if(cities && customer?.cityId){
      setCity(cities.find(c=>c.id === customer?.cityId)?.name as string)
    }
  }

  useEffect(()=>{
    getCustomer();
  },[])

  const handleOnChangeTab = (tab: string) => {
    router.push(`${thisPathname}/?tab=${tab}` as Route)
  }

  return (
    <div className="nc-AccountCommonLayout container">
      <div className="mt-14 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold">Tài khoản của tôi</h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">{customer?.fullName},</span> {customer?.email} · {city}
            </span>
          </div>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex justify-around space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {tabs.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleOnChangeTab(item.tab)}
                  className={`block py-5 md:py-8 border-b-2 flex-shrink-0 text-sm sm:text-base cursor-pointer ${
                    pathname === item.tab
                      ? 'border-primary-500 font-medium text-slate-900 dark:text-slate-200'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {item.name}
                </div>
              )
            })}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        <Suspense fallback={<div>Loading...</div>}>
          <customerContext.Provider value={customer as ICustomer}>
            {(!tabId || tabId == AccountTab.Information) && <AccountInformation/>}
            {tabId == AccountTab.Order && <AccountOrder />}
            {tabId == AccountTab.Savelist && <AccountWishList />}
            {tabId == AccountTab.Pass && <AccountPass />}
          </customerContext.Provider>
        </Suspense>
      </div>
    </div>
  )
}
export const useCustomerContext = () => useContext(customerContext)
export default PageAbout
