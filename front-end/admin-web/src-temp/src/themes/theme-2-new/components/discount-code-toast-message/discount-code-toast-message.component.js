import { useTranslation } from "react-i18next";
import { CheckToastMessageIcon, WarningDiscountCodeIcon } from "../../assets/icons.constants";

import "./discount-code-toast-message.component.scss";

export function DiscountCodeToastMessageComponent(props) {
  const { isSuccess, message } = props;
  const [t] = useTranslation();
  const translateData = {
    redeemSuccessfully: t("promotion.discountCode.redeemSuccessfully", "Lấy mã thành công"),
    redeemFailed: t("promotion.discountCode.redeemFailed", "Lấy mã thất bại"),
  };

  return (
    <div className="toast-message-calculation-discount-code">
      {isSuccess === true ? (
        <>
          <CheckToastMessageIcon />
          <span>{message != null ? t(message) : translateData.redeemSuccessfully}</span>
        </>
      ) : (
        <>
          <WarningDiscountCodeIcon />
          <span>{message != null ? t(message) : translateData.redeemFailed}</span>
        </>
      )}
    </div>
  );
}
