import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToastMessageAddUpdateToCartIcon } from "../../assets/icons.constants";
import "./add-update-to-cart-toast-message.scss";

export function AddToCartToastMessage(props) {
  const [t] = useTranslation();

  const translateData = {
    addToCartMessage: t("addToCartSuccess", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
  };

  const isShowToastMessageAddToCart = useSelector((state) => state?.toastMessage?.isShowToastMessageAddToCart);

  const renderToastMessage = () => {
    return (
      <div className="toast-message-add-update-to-cart">
        <ToastMessageAddUpdateToCartIcon viewBox="0 2 30 19" className="toast-message-add-update-to-cart-check" />
        <span>{translateData.addToCartMessage}</span>
      </div>
    );
  };

  return <>{isShowToastMessageAddToCart === true && renderToastMessage()}</>;
}
