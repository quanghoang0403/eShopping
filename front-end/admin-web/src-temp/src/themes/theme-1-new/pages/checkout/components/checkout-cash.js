import { Modal } from "antd";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import checkoutSuccessfully from "../../../assets/icons/checkout-successfully.svg";
import "./checkout-cash.scss";

export default function CheckOutCash(props) {
  const { visible, onCancel, onOk } = props;
  const { t } = useTranslation();
  const pageData = {
    viewOrder: t("order.viewOrder", "View order detail"),
    newOrder: t("order.newOrder", "Create new order"),
    orderIsCreated: t("order.orderIsCreated", "Your order is created successful"),
    congratulation: t("order.congratulation", "Congratulation!"),
  };

  const divContent = (
    <>
      <img className="check-out-cash-image" src={checkoutSuccessfully} alt="Checkout" />
      <div className="check-out-cash-title1">
        <span>{pageData.congratulation}</span>
      </div>
      <div className="check-out-cash-title2">
        <span>{pageData.orderIsCreated}</span>
      </div>
    </>
  );

  const footer = (
    <>
      <div onClick={onCancel} className="new-order">
        {pageData.newOrder}
      </div>
      <div onClick={onOk} className="view-order">
        {pageData.viewOrder}
      </div>
    </>
  );
  //Because vi text longer en text so I need custom css base on language
  const className = i18n.language === "vi" ? "check-out-cash-theme1-vn" : "check-out-cash-theme1";
  return (
    <Modal closable={true} className={className} open={visible} footer={footer}>
      {divContent}
    </Modal>
  );
}
