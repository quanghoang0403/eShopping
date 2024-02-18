import { notification } from "antd";
import React, { useCallback, useContext } from "react";

const initContextState = {};
const AppProviderContext = React.createContext(initContextState);

const AppProvider = (props) => {
  const { children } = props;
  const [messageApi, contextHolder] = notification.useNotification();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const Toast = {
    show: (configs) => {
      const {
        messageType = "success" | "info" | "error" | "warning",
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
      });
    },
    success: (message, icon = "", description = null) => {
      messageApi.success({
        className: "toast-message success",
        closeIcon: false,
        btn: "",
        icon: icon,
        message: message,
        description: description,
        duration: 2,
        placement: "bottom",
        maxCount: 1,
      });
    },
    error: (message, icon = "", description = null) => {
      messageApi.error({
        className: "toast-message error",
        closeIcon: false,
        btn: "",
        icon: icon,
        message: message,
        description: description,
        duration: 2,
        placement: "bottom",
        maxCount: 1,
      });
    },
    info: () => {},
  };

  const getValue = useCallback(() => {
    return {
      messageApi,
      Toast,
    };
  }, [Toast, messageApi]);

  return (
    <AppProviderContext.Provider value={getValue()}>
      {contextHolder}
      {children}
    </AppProviderContext.Provider>
  );
};
export default AppProvider;

export const useAppCtx = () => useContext(AppProviderContext);
