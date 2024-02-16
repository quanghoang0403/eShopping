import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./modules";
import { ThemeProvider } from "styled-components";
import reportWebVitals from "./reportWebVitals";
import ListenMoMoPaymentStatus from "./theme/components/listen-momo-payment-status/listen-momo-payment-status.component";
import "./theme/index.scss";
import config from "./utils/i18n";
import theme from './theme';

const app = (
  <HelmetProvider>
    <Provider store={store}>
      <I18nextProvider i18n={config}>
        <ThemeProvider theme={theme}>
          {/* This "recaptcha-login" div is for google Firebase generate confirm dialog. Must be in root element. Do not attach to another div */}
          <div style={{ display: "none" }} id="recaptcha-login"></div>
          <ListenMoMoPaymentStatus />
          <App />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  </HelmetProvider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
