import React from "react";
import { useTranslation } from "react-i18next";
import "./BadgeReservationStatus.scss";
import { enumReservation } from "../../../../../../constants/reservation-status.constrants";

/**
 * Badge Status
 * @param {bool} status - Status of the badge
 * @returns Active or Inactive label
 */
export function BadgeReservationStatus(props) {
  const [t] = useTranslation();
  const { status = -1, colorBackground, colorText, text } = props;

  const pageData = {
    waitToConfirm: t("reservation.waitToConfirm"),
    confirmed: t("reservation.confirmed"),
    serving: t("reservation.serving"),
    cancelled: t("reservation.cancelled"),
    completed: t("reservation.completed"),
  };

  const renderStatus = () => {
    switch (status) {
      case enumReservation.Cancelled:
        return (
          <span className="badge-status cancelled">
            <span> {pageData.cancelled}</span>
          </span>
        );
      case enumReservation.WaitToConfirm:
        return (
          <span className="badge-status wait-to-confirm">
            <span> {pageData.waitToConfirm}</span>
          </span>
        );
      case enumReservation.Confirmed:
        return (
          <span className="badge-status confirm">
            <span> {pageData.confirmed}</span>
          </span>
        );
      case enumReservation.Serving:
        return (
          <span className="badge-status serving">
            <span> {pageData.serving}</span>
          </span>
        );
      case enumReservation.Completed:
        return (
          <span className="badge-status completed">
            <span> {pageData.completed}</span>
          </span>
        );
      default:
        return (
          <>
            <span className="badge-status" style={{ background: colorBackground }}>
              <span style={{ color: colorText }}>{text ?? "-"}</span>
            </span>
          </>
        );
    }
  };

  return <>{renderStatus()}</>;
}
