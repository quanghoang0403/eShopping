import { Button, Modal, Space, Table, Tooltip } from "antd";
import { FnbNotifyDialog } from "components/fnb-notify-dialog/fnb-notify-dialog.component";
import { DELAYED_TIME } from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { hasPermission } from "utils/helpers";

import "./confirm-dialog.component.scss";

export default function ConfirmDialog({
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
  productCategoryId,
  productCategoryName,
  modalContainerStyle
}) {
  const [t] = useTranslation();
  const history = useHistory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRedirectPath, setCurrentRedirectPath] = useState(null);
  const [isModalNotificationVisible, setIsModalNotificationVisible] =
    useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationDataSource, setNotificationDataSource] = useState(null);
  const [notificationTable, setNotificationTable] = useState(null);
  const pageData = {
    productCategoryRelatedMessage: t(
      "productCategory.productCategoryRelatedMessage"
    ),
    notificationTitle: t("form.notificationTitle"),
    buttonIGotIt: t("form.buttonIGotIt"),
    no: t("table.no"),
    comboName: t("combo.generalInformation.comboName"),
  };
  if (buttonType === undefined) {
    buttonType = "ICON";
  }

  buttonType = buttonType ?? "ICON";

  const tableComboSettings = [
    {
      title: pageData.comboName,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (value, record, index) => {
        return (
          <Link
            to={`/combo/detail/${record?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="combo-name"
          >
            {index + 1}.{record?.name}
          </Link>
        );
      },
    },
  ];

  const tableCombo403Settings = [
    {
      title: pageData.comboName,
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (value, record, index) => {
        return (
          <Link
            to={`/page-not-permitted`}
            target="_blank"
            rel="noopener noreferrer"
            className="combo-name"
          >
            {index + 1}.{record?.name}
          </Link>
        );
      },
    },
  ];

  const handleDeleteAction = async () => {
    if (productCategoryId) {
      var res =
        await productCategoryDataService.getCombosByProductCategoryIdAsync(
          productCategoryId
        );
      if (res && res?.activeCombos?.length > 0) {
        setIsModalNotificationVisible(true);
        let message = t(pageData.productCategoryRelatedMessage, {
          name: productCategoryName,
        });
        setNotificationMessage(message);
        if (hasPermission(PermissionKeys.VIEW_COMBO)) {
          setNotificationTable(tableComboSettings);
          setNotificationDataSource(res.activeCombos);
        } else {
          setNotificationTable(tableCombo403Settings);
        }
      } else {
        showModal();
      }
    } else {
      showModal();
    }
  };

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
            <a onClick={() => handleDeleteAction()}>
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
      <FnbNotifyDialog
        title={pageData.notificationTitle}
        open={isModalNotificationVisible}
        hideCancelButton={true}
        okText={pageData.buttonIGotIt}
        onOk={() => {
          setIsModalNotificationVisible(false);
        }}
        onCancel={() => {
          setIsModalNotificationVisible(false);
        }}
        content={() => {
          return (
            <>
              <div
                className="text-content-notification-product-dependencies"
                dangerouslySetInnerHTML={{
                  __html: notificationMessage,
                }}
              />
              <Table
                className="table-category-product-dependencies"
                columns={notificationTable}
                dataSource={notificationDataSource}
                pagination={false}
              />
            </>
          );
        }}
      />
    </>
  );
}
