import type { AppProps } from 'next/app'
import SEO from '@/components/Layout/SEO'
import MainLayout from '@/components/Layout'
import { Provider } from 'react-redux'
import { makeStore } from '@/redux/store'
import NProgress from 'nprogress'
import { Router } from 'next/router'
import '../src/styles/global.css'
import { Suspense } from 'react'
import Loading from '@/components/Loading'

NProgress.configure({ showSpinner: true })
Router.events.on('routeChangeStart', () => {
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const store = makeStore()
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <MainLayout>
          <SEO />
          <Suspense fallback={<Loading />}>
            <Component {...pageProps} />
          </Suspense>
        </MainLayout>
      </Provider>
    </>
  )
}
