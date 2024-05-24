'use client'

import { Route } from '@/routers/types'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import React from 'react'
import AccountInformation from '@/components/Account/AccountInformation'
import AccountOrder from '@/components/Account/AccountOrder'
import AccountPass from '@/components/Account/AccountPass'
import AccountSavelist from '@/components/Account/AccountSavelist'

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

const PageAbout = () => {
  const searchParams = useSearchParams()
  const tabId = searchParams?.get('tab')
  const pathname = usePathname()
  const router = useRouter()
  const thisPathname = usePathname()

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
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Hoàng Đinh Quang,</span> quanghoang0403@gmail.com · Tp. Hồ Chí Minh
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
        {(!tabId || tabId == AccountTab.Information) && <AccountInformation />}
        {tabId == AccountTab.Order && <AccountOrder />}
        {tabId == AccountTab.Savelist && <AccountSavelist />}
        {tabId == AccountTab.Pass && <AccountPass />}
      </div>
    </div>
  )
}

export default PageAbout
