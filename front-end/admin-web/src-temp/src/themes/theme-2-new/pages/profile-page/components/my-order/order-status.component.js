import { useTranslation } from "react-i18next";
import { EnumOrderStatusStoreWeb } from "../../../../constants/enum";
import "./order-status.component.scss";
export default function OrderStatusComponent(props) {
  const { statusId } = props;
  const [t] = useTranslation();
  const translateData = {
    toConfirm: t("orderStatus.toConfirm", "To Confirm"),
    processing: t("orderStatus.processing", "Processing"),
    delivering: t("orderStatus.delivering", "Delivering"),
    completed: t("orderStatus.completed", "Completed"),
    canceled: t("orderStatus.canceled", "Canceled"),
    draft: t("orderStatus.draft", "Draft"),
  };

  switch (statusId) {
    case EnumOrderStatusStoreWeb.ToConfirm:
      return <div className="order-status-to-confirm">{translateData.toConfirm}</div>;
    case EnumOrderStatusStoreWeb.Processing:
      return <div className="order-status-processing">{translateData.processing}</div>;
    case EnumOrderStatusStoreWeb.Delivering:
      return <div className="order-status-delivering">{translateData.delivering}</div>;
    case EnumOrderStatusStoreWeb.Completed:
      return <div className="order-status-completed">{translateData.completed}</div>;
    case EnumOrderStatusStoreWeb.Canceled:
      return <div className="order-status-canceled">{translateData.canceled}</div>;
    case EnumOrderStatusStoreWeb.Draft:
      return <div className="order-status-draft">{translateData.draft}</div>;
    default:
      return "";
  }
}
