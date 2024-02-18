import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastMessageType } from "../../../constants/toast-message.constants";
import { setToastMessage } from "../../../modules/session/session.actions";
import { ToastMessageAddUpdateToCartIcon, ToastMessageDiscountIcon } from "../../assets/icons.constants";
import "./toast-message-container.scss";
import { depauseMethod } from "../../../utils/helpers";

function ToastMessageContainer() {
  const dispatch = useDispatch();
  const notificationDialog = useSelector((state) => state.session?.toastMessage);
  const isShowNotificationDialog = notificationDialog?.isShow ?? false;
  const contentNotificationDialog = notificationDialog?.message ?? "Not message";
  const typeNotification = notificationDialog?.type ?? "Not message";
  const DEPAUSE_METHOD_TIME = 3000;

  useEffect(() => {
    if (notificationDialog?.isShow) {
      depauseMethod("toastMessageDiscountCode", DEPAUSE_METHOD_TIME, () => {
        const toastMessageEmpty = {
          isShow: false,
          message: "",
          type: ToastMessageType.SUCCESS,
          duration: 3000,
        };
        dispatch(setToastMessage(toastMessageEmpty));
      });
    }
  }, [notificationDialog]);

  return (
    <>
      {isShowNotificationDialog && (
        <div className={"toast-message-container"}>
          {typeNotification === ToastMessageType.SUCCESS ? (
            <div className=" toast-message-success">
              <div className="icon">{notificationDialog?.icon ?? <ToastMessageAddUpdateToCartIcon />}</div>
              {contentNotificationDialog}
            </div>
          ) : (
            <div className="toast-message-warning">
              <div className="icon">{notificationDialog?.icon ?? <ToastMessageDiscountIcon />}</div>
              {contentNotificationDialog}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ToastMessageContainer;
