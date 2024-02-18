import { Button, Modal } from "antd";
import { t } from "i18next";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationDialog } from "../../../modules/session/session.actions";
import "./notification-container.component.scss";

function NotificationContainer() {
  const translatedData = {
    notification: t("loginPage.notification", "Notification"),
    okay: t("form.okay", "Okay"),
  };

  const dispatch = useDispatch();
  const notificationDialog = useSelector((state) => state.session?.notificationDialog);
  const isShowNotificationDialog = notificationDialog?.isShow ?? false;
  const contentNotificationDialog = notificationDialog?.content ?? "Not content";

  const onCloseNotificationDialog = () => {
    const notificationDialog = {
      isShow: false,
      content: "",
    };
    dispatch(setNotificationDialog(notificationDialog));
  };

  return (
    <div className={"notification-container"}>
      <Modal
        className="notification-container-theme1"
        title={translatedData.notification}
        open={isShowNotificationDialog}
        onOk={onCloseNotificationDialog}
        onCancel={onCloseNotificationDialog}
        okText={translatedData.okay}
        closable={false}
        confirmLoading={false}
        centered={true}
        footer={[
          <Button className="btn-okay" onClick={onCloseNotificationDialog}>
            {translatedData.okay}
          </Button>,
        ]}
        zIndex={99999}
      >
        <div className="notification-container-content">{contentNotificationDialog}</div>
      </Modal>
    </div>
  );
}

export default NotificationContainer;
