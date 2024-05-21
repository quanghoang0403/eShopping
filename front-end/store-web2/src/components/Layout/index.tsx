import '@/fonts/line-awesome-1.3.0/css/line-awesome.css'
import '@/styles/index.scss'
import 'rc-slider/assets/index.css'
import SiteHeader from '@/components/Layout/SiteHeader'
import SiteFooter from '@/components/Layout/SiteFooter'
import { Toaster } from 'react-hot-toast'
import Loading from '@/shared/Loading'
import { Poppins } from 'next/font/google'
import { cx } from '@/utils/string.helper'
import { usePromiseTracker } from 'react-promise-tracker'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

interface ILayout {
  children: React.ReactNode
}

const Layout: React.FC<ILayout> = ({ children }) => {
  const { promiseInProgress } = usePromiseTracker()
  return (
    <main className={poppins.className}>
      <SiteHeader />
      <Toaster />
      {promiseInProgress && <Loading />}
      {children}
      <SiteFooter />
    </main>
  )
}

export default Layout
