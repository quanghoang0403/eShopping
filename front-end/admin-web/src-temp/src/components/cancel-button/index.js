import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Prompt } from "react-router";
import { hasPermission } from "utils/helpers";

/**
 * Cancel to leave with confirm dialog
 * @param {*} param
 * @returns
 */
export function CancelButton({ buttonText, skipPermission, permission, className, onOk, onCancel, showWarning }) {
  const [t] = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRouteChanged, setIsRouteChanged] = useState(false);

  useEffect(() => {
    setIsRouteChanged(showWarning);
  }, [showWarning]);

  const showWarningDialog = () => {
    if (showWarning && showWarning === true) {
      setIsModalVisible(true);
      setIsRouteChanged(false);
    } else {
      if (onOk) {
        onOk();
      }
    }
  };

  const onConfirm = () => {
    setIsModalVisible(false);
    if (onOk) {
      onOk();
    }
  };

  const onCloseWarningDialog = () => {
    setIsRouteChanged(true);
    setIsModalVisible(false);
    if (onCancel) {
      onCancel();
    }
  };

  const renderWarningDialog = () => {
    return (
      <Modal
        className="delete-confirm-modal"
        title={t("leaveDialog.confirmation")}
        visible={isModalVisible}
        okText={t("button.confirmLeave")}
        okType={"danger"}
        closable={false}
        cancelText={t("button.discard")}
        onOk={onConfirm}
        onCancel={onCloseWarningDialog}
      >
        <span dangerouslySetInnerHTML={{ __html: t("messages.leaveForm") }}></span>
      </Modal>
    );
  };

  const renderActionButton = () => {
    return (
      (!permission || hasPermission(permission) || skipPermission) && (
        <>
          <Button type="link" onClick={showWarningDialog} className={`action-cancel ${className}`}>
            {buttonText ?? t("button.cancel", "Cancel")}
          </Button>
          {renderWarningDialog()}
        </>
      )
    );
  };

  return (
    <>
      <Prompt
        when={isRouteChanged === true}
        message={() => {
          setIsModalVisible(true);
          setIsRouteChanged(false);
          return false;
        }}
      />
      {renderActionButton()}
    </>
  );
}
