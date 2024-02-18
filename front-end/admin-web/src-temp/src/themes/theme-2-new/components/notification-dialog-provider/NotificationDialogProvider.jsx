import { Button, Modal } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import "./NotificationDialogProvider.scss";

const NotificationDialogProvider = forwardRef((props, ref) => {
  const [t] = useTranslation();
  const initConfigs = {
    title: t("loginPage.notification", "Thông báo"),
    onCancel: null,
    cancelText: t("form.close", "Đóng"),
    onOk: null,
    okText: t("form.okay", "Okay"),
    closable: false,
    confirmLoading: false,
    footer: [
      <Button className="btn-okay" onClick={handleCancel}>
        {t("form.okay", "Okay")}
      </Button>,
    ],
    zIndex: 999999,
    contentNotificationDialog: "null",
    wrapClassName: "",
  };

  const [isVisible, setIsVisible] = useState(false);
  const [configs, setConfigs] = useState(initConfigs);

  useImperativeHandle(ref, () => ({
    setIsVisible(value) {
      setIsVisible(value);
    },
    setConfigs(value) {
      const newConfigs = { ...initConfigs, ...value };
      setConfigs(newConfigs);
    },
  }));

  function handleCancel() {
    setIsVisible(false);
    if (configs?.onCancel) {
      configs?.onCancel();
    }
  }

  function handleOk() {
    setIsVisible(false);
    if (configs?.onOk) {
      configs?.onOk();
    }
  }

  return (
    <Modal
      className="notification-dialog"
      wrapClassName={configs?.wrapClassName}
      title={configs?.title}
      open={isVisible}
      onCancel={handleCancel}
      cancelText={configs?.cancelText}
      onOk={handleOk}
      okText={configs?.okText}
      closable={configs?.closable}
      confirmLoading={configs?.confirmLoading}
      footer={configs?.footer}
      zIndex={configs?.zIndex}
    >
      <div className="notification-dialog-content">{configs?.contentNotificationDialog}</div>
    </Modal>
  );
});

export default NotificationDialogProvider;
