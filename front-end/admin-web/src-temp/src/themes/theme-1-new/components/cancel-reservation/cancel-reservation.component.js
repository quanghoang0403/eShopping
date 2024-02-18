import { t } from "i18next";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import reserveTableService from "../../../data-services/reserve-table-data.service";
import { store } from "../../../modules";
import { setToastMessageAddUpdateProductToCart } from "../../../modules/toast-message/toast-message.actions";
import { localStorageKeys } from "../../../utils/localStorage.helpers";
import ConfirmationDialog from "../confirmation-dialog/confirmation-dialog.component";
import "./cancel-reservation.component.scss";

export default function CancelReservationComponent(props) {
  const { reservationId, isReservationList } = props;
  const userInfo = useSelector((state) => state?.session?.userInfo);
  const translateData = {
    confirm: t("deliveryTime.confirm"),
    pickDate: t("reserve.pickDate"),
    pickTime: t("reserve.pickTime"),
    cancel: t("reserve.cancel"),
    confirmation: t("reserve.confirmation"),
    ignore: t("reserve.ignore"),
    cancelReservation: t("reserve.cancelReservation"),
    cancelContent: t("reserve.cancelContent"),
    cancelSuccess: t("reserve.cancelSuccess"),
    cancelDetail: t("reserve.cancelDetail"),
  };

  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const storeId = userInfo?.storeId ?? JSON.parse(localStorage.getItem(localStorageKeys.STORE_CONFIG))?.storeId;

  async function onCancelReservation() {
    if (reservationId) {
      const res = await reserveTableService.cancelReserveTableByIdAsync(reservationId);
      if (res) {
        store.dispatch(
          setToastMessageAddUpdateProductToCart({
            icon: null,
            message: translateData.cancelSuccess,
          }),
        );
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    }
  }

  const onClickButtonCancel = (event) => {
    event.stopPropagation();
    setIsShowNotifyDialog(true);
  };

  const onCancelDialog = (event) => {
    event.stopPropagation();
    setIsShowNotifyDialog(!isShowNotifyDialog);
  };

  const onConfirmDialog = (event) => {
    event.stopPropagation();
    onCancelReservation();
    setIsShowNotifyDialog(!isShowNotifyDialog);
  };
  return (
    <div
      className="cancel-reservation"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {isReservationList ? (
        <button className="card-reservation-theme1__btn-cancel" onClick={(e) => onClickButtonCancel(e)}>
          {translateData.cancel}
        </button>
      ) : (
        <div className="reservation-detail__contain-btn-cancel" onClick={(e) => onClickButtonCancel(e)}>
          <button className="reservation-detail__btn-cancel">{translateData.cancelDetail}</button>
        </div>
      )}
      <ConfirmationDialog
        open={isShowNotifyDialog}
        title={translateData.confirmation}
        cancelText={translateData.ignore}
        okText={translateData.cancelReservation}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: translateData.cancelContent,
            }}
          ></span>
        }
        closable={false}
        maskClosable={true}
        className="confirmation-type-2"
        onCancel={(e) => onCancelDialog(e)}
        onConfirm={(e) => onConfirmDialog(e)}
      />
    </div>
  );
}
