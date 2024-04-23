'use client'
import type { AppProps } from 'next/app'
import SEO from '@/components/Layout/SEO'
import MainLayout from '@/components/Layout'
import { Provider, useStore } from 'react-redux'
import { makeStore } from '@/redux/store'
import NProgress from 'nprogress'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import Router from 'next/router'
import '../src/styles/global.scss'
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../src/utils/i18n'
import { PersistGate } from 'redux-persist/integration/react'

NProgress.configure({ showSpinner: true })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  const Main = () => {
    return (
      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <I18nextProvider i18n={i18n}>
            <MainLayout>
              <SEO />
              <Component {...pageProps} />
            </MainLayout>
            <ReactQueryDevtools initialIsOpen={false} />
          </I18nextProvider>
        </Hydrate>
      </QueryClientProvider>
    )
  }
  const queryClient = React.useRef(new QueryClient())
  //const { store } = wrapper.useWrappedStore(pageProps)
  const store = makeStore()
  return typeof window !== 'undefined' ? (
    <Provider store={store}>
      {/* <PersistGate persistor={store.__persistor}> */}
      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <I18nextProvider i18n={i18n}>
            <MainLayout>
              <SEO />
              <Component {...pageProps} />
            </MainLayout>
            <ReactQueryDevtools initialIsOpen={false} />
          </I18nextProvider>
        </Hydrate>
      </QueryClientProvider>
      {/* </PersistGate> */}
    </Provider>
  ) : (
    <Provider store={store}>
      <QueryClientProvider client={queryClient.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <I18nextProvider i18n={i18n}>
            <MainLayout>
              <SEO />
              <Component {...pageProps} />
            </MainLayout>
            <ReactQueryDevtools initialIsOpen={false} />
          </I18nextProvider>
        </Hydrate>
      </QueryClientProvider>
    </Provider>
  )
}
