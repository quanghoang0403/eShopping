import { useTranslation } from "react-i18next";
import "./out-of-stock-label-box.scss";

export default function OutOfStockLabelBoxComponent(props) {
  const { isShow, smallSize, isCartItem } = props;
  const [t] = useTranslation();

  return (
    <>
      {isShow && (
        <div className={`out-of-stock-label-box ${smallSize && "small-size"} ${isCartItem && "is-cart-item"}`}>
          <span className="text-label">{t("storeWebPage.productDetailPage.labelOutOfStock", "Hết hàng")}</span>
        </div>
      )}
    </>
  );
}
