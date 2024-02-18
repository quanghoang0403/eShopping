import { useSelector } from "react-redux";
import { toastMessageSelector } from "../../../modules/toast-message/toast-message.reducers";
import { notification } from "antd";
import { useEffect } from "react";
import "./master-toast-message.scss";
import { CheckCircleIcon } from "../../assets/icons.constants";
import { useMediaQuery } from "react-responsive";
import { store } from "../../../modules";
import { setResetToastMessage } from "../../../modules/toast-message/toast-message.actions";

function MasterToastMessage() {
  const toastMessage = useSelector(toastMessageSelector);
  const [api, contextHolder] = notification.useNotification();
  const isMobile = useMediaQuery({ maxWidth: 575 });
  const openNotification = (_icon, _message, _position) => {
    api.open({
      message: _message,
      placement: isMobile ? "bottom" : "top",
      className: "toast-message-card",
      icon: _icon ?? <CheckCircleIcon />,
      duration: 1.5,
      closeIcon: <></>,
      onClose: () => {
        store.dispatch(setResetToastMessage());
      },
    });
  };

  useEffect(() => {
    if (toastMessage) {
      openNotification(toastMessage?.icon, toastMessage?.message, toastMessage?.position);
      setTimeout(() => {
        store.dispatch(setResetToastMessage());
      }, 100);
    }
  }, [toastMessage]);

  return <div className="toast-message-container">{contextHolder}</div>;
}

export default MasterToastMessage;
