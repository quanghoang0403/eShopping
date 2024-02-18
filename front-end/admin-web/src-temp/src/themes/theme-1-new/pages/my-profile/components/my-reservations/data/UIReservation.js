import { ReservationCancelled, ReservationCompleted, ReservationConfirmed, ReservationRightCorner, ReservationServing, ReservationWaitToConfirm } from "../../../../../assets/icons.constants";
import { ReserveStatus } from "../../../../../constants/reserve.constants";

export const getColorByStatus = (status) => {
  switch (status) {
    case ReserveStatus.Serving:
      return {
        backgroundColor: "#FFE8D2",
        color: "#FF8C21",
      };
    case ReserveStatus.Completed:
      return {
        backgroundColor: "#E7F9E7",
        color: "#33B530",
      };
    case ReserveStatus.WaitToConfirm:
      return {
        backgroundColor: "#E4EFF6",
        color: "#428BC1",
      };
    case ReserveStatus.Confirmed:
      return {
        backgroundColor: "#DBD6FF",
        color: "#2B2162",
      };
    case ReserveStatus.Cancelled:
      return {
        backgroundColor: "#FFF7F7",
        color: "#FC0D1B",
      };
    default:
      return {
        backgroundColor: "#FFF7F7",
        color: "#000",
      };
  }
};

export const getTitleByStatus = (status) => {
  switch (status) {
    case ReserveStatus.Serving:
      return "reserve.serving";
    case ReserveStatus.Completed:
      return "reserve.completed";
    case ReserveStatus.WaitToConfirm:
      return "reserve.waitToConfirm";
    case ReserveStatus.Confirmed:
      return "reserve.confirmed";
    case ReserveStatus.Cancelled:
      return "reserve.cancelled";
    default:
      return "";
  }
};

export const getIconByStatus = (status) => {
  switch (status) {
    case ReserveStatus.Serving:
      return <ReservationServing />;
    case ReserveStatus.Completed:
      return <ReservationCompleted />;
    case ReserveStatus.WaitToConfirm:
      return <ReservationWaitToConfirm />;
    case ReserveStatus.Confirmed:
      return <ReservationConfirmed />;
    case ReserveStatus.Cancelled:
      return <ReservationCancelled />;
    default:
      return <ReservationRightCorner />;
  }
};