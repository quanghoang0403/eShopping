import { Button } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getStorage, localStorageKeys, setStorage } from "../../../utils/localStorage.helpers";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import Index from "../../index";
import "./checkout.page.scss";
import CheckOutDetail from "./components/checkout.detail";
import CheckOutHeader from "./components/checkout.header";

function CheckoutPage(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { colorGroups, checkout, clickToFocusCustomize, isCustomize, isDefault } = props;
  const isGoFromScanQR = history?.location?.state?.isGoFromScanQR;

  const pageData = {
    login: t("checkOutPage.login", "Login"),
    loginMessage: t(
      "checkOutPage.loginMessage",
      "You have not logged in yet, please Login to continue create the order",
    ),
  };

  const login = () => {
    setStorage(localStorageKeys.CHECK_OUT_HOME_PAGE, true);
    history.push("/login");
  };

  const getLogin = () => {
    const loginData = getStorage(localStorageKeys.LOGIN);
    return loginData;
  };

  useEffect(() => {
    return () => {
      if (history?.action === "POP") {
        if (isGoFromScanQR) {
          history.replace({ pathname: "/product-list" });
        }
      }
    };
  }, [history]);

  return (
    <>
      <ConfirmationDialog
        open={!clickToFocusCustomize && !isDefault && !getLogin()}
        onCancel={login}
        onConfirm={login}
        confirmLoading={false}
        className="modal_login_theme1"
        closable={true}
        content={pageData.loginMessage}
        title={pageData.login}
        footer={[<Button onClick={login}>{pageData.login}</Button>]}
      />
      <div className="check_out_page">
        <CheckOutHeader
          key={"CheckOutHeader" + Math.random()}
          colorGroups={colorGroups}
          configuration={checkout?.header}
          clickToFocusCustomize={clickToFocusCustomize}
          isDefault={isDefault}
        />
        <CheckOutDetail
          key={"CheckOutDetail" + Math.random()}
          {...props}
          colorGroups={colorGroups}
          configuration={checkout?.checkout}
          clickToFocusCustomize={clickToFocusCustomize}
          isDefault={isDefault}
          isCustomize={isCustomize}
        />
      </div>
    </>
  );
}

export default function Theme1Checkout(props) {
  window.showDeliveryAddressSelector = true;
  return (
    <Index
      {...props}
      contentPage={(_props) => {
        return (
          <>
            <CheckoutPage
              {..._props}
              clickToFocusCustomize={props?.clickToFocusCustomize}
              checkout={props?.config ?? _props?.config}
              colorGroups={props?.general?.color?.colorGroups ?? _props?.general?.color?.colorGroups}
              isDefault={props?.isDefault}
              isCustomize={props?.isCustomize}
            />
          </>
        );
      }}
    />
  );
}
