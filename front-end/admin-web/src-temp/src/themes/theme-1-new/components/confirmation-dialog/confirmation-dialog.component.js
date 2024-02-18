import { Modal } from "antd";
import "./confirmation-dialog.component.scss";

function ConfirmationDialog(props) {
  const {
    width,
    confirmLoading,
    open,
    className,
    title,
    content,
    onCancel,
    onConfirm,
    cancelText,
    okText,
    footer,
    afterClose,
    closable,
    maskClosable,
    fontFamily,
  } = props;

  return (
    <div className={`confirmation-dialog${className ? ` ${className}` : ""}`}>
      <Modal
        className="confirmation-modal"
        title={title ?? "Confirmation"}
        open={open}
        onOk={onConfirm}
        onCancel={onCancel}
        okText={okText ?? "Confirm cancel"}
        cancelText={cancelText ?? "Ignore"}
        closable={closable ?? false}
        maskClosable={maskClosable ?? false}
        confirmLoading={confirmLoading ?? false}
        wrapClassName={className}
        footer={footer}
        style={{ fontFamily: fontFamily ?? "inherit" }}
        afterClose={afterClose}
      >
        <div className="confirmation-dialog-content" style={{ fontFamily: fontFamily ?? "inherit" }}>
          {content ?? "Do you really want to cancel this order?"}
        </div>
      </Modal>
    </div>
  );
}

export default ConfirmationDialog;
