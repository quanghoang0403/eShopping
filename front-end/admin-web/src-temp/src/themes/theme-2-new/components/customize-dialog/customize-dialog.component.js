import { Modal } from "antd";
import "./customize-dialog.component.scss";

function CustomizeDialog(props) {
  const {
    confirmLoading,
    open,
    className,
    title,
    content: ContentComponent,
    forceRenderContent,
    onCancel,
    onConfirm,
    okText,
    footer,
    closable = false,
    fontFamily,
  } = props;
  return (
    <Modal
      className="customize-dialog-modal"
      title={title ?? "Notification"}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={okText ?? "Okay"}
      closable={closable}
      confirmLoading={confirmLoading ?? false}
      wrapClassName={className}
      footer={footer}
      zIndex={9999}
      style={{ fontFamily: fontFamily }}
    >
      <div className="customize-dialog-content">
        {ContentComponent && forceRenderContent ? (
          <ContentComponent />
        ) : ContentComponent ? (
          <ContentComponent />
        ) : (
          <span>{"Notification content"}</span>
        )}
      </div>
    </Modal>
  );
}

export default CustomizeDialog;
