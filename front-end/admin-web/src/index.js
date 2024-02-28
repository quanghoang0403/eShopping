import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "styled-components";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store";
import theme from './theme';
import { useEffect } from "react";
import { getLanguage } from "services/system.services";

ReactDOM.render(
  <HelmetProvider>
    <Provider store={store}>
    <I18nextProvider>
      <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
    </I18nextProvider>
    </Provider>
  </HelmetProvider>,
  document.getElementById("root")
);

const AppContent = () => {
  const handleInitData = async () => {
    await Promise.all([getLanguage()]).then(([authState]) => {});
  };
  useEffect(() => {
    void handleInitData();
  }, []);
  return <App />;
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
