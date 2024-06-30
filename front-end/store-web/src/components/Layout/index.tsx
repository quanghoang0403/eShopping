import SiteHeader from '@/components/Layout/SiteHeader'
import SiteFooter from '@/components/Layout/SiteFooter'
import toast, { Toaster } from 'react-hot-toast'
import Loading from '@/shared/Loading'
import { Roboto } from 'next/font/google'
import { cx } from '@/utils/string.helper'
import { usePromiseTracker } from 'react-promise-tracker'
import { useEffect, useState } from 'react'
import ProductCategoryService from '@/services/productCategory.service'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { commonActions } from '@/redux/features/commonSlice'
import SignalRService from '@/services/signalR.service'
import { OrderHubConstants } from '@/constants/hub.constants'
import { getOrderStatusText } from '@/enums/enumOrderStatus'
import { getCustomerId } from '@/utils/common.helper'

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
  const [customerId, setCustomerId] = useState<string | undefined>()
  const dispatch = useAppDispatch()
  const menu = useAppSelector((state) => state.common.menu) as INavItemType[]

  useEffect(() => {
    // Ensure the Toaster is rendered only on the client-side
    setIsClient(true)
    if (menu.length == 0) fetchMenuAsync()
  }, [menu])

  useEffect(() => {
    fetchCustomerId()
  }, [])

  useEffect(() => {
    if (isClient && customerId) {
      const signalRService = new SignalRService(customerId)
      signalRService.startConnection()

      signalRService.on(OrderHubConstants.UPDATE_STATUS_BY_STAFF, (orderName: string, status: number) => {
        toast.success(`Đơn hàng ${orderName} ${getOrderStatusText(status)}`, {
          duration: 5000,
        })
      })
      return () => {
        signalRService.off(OrderHubConstants.UPDATE_STATUS_BY_STAFF)
        signalRService.stopConnection()
      }
    }
  }, [isClient, customerId])

  const fetchCustomerId = async () => {
    const customerId =  await getCustomerId()
    setCustomerId(customerId)
  }

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
