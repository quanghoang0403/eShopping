import { Modal } from "antd";
import "./confirmation-dialog.component.scss";

function ConfirmationDialog(props) {
  const {
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
        className="confirmation-modal-theme2"
        title={<span style={{ fontFamily: fontFamily }}>{title ?? "Confirmation"}</span>}
        open={open}
        onOk={onConfirm}
        onCancel={onCancel}
        okText={<span style={{ fontFamily: fontFamily }}>{okText ?? "Confirm cancel"}</span>}
        cancelText={<span style={{ fontFamily: fontFamily }}>{cancelText ?? "Ignore"}</span>}
        closable={closable ?? false}
        confirmLoading={confirmLoading ?? false}
        wrapClassName={className}
        footer={footer}
        style={{ fontFamily: fontFamily }}
        afterClose={afterClose}
        maskClosable={maskClosable ?? true} //maskClosable default is true
      >
        <div className="confirmation-dialog-content">{content ?? "Do you really want to cancel this order?"}</div>
      </Modal>
    </div>
  );
}

export default ConfirmationDialog;
