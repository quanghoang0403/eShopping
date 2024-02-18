import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToastMessageMaxDiscountIcon } from "../../assets/icons.constants";

import "./max-discount-toast-message.component.scss";

export function MaxDiscountToastMessageComponent(props) {
  const [t] = useTranslation();
  const translateData = {
    maxDiscount: t("maxDiscountToastMessage", "Số tiền được giảm đã vượt quá số tối đa của chương trình khuyến mãi."),
  };

  const isShowToastMessageMaxDiscount = useSelector((state) => state?.toastMessage?.isShowToastMessageMaxDiscount);

  const renderToastMessage = () => {
    return (
      <div className="toast-message-calculation-max-discount">
        <ToastMessageMaxDiscountIcon />
        <span>{translateData.maxDiscount}</span>
      </div>
    );
  };

  return <>{isShowToastMessageMaxDiscount === true && renderToastMessage()}</>;
}
