import { Modal, Space } from "antd";
import { DELAYED_TIME } from "constants/default.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router";

import "./notification-dialog.component.scss";

export default function NotificationDialogComponent({
  className,
  title,
  content,
  okText,
  cancelText,
  onOk,
  onCancel,
  okType,
  canClose,
  visible,
  skipPermission,
  isChangeForm,
  okButtonProps,
  cancelButtonProps,
  centered,
}) {
  const [t] = useTranslation();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRedirectPath, setCurrentRedirectPath] = useState(null);

  const showModal = (route) => {
    if (route) {
      const { pathname } = route;
      setCurrentRedirectPath(pathname);
    }
    setIsModalVisible(true);
    return false;
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (onOk) {
      onOk();

      if (currentRedirectPath !== null) {
        setTimeout(() => {
          return history.push(currentRedirectPath);
        }, DELAYED_TIME);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

  const renderModal = () => {
    return (
      <>
        <Modal
          className={`notification-dialog-modal ${className}`}
          title={title}
          visible={isModalVisible || visible}
          okText={okText}
          okType={okType ? okType : "danger"}
          closable={canClose ? canClose : false}
          cancelText={cancelText}
          onOk={handleOk}
          onCancel={handleCancel}
          okButtonProps={okButtonProps}
          centered={centered}
          cancelButtonProps={cancelButtonProps}
        >
          <span dangerouslySetInnerHTML={{ __html: `${content}` }}></span>
        </Modal>
      </>
    );
  };

  const renderWithIcon = () => {
    return skipPermission ? (
      <>
        <Space wrap className={className}>
          {renderModal()}
        </Space>
      </>
    ) : (
      <></>
    );
  };

  return (
    <>
      <Prompt when={isChangeForm ? isChangeForm : false} message={showModal} />
      {renderWithIcon()}
    </>
  );
}
