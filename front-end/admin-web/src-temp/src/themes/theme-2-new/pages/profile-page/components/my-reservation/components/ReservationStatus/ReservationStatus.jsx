import React from "react";
import { useTranslation } from "react-i18next";
import { EnumReservationStatusStoreWeb } from "../../../../../../constants/enum";
import "./ReservationStatus.scss";

const ReservationStatus = (props) => {
  const { status } = props;
  const [t] = useTranslation();
  const translateData = {
    waitToConfirm: t("reservation.waitToConfirm", "To Confirm"),
    confirmed: t("reservation.confirmed", "Confirmed"),
    serving: t("reservation.serving", "Serving"),
    completed: t("reservation.completed", "Completed"),
    cancelled: t("reservation.cancelled", "Cancelled"),
  };
  switch (status) {
    case EnumReservationStatusStoreWeb.WaitToConfirm:
      return (
        <div className="reservation-status-theme2 reservation-status-wait-to-confirm-theme2">
          {translateData.waitToConfirm}
        </div>
      );
    case EnumReservationStatusStoreWeb.Confirmed:
      return (
        <div className="reservation-status-theme2 reservation-status-confirmed-theme2">{translateData.confirmed}</div>
      );
    case EnumReservationStatusStoreWeb.Serving:
        return (
          <div className="reservation-status-theme2 reservation-status-serving-theme2">{translateData.serving}</div>
    );
    case EnumReservationStatusStoreWeb.Completed:
      return (
        <div className="reservation-status-theme2 reservation-status-completed-theme2">{translateData.completed}</div>
      );
    case EnumReservationStatusStoreWeb.Cancelled:
      return (
        <div className="reservation-status-theme2 reservation-status-cancelled-theme2">{translateData.cancelled}</div>
      );
    default:
      return "";
  }
};

export default ReservationStatus;
