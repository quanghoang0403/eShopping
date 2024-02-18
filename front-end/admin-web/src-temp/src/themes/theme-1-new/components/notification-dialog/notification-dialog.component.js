import { Modal } from "antd";
import React from "react";
import "./notification-dialog.component.scss";

function NotificationDialog(props) {
  const { confirmLoading, open, className, title, content, onCancel, onConfirm, okText, footer } = props;

  return (
    <div className={`confirmation-dialog${className ? ` ${className}` : ""}`}>
      <Modal
        className="confirmation-modal"
        title={title ?? "Notification"}
        open={open}
        onOk={onConfirm}
        onCancel={onCancel}
        okText={okText ?? "Okay"}
        closable={false}
        confirmLoading={confirmLoading ?? false}
        wrapClassName={className}
        footer={footer}
        zIndex={9999}
      >
        <div className="confirmation-dialog-content">
          {(
            <span
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            ></span>
          ) ?? "Notification content"}
        </div>
      </Modal>
    </div>
  );
}

export default NotificationDialog;
