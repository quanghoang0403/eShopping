import { Modal } from "antd";
import React from "react";
import "./notification-dialog.component.scss";

function NotificationDialog(props) {
  const { confirmLoading, open, className, title, content, onCancel, onConfirm, okText, footer } =
    props;

  return (
    <div className={`notification-dialog${className ? ` ${className}` : ""}`}>
      <Modal
        className="notification-modal-theme2"
        title={title ?? "Notification"}
        open={open}
        onOk={onConfirm}
        onCancel={onCancel}
        okText={okText ?? "Okay"}
        closable={false}
        confirmLoading={confirmLoading ?? false}
        wrapClassName={className}
        footer={footer}
        zIndex = {9999}
      >
        <div className="notification-dialog-content">{content ?? "Notification content"}</div>
      </Modal>
    </div>
  );
}

export default NotificationDialog;