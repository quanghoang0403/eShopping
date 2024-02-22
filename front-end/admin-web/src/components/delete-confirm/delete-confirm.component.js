import { Button, Modal, Space, Tooltip } from "antd";
import { DELAYED_TIME } from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router";
import { hasPermission } from "utils/helpers";
import "./delete-confirm.component.scss";

export default function DeleteConfirmComponent({
  className,
  title,
  content,
  okText,
  cancelText,
  onOk,
  onCancel,
  permission,
  okType,
  buttonIcon,
  canClose,
  visible,
  skipPermission,
  buttonText,
  buttonType,
  tooltipTitle,
  isChangeForm,
  okButtonProps,
  cancelButtonProps,
  centered,
  modalContainerStyle
}) {
  const [t] = useTranslation();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRedirectPath, setCurrentRedirectPath] = useState(null);
  if (buttonType === undefined) {
    buttonType = "ICON";
  }

  buttonType = buttonType ?? "ICON";

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
          className={`delete-confirm-modal ${className} ${modalContainerStyle}`}
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

  const renderWithText = () => {
    return (!permission || hasPermission(permission) || skipPermission) &&
      buttonText !== "" &&
      buttonText !== undefined ? (
      <>
        <Button onClick={showModal} className={className ?? "action-delete" }>
          {buttonText ?? ""}
        </Button>
        {renderModal()}
      </>
    ) : (
      <></>
    );
  };

  const renderWithTextAndColorBorder = () => {
    return (!permission || hasPermission(permission) || skipPermission) &&
      buttonText !== "" &&
      buttonText !== undefined ? (
      <>
        <Button onClick={showModal} className="action-delete-border">
          {buttonText ?? ""}
        </Button>
        {renderModal()}
      </>
    ) : (
      <></>
    );
  };

  const renderWithIcon = () => {
    return !permission || hasPermission(permission) || skipPermission ? (
      <>
        <Space wrap className={className}>
          {!skipPermission && (
            <a onClick={() => showModal()}>
              {buttonIcon ? (
                tooltipTitle ? (
                  <Tooltip placement="top" title={tooltipTitle}>
                    {buttonIcon}
                  </Tooltip>
                ) : (
                  { buttonIcon }
                )
              ) : (
                <div className="fnb-table-action-icon">
                  <Tooltip
                    placement="top"
                    title={t("button.delete")}
                    color="#50429B"
                    zIndex={10}
                  >
                    <TrashFill className="icon-svg-hover" />
                  </Tooltip>
                </div>
              )}
            </a>
          )}
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
      {(buttonType ?? "ICON") === "ICON"
        ? renderWithIcon()
        : buttonType === "TEXT-BORDER"
        ? renderWithTextAndColorBorder()
        : renderWithText()}
    </>
  );
}
