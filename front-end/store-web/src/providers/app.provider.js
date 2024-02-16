import { notification } from "antd";
import React, { useCallback, useContext, useRef } from "react";
import { ToastMessageType } from "../constants/toast-message.constants";
import { CheckCircleIcon, WarningTriangle } from "../theme/assets/icons.constants";
import NotificationDialogProvider from "../theme/components/notification-dialog-provider/NotificationDialogProvider";

const initContextState = {};
const AppProviderContext = React.createContext(initContextState);

const AppProvider = (props) => {
  const { children, fontFamily } = props;
  const [messageApi, contextHolder] = notification.useNotification();
  const notificationDialogRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Toast = {
    show: (configs) => {
      const {
        messageType = ToastMessageType.SUCCESS |
          ToastMessageType.INFO |
          ToastMessageType.ERROR |
          ToastMessageType.WARNING,
        message,
        icon = "",
        className = "",
        description = null,
        closeIcon = false,
        placement = "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight",
        duration = 2,
      } = configs;
      messageApi[messageType]({
        className: `toast-message theme-dark ${className}`,
        closeIcon: closeIcon,
        btn: "",
        icon: icon,
        message: message,
        description: description,
        duration: duration,
        placement: placement,
        maxCount: 1,
        style: { fontFamily: props.fontFamily },
      });
    },
    success: ({ message, icon = <CheckCircleIcon />, description = null, placement = "bottom" }) => {
      messageApi.success({
        className: "toast-message success",
        closeIcon: false,
        btn: "",
        icon: icon,
        message: message,
        description: description,
        duration: 2,
        placement: placement,
        maxCount: 1,
        style: { fontFamily: fontFamily },
      });
    },
    error: ({ message, icon = <WarningTriangle />, description = null, placement = "bottom" }) => {
      messageApi.error({
        className: "toast-message error",
        closeIcon: false,
        btn: "",
        icon: icon,
        message: message,
        description: description,
        duration: 2,
        placement: placement,
        maxCount: 1,
        style: { fontFamily: props.fontFamily },
      });
    },
    info: () => {},
    warning: ({ message, description, placement = "top", duration = 3 }) => {
      messageApi["warning"]({
        className: `toast-message theme-dark`,
        icon: <WarningTriangle />,
        message: message,
        description: description,
        duration: duration,
        placement: placement,
        maxCount: 1,
        style: {fontFamily}
      });
    },
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const NotificationDialog = {
    show: (configs) => {
      notificationDialogRef.current.setIsVisible(true);
      notificationDialogRef.current.setConfigs(configs);
    },
    hide: () => {
      notificationDialogRef.current.setIsVisible(false);
    },
  };

  const getValue = useCallback(() => {
    return {
      messageApi,
      Toast,
      NotificationDialog,
      fontFamily,
    };
  }, [messageApi, Toast, NotificationDialog, fontFamily]);

  return (
    <AppProviderContext.Provider value={getValue()}>
      <NotificationDialogProvider ref={notificationDialogRef} />
      {contextHolder}
      {children}
    </AppProviderContext.Provider>
  );
};
export default AppProvider;

export const useAppCtx = () => useContext(AppProviderContext);
