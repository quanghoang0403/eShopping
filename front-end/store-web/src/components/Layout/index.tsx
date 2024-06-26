import SiteHeader from '@/components/Layout/SiteHeader'
import SiteFooter from '@/components/Layout/SiteFooter'
import { Toaster } from 'react-hot-toast'
import Loading from '@/shared/Loading'
import { Roboto } from 'next/font/google'
import { cx } from '@/utils/string.helper'
import { usePromiseTracker } from 'react-promise-tracker'
import { useEffect, useState } from 'react'
import ProductCategoryService from '@/services/productCategory.service'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { commonActions } from '@/redux/features/commonSlice'
import SignalRService from '@/services/signalR.service'

const fonts = Roboto({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  weight: ['900', '400', '500', '700'],
})

interface ILayout {
  children: React.ReactNode
}

const Layout: React.FC<ILayout> = ({ children }) => {
  const { promiseInProgress } = usePromiseTracker()
  const [isClient, setIsClient] = useState(false)
  const dispatch = useAppDispatch()
  const menu = useAppSelector((state) => state.common.menu) as INavItemType[]
  const customerId = useAppSelector((state) => state.session.customerId)

  useEffect(() => {
    // Ensure the Toaster is rendered only on the client-side
    setIsClient(true)
    if (menu.length == 0) fetchMenuAsync()
  }, [menu])

  useEffect(() => {
    if (isClient && customerId) {
      const signalRService = new SignalRService(customerId);
      signalRService.startConnection()

      return () => {
        signalRService.stopConnection()
      }
    }
  }, [isClient, customerId])

  const fetchMenuAsync = async () => {
    const res = await ProductCategoryService.getMenuCategory()
    if (res) {
      dispatch(commonActions.updateMenu(res))
    }
  }

  return (
    <main className={fonts.className}>
      <SiteHeader />
      {isClient && <Toaster />}
      {promiseInProgress && <Loading />}
      {children}
      <SiteFooter />
    </main>
  )
}

export default Layout
