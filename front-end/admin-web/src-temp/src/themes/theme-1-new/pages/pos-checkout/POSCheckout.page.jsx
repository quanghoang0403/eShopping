import { useTranslation } from "react-i18next";
import POSCartPage from "../pos-cart/POSCart.page";
import "./POSCheckout.style.scss";

function POSCheckoutPage(props) {
  const [t] = useTranslation();
  return <POSCartPage isCheckout={true} title={t("posCheckout.title")} fontFamily={props?.fontFamily} />;
}

export default POSCheckoutPage;
