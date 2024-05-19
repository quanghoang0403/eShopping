import type { AppProps } from "next/app";
import SEO from "@/components/Layout/SEO";
import MainLayout from "@/components/Layout";
import { Provider } from "react-redux";
import { wrapper } from "@/redux/store";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Router from "next/router";
import "../src/styles/index.scss";
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/utils/i18n";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: true });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = React.useRef(new QueryClient());
  const { store } = wrapper.useWrappedStore(pageProps);
  return (
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
  );
}
