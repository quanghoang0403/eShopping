import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import checkoutSuccess from "../../../assets/icons/checkout-successfully.svg";
import "./checkout-momo-success.scss";
export default function CheckOutMomoSuccess(props) {
  const { visible, onCancel, onViewDetail, onCreateNewOrder, orderCode } = props;
  const { t } = useTranslation();
  const pageData = {
    orderNo: t("order.orderNo", "Order No"),
    orderIsCreated: t("order.orderIsCreated", "Your order is created successful"),
    congratulation: t("order.congratulation", "Congratulation"),
    close: t("form.close", "Close"),
    viewOrder: t("order.viewOrder", "View order detail"),
    newOrder: t("order.newOrder", "Create new order"),
  };

  const divContent = (
    <>
      <div className="check-out-success-box">
        <img className="checkoutSuccess" src={checkoutSuccess} alt={orderCode} />
        <div className="title1">{pageData.congratulation}</div>
        <div className="title2">{pageData.orderIsCreated}</div>
        <div className="view_detail" onClick={onViewDetail}>
          {pageData.viewOrder}
        </div>
        <div className="new_order" onClick={onCreateNewOrder}>
          {pageData.newOrder}
        </div>
      </div>
    </>
  );
  return (
    <Modal
      closable={true}
      className="check-out-momo-success-theme1"
      open={visible}
      onCancel={onCancel}
      footer={(null, null)}
      title=""
    >
      {divContent}
    </Modal>
  );
}
