import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getStorage, localStorageKeys, setStorage } from "../../../utils/localStorage.helpers";
import ConfirmationDialog from "../../components/confirmation-dialog/confirmation-dialog.component";
import Index from "../../index";
import "./checkout.page.scss";
import CheckOutDetail from "./components/checkout-detail.component";
import CheckOutHeader from "./components/checkout.header";
import CheckOutRelatedProducts from "./components/checkout.related.products";
function CheckoutPage(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { colorGroups, checkout, clickToFocusCustomize, isCustomize, isDefault } = props;

  const pageData = {
    login: t("checkOutPage.login"),
    loginMessage: t("checkOutPage.loginMessage"),
  };

  const login = () => {
    setStorage(localStorageKeys.CHECK_OUT_HOME_PAGE, true);
    history.push("/login");
  };

  const getLogin = () => {
    const loginData = getStorage(localStorageKeys.LOGIN);
    return loginData;
  };

  return (
    <>
      <ConfirmationDialog
        open={!clickToFocusCustomize && !isDefault && !getLogin()}
        onCancel={login}
        onConfirm={login}
        confirmLoading={false}
        className="modal_login_theme2"
        content={pageData.loginMessage}
        title={pageData.login}
        footer={[
          <Button className="modal_login_button" type="primary" onClick={login}>
            {pageData.login}
          </Button>,
        ]}
      />
      <div className="check_out_page">
        <CheckOutHeader
          key={"CheckOutHeader" + Math.random()}
          colorGroups={colorGroups}
          configuration={checkout?.header}
          clickToFocusCustomize={clickToFocusCustomize}
        />
        <CheckOutDetail
          key={"CheckOutDetail" + Math.random()}
          {...props}
          colorGroups={colorGroups}
          configuration={checkout?.checkout}
          clickToFocusCustomize={clickToFocusCustomize}
          isCustomize={isCustomize}
          isDefault={props?.isDefault}
        />
      </div>
      <div>
        <CheckOutRelatedProducts
          key={"CheckOutRelatedProducts" + Math.random()}
          colorGroups={colorGroups}
          configuration={checkout?.relatedProducts}
          clickToFocusCustomize={clickToFocusCustomize}
          isDefault={props?.isDefault}
        />
      </div>
    </>
  );
}

export default function Theme2Checkout(props) {
  return (
    <Index
      {...props}
      contentPage={(propContents) => {
        return (
          <>
            <CheckoutPage
              {...propContents}
              isDefault={props?.isDefault}
              clickToFocusCustomize={propContents?.clickToFocusCustomize}
              checkout={propContents?.config}
              colorGroups={propContents?.general?.color?.colorGroups}
              isCustomize={props?.isCustomize}
            />
          </>
        );
      }}
    />
  );
}
