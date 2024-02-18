import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import "./checkout-momo.scss";

export default function CheckoutMomo(props) {
  const { visible, onCancel, onOk } = props;
  const { t } = useTranslation();
  const pageData = {
    congratulation: t("order.congratulation", "Congratulation!"),
    momoDialog: t("order.momoDialog", "Do you want to open MoMo App to process payment?"),
    keepUsingWebsite: t("order.keepUsingWebsite", "Keep using website"),
    momoApp: t("order.momoApp", "Open MoMo app"),
  };

  const divContent = (
    <>
      <div className="check-out-momo-title1">
        <span>{pageData.momoDialog}</span>
      </div>
    </>
  );

  return (
    <Modal
      closable={true}
      title={pageData.congratulation}
      className="check-out-momo-theme2"
      open={visible}
      cancelText={pageData.keepUsingWebsite}
      onCancel={onCancel}
      okText={pageData.momoApp}
      onOk={onOk}
    >
      {divContent}
    </Modal>
  );
}
