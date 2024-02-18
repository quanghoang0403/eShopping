import { Modal } from "antd";
import { useTranslation } from "react-i18next";

import "./fnb-notify-dialog.component.scss";

export function FnbNotifyDialog({
  className,
  title,
  content: Content,
  open,
  cancelText,
  okText,
  onCancel,
  onOk,
  hideCancelButton,
}) {
  const [t] = useTranslation();

  return (
    <Modal
      className={`fnb-notify-dialog ${className}`}
      title={title}
      open={open}
      okText={okText ?? "OK"}
      closable={true}
      cancelText={cancelText ?? "Cancel"}
      onOk={onOk}
      onCancel={onCancel}
      centered={true}
      maskClosable={true}
      cancelButtonProps={hideCancelButton ? { style: { display: "none" } } : ""}
    >
      <Content />
    </Modal>
  );
}
