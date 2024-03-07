import type { AppProps } from 'next/app'
import SEO from '@/components/Layout/SEO'
import MainLayout from '@/components/Layout'
import { Provider } from 'react-redux'
import { makeStore } from '@/redux/store'

const store = makeStore()
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <MainLayout>
          <SEO />
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </>
  )
}
