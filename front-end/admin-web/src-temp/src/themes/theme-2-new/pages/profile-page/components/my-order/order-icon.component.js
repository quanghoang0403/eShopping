import {
  OrderCanceledIcon,
  OrderCompletedIcon,
  OrderProgressIcon,
  OrderToConfirmIcon,
} from "../../../../assets/icons.constants";
import { EnumOrderStatusStoreWeb } from "../../../../constants/enum";

export default function OrderIconComponent(props) {
  const { statusId } = props;

  switch (statusId) {
    case EnumOrderStatusStoreWeb.ToConfirm:
      return <OrderToConfirmIcon />;
    case EnumOrderStatusStoreWeb.Processing:
      return <OrderProgressIcon />;
    case EnumOrderStatusStoreWeb.Delivering:
      return <OrderProgressIcon />;
    case EnumOrderStatusStoreWeb.Completed:
      return <OrderCompletedIcon />;
    case EnumOrderStatusStoreWeb.Canceled:
      return <OrderCanceledIcon />;
    case EnumOrderStatusStoreWeb.Draft:
      return <OrderCanceledIcon />;
    default:
      return "";
  }
}
