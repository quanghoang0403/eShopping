import { useTranslation } from "react-i18next";
import CancelOrderButton from "../../../../components/cancel-order-button/cancel-order-button.component";
import { EnumOrderStatusStoreWeb } from "../../../../constants/enum";
import "./order-button.component.scss";
import { Button } from "antd";
export default function OrderButtonComponent(props) {
  const { statusId, orderId, onRefesh, onClick, isLoading } = props;
  const [t] = useTranslation();
  const translateData = {
    cancelOrder: t("orderStatus.confirmCanceled", "Cancel order"),
    reOrder: t("orderStatus.reOrder", "Re-Order"),
  };

  switch (statusId) {
    case EnumOrderStatusStoreWeb.ToConfirm:
      return (
        <CancelOrderButton
          className="cancel-order-by-status"
          buttonText={translateData.cancelOrder}
          orderId={orderId}
          callBack={onRefesh}
        />
      );
    case EnumOrderStatusStoreWeb.Completed:
      return (
        <Button disabled={isLoading} htmlType="button" className="re-order-by-status" onClick={() => onClick()}>
          {isLoading ? "Loading..." : translateData.reOrder}
        </Button>
      );
    case EnumOrderStatusStoreWeb.Canceled:
      return (
        <Button disabled={isLoading} htmlType="button" className="re-order-by-status" onClick={() => onClick()}>
          {isLoading ? "Loading..." : translateData.reOrder}
        </Button>
      );
    default:
      return "";
  }
}
