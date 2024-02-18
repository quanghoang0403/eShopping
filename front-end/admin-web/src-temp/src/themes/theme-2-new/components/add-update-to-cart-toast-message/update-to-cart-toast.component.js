import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToastMessageAddUpdateToCartIcon } from "../../assets/icons.constants";
import "./add-update-to-cart-toast-message.scss";

export function UpdateToCartToastMessage(props) {
  const [t] = useTranslation();

  const translateData = {
    updateToCartSuccess: t("updateToCartSuccess", "Món ăn đã được cập nhật thành công"),
  };

  const isShowToastMessageUpdateToCart = useSelector((state) => state?.toastMessage?.isShowToastMessageUpdateToCart);

  const renderToastMessage = () => {
    return (
      <div className="toast-message-add-update-to-cart">
        <ToastMessageAddUpdateToCartIcon viewBox="0 2 30 19" />
        <span>{translateData.updateToCartSuccess}</span>
      </div>
    );
  };

  return <>{isShowToastMessageUpdateToCart === true && renderToastMessage()}</>;
}
