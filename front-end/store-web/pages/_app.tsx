import type { AppProps } from 'next/app'
import SEO from '@/components/Layout/SEO'
import MainLayout from '@/components/Layout'
import { Provider } from 'react-redux'
import { makeStore } from '@/redux/store'
import NProgress from 'nprogress'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Router } from 'next/router'
import '../src/styles/global.css'
import { Suspense } from 'react'
import Loading from '@/components/Loading'
import React from 'react'

NProgress.configure({ showSpinner: true })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const store = makeStore()
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = React.useRef(new QueryClient())
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient.current}>
          {/* <Hydrate state={pageProps.dehydratedState}> */}
          <MainLayout>
            <SEO />
            <Suspense fallback={<Loading />}>
              <Component {...pageProps} />
            </Suspense>
          </MainLayout>
          <ReactQueryDevtools initialIsOpen={false} />
          {/* </Hydrate> */}
        </QueryClientProvider>
      </Provider>
    </>
  )
}
