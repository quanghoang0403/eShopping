import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import checkoutFailed from "../../../assets/icons/checkout-failed.svg";
import "./checkout-momo-failed.scss";
export default function CheckOutMomoFailed(props) {
  const { visible, onCancel, orderCode, error } = props;
  const { t } = useTranslation();
  const pageData = {
    orderNo: t("order.orderNo", "Order No"),
    momoFailed: t("order.momoFailed", "Sorry, we got issues on Payment via MoMo!"),
    close: t("form.close", "Close"),
  };
  if (!error) return <></>;

  const divContent = (
    <>
      <div className="check-out-failed-box">
        <img className="checkoutFailed" src={checkoutFailed} alt={orderCode} />
        <div className="title_failed">{pageData.momoFailed}</div>
        <div className="error">{error}</div>
        <div className="close" onClick={onCancel}>
          {pageData.close}
        </div>
      </div>
    </>
  );
  return (
    <Modal
      closable={true}
      className="check-out-momo-failed-theme2"
      open={visible}
      onCancel={onCancel}
      footer={(null, null)}
      title=""
    >
      {divContent}
    </Modal>
  );
}
