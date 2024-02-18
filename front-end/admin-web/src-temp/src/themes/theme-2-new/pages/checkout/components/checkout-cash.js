import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import checkoutSuccessfully from "../../../assets/icons/checkout-successfully.svg";
import "./checkout-cash.scss";

export default function CheckOutCash(props) {
  const { visible, onCancel, onOk } = props;
  const { t } = useTranslation();
  const history = useHistory();
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

  return (
    <Modal
      closable={true}
      className="check-out-cash-theme2"
      open={visible}
      cancelText={pageData.newOrder}
      onCancel={onCancel}
      okText={pageData.viewOrder}
      onOk={onOk}
    >
      {divContent}
    </Modal>
  );
}
