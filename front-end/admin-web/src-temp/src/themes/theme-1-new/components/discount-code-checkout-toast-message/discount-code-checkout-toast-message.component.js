import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setToastMessageDiscountCodeCheckout } from "../../../modules/toast-message/toast-message.actions";
import { CheckCircleIcon, WarningDiscountCodeIcon } from "../../assets/icons.constants";

import { ToastMessageType } from "../../../constants/toast-message.constants";
import { depauseMethod } from "../../../utils/helpers";
import "./discount-code-checkout-toast-message.component.scss";

export function DiscountCodeCheckoutToastMessageComponent(props) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const DEPAUSE_METHOD_TIME = 3000;

  const isShowToastMessageDiscountCodeCheckout = useSelector(
    (state) => state?.toastMessage?.isShowToastMessageDiscountCodeCheckout,
  );

  useEffect(() => {
    if (isShowToastMessageDiscountCodeCheckout?.isShowToastMessage) {
      depauseMethod("toastMessageDiscountCode", DEPAUSE_METHOD_TIME, () => {
        dispatch(setToastMessageDiscountCodeCheckout(false));
      });
    }
  }, [isShowToastMessageDiscountCodeCheckout]);

  const renderToastMessage = () => {
    return (
      <div className="toast-message-discount-code-checkout">
        {isShowToastMessageDiscountCodeCheckout?.type !== ToastMessageType.SUCCESS && (
          <>
            <WarningDiscountCodeIcon /> <span>{t(isShowToastMessageDiscountCodeCheckout?.message)}</span>
          </>
        )}
        {isShowToastMessageDiscountCodeCheckout?.type === ToastMessageType.SUCCESS && (
          <>
            <CheckCircleIcon /> <span>{t(isShowToastMessageDiscountCodeCheckout?.message)}</span>
          </>
        )}
      </div>
    );
  };

  return <>{isShowToastMessageDiscountCodeCheckout?.isShowToastMessage && renderToastMessage()}</>;
}
