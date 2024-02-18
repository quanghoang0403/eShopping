import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, Dropdown, Image, Menu, Modal, Row, Space, Steps, Typography, message } from "antd";
import CancelConfirmComponent from "components/cancel-confirm/cancel-confirm.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import {
  ArrowDownActionIcon,
  ArrowUpActionIcon,
  EditIcon,
  PrintIcon,
  StepStatusCancelIcon,
  StepStatusFinishIcon,
  StepStatusProcessIcon,
  StepStatusWaitIcon,
} from "constants/icons.constants";
import { images } from "constants/images.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import {
  DEFAULT_STEP_SKIP,
  EnumKeyMenuAction,
  EnumNextAction,
  EnumTransferMaterialError,
  EnumTransferMaterialStatus,
  EnumTransferMaterialStep,
} from "constants/transfer-material-history.constant";
import transferMaterialDataService from "data-services/transfer-material/transfer-material-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { formatDate } from "themes/utils/helpers";
import { formatCurrencyWithoutSymbol, hasPermission } from "utils/helpers";
import "./view-transfer-material.page.scss";
const { Text } = Typography;

export default function ViewTransferMaterial(props) {
  const { t } = useTranslation();
  const { history } = props;
  const [transferMaterialDetail, setTransferMaterialDetail] = useState(false);
  const [transferMaterialMaterials, setTransferMaterialMaterials] = useState(false);
  const [isDraftStatus, setIsDraftStatus] = useState(false);
  const [isShowModalStatusIsChanged, setIsShowModalStatusIsChanged] = useState(false);
  const [isShowModalError, setIsShowModalError] = useState(false);
  const [contentModalError, setContentModalError] = useState("");
  const [isUpDropdown, setIsUpDropDown] = useState(false);

  const transferMaterialId = props?.match?.params?.id;

  const pageData = {
    backTo: t("button.backTo"),
    transferMaterialManagement: t("transferMaterial.title"),
    edit: t("button.edit"),
    print: t("button.print"),
    approve: t("button.approve"),
    complete: t("button.complete"),
    cancel: t("button.cancel"),
    action: t("button.action"),
    generalInfo: t("settings.createGroupPermission.titleGeneralInformation"),
    approveTransferMaterialSuccess: t("messages.approveTransferMaterialSuccess"),
    cancelTransferMaterialSuccess: t("messages.cancelTransferMaterialSuccess"),
    completeTransferMaterialSuccess: t("messages.completeTransferMaterialSuccess"),
    table: {
      no: t("table.no"),
      sku: t("table.sku"),
      materialName: t("table.materialName"),
      material: t("material.title"),
      quantity: t("table.quantity"),
      total: t("table.total"),
      importUnit: t("table.importUnit"),
      action: t("table.action"),
      inventory: t("table.inventory"),
      branchName: t("table.branchName"),
    },
    status: {
      new: t("transferMaterial.statusTransfer.new"),
      inProgress: t("transferMaterial.statusTransfer.inProgress"),
      processed: t("transferMaterial.statusTransfer.processed"),
      complete: t("transferMaterial.statusTransfer.completed"),
      cancel: t("transferMaterial.statusTransfer.canceled"),
      delivering: t("transferMaterial.statusTransfer.delivering"),
      delivered: t("transferMaterial.statusTransfer.delivered"),
    },
    statusButton: {
      approve: t("transferMaterial.statusButton.approve"),
      deliver: t("transferMaterial.statusButton.deliver"),
      complete: t("transferMaterial.statusButton.complete"),
    },
    fromBranchWarehouse: t("transferMaterial.fromBranchWarehouse"),
    destination: t("transferMaterial.destination"),
    note: t("form.note"),
    materialInformation: t("transferMaterial.materialInformation"),
    confirmCancel: t("leaveDialog.confirmCancel"),
    ignore: t("button.ignore"),
    cancelTransferMaterial: t("transferMaterial.cancelTransferMaterial"),
    delivering: t("transferMaterial.statusTransfer.delivering"),
    cancelPurchaseOrder: t("purchaseOrder.cancelPurchaseOrder"),
    titleNotification: t("transferMaterial.titleNotification"),
    contentNotificationStatusIsChanged: t("transferMaterial.contentNotificationStatusIsChanged"),
    ok: t("button.ok"),
    updateTransferMaterialSuccess: t("messages.updateTransferMaterialSuccess"),
    updateTransferMaterialFailed: t("messages.updateTransferMaterialFailed"),
    iGotIt: t("button.iGotIt"),
  };

  useEffect(() => {
    if (transferMaterialId) {
      fetchData();
    }
  }, [transferMaterialId]);

  const fetchData = async () => {
    await transferMaterialDataService.getTransferMaterialIdAsync(transferMaterialId).then((res) => {
      if (res) {
        const { transferMaterial } = res;
        setTransferMaterialDetail(transferMaterial);
        let dataSource = mappingToDataTable(transferMaterial?.transferMaterialDetails);
        setTransferMaterialMaterials(dataSource);
        if (transferMaterial?.statusId === EnumTransferMaterialStatus.Draft) {
          setIsDraftStatus(true);
        } else {
          setIsDraftStatus(false);
        }
      }
    });
  };

  const renderStepsTransferMaterial = (transferMaterial) => {
    if (!transferMaterial) return;
    const { statusId, status } = transferMaterial;
    const isCanceled = statusId === EnumTransferMaterialStatus.Canceled;
    const stepActions =
      status &&
      Array.from(status)
        ?.filter((item) => item?.statusId !== EnumTransferMaterialStatus.Canceled)
        ?.map((item) => item?.statusId);
    const stepFinal = stepActions != null ? Math.max(...stepActions) : EnumTransferMaterialStatus.Draft;
    const stepItems = getStepItemsTransferMaterials(statusId, status, isCanceled, stepFinal);

    return (
      <Steps
        size="small"
        labelPlacement="vertical"
        className={isCanceled ? "custom-steps-transfer-material-cancel" : "custom-steps-transfer-material-default"}
        items={stepItems}
      />
    );
  };

  const getStepItemsTransferMaterials = (statusId, status, isCanceled, stepFinal) => {
    const stepsOrigin = [
      {
        statusId: EnumTransferMaterialStatus.Draft,
      },
      {
        statusId: EnumTransferMaterialStatus.Inprogress,
      },
      {
        statusId: EnumTransferMaterialStatus.Delivering,
      },
      {
        statusId: isCanceled ? EnumTransferMaterialStatus.Canceled : EnumTransferMaterialStatus.Completed,
      },
    ];

    return stepsOrigin?.map((step) => {
      const stepInfo = status?.find((item) => item.statusId === step.statusId);
      return {
        title: getStepName(step?.statusId, stepFinal, isCanceled),
        icon: getStepIcon(step?.statusId, statusId, isCanceled, stepFinal),
        status: getStepStatus(step?.statusId, statusId, isCanceled, stepFinal),
        description: (
          <>
            {stepInfo && (
              <Space direction="vertical">
                <span>{formatDate(stepInfo?.createDated, "HH:mm")}</span>
                <span>{formatDate(stepInfo?.createDated, "DD/MM/YYYY")}</span>
              </Space>
            )}
          </>
        ),
      };
    });
  };

  const getStepName = (statusId, stepFinal, isCanceled) => {
    switch (statusId) {
      case EnumTransferMaterialStatus.Draft:
        return pageData.status.new;
      case EnumTransferMaterialStatus.Inprogress:
        return stepFinal <= statusId && !isCanceled ? pageData.status.inProgress : pageData.status.processed;
      case EnumTransferMaterialStatus.Delivering:
        return stepFinal >= EnumTransferMaterialStatus.Completed
          ? pageData.status.delivered
          : pageData.status.delivering;
      case EnumTransferMaterialStatus.Completed:
        return pageData.status.complete;
      case EnumTransferMaterialStatus.Canceled:
        return pageData.status.cancel;
      default:
        return "";
    }
  };

  const getStepIcon = (statusId, currentStep, isCanceled, stepFinal) => {
    if (isCanceled) {
      if (statusId === EnumTransferMaterialStatus.Canceled) {
        return <StepStatusCancelIcon />;
      }
      if (statusId <= stepFinal) {
        return <StepStatusFinishIcon />;
      }
      if (statusId === stepFinal + DEFAULT_STEP_SKIP) {
        return <StepStatusProcessIcon />;
      }
      return <StepStatusWaitIcon />;
    } else {
      if (statusId <= currentStep) {
        return <StepStatusFinishIcon />;
      }
      if (statusId === currentStep + DEFAULT_STEP_SKIP) {
        return <StepStatusProcessIcon />;
      }
      return <StepStatusWaitIcon />;
    }
  };

  const getStepStatus = (statusId, currentStep, isCanceled, stepFinal) => {
    if (isCanceled) {
      if (statusId === EnumTransferMaterialStatus.Canceled) {
        return EnumTransferMaterialStep.Error;
      }
      if (statusId <= stepFinal) {
        return EnumTransferMaterialStep.Finish;
      }
      if (statusId === stepFinal + DEFAULT_STEP_SKIP) {
        return EnumTransferMaterialStep.Process;
      }
      return EnumTransferMaterialStep.Wait;
    } else {
      if (statusId <= currentStep) {
        return EnumTransferMaterialStep.Finish;
      }
      if (statusId === currentStep + DEFAULT_STEP_SKIP) {
        return EnumTransferMaterialStep.Process;
      }
      return EnumTransferMaterialStep.Wait;
    }
  };

  const onEditTransferMaterial = () => {
    history.push(`/inventory/transfer-material/edit/${transferMaterialId}`);
  };

  const mappingToDataTable = (data) => {
    let materials = [];
    data.map((item, index) => {
      let material = {
        no: index + 1,
        sku: item?.material?.sku,
        materialID: item?.material?.id,
        material: item?.material?.name,
        quantity: item?.quantity,
        unitName: item?.unit?.name,
        thumbnail: item?.material?.thumbnail,
      };
      materials.push(material);
    });
    return materials;
  };

  const columnsMaterial = () => {
    let columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        width: "5%",
      },
      {
        title: pageData.table.sku,
        dataIndex: "sku",
        width: "20%",
      },
      {
        title: pageData.table.materialName,
        dataIndex: "material",
        width: "35%",
        render: (_, record) => {
          return (
            <>
              <Image
                className="thumbnail"
                width={88}
                height={88}
                src={record?.thumbnail ?? "error"}
                fallback={images.imgDefault}
              />
              <Link className="name-material" to={`/inventory/material/detail/${record?.materialID}`} target="_blank">
                {record?.material}
              </Link>
            </>
          );
        },
      },
      {
        title: pageData.table.quantity,
        dataIndex: "quantity",
        width: "15%",
        render: (quantity) => {
          return <span>{formatCurrencyWithoutSymbol(quantity)}</span>;
        },
      },
      {
        title: pageData.table.importUnit,
        dataIndex: "unitName",
        width: "25%",
      },
    ];
    return columns;
  };

  const onUpdateStatus = async (key) => {
    const requestCheckChange = {
      transferMaterialId: transferMaterialId,
      currentStatusId: transferMaterialDetail?.statusId,
    };

    const responseCheckChange = await transferMaterialDataService.CheckChangeTransferMaterialStatusByIdAsync(
      requestCheckChange
    );
    if (responseCheckChange?.isNotCurrentStatusId) {
      setIsShowModalStatusIsChanged(true);
      return;
    }

    let requestUpdate = {
      id: transferMaterialId,
      action: EnumTransferMaterialStatus.Draft,
    };

    //Draft => Inprogress
    if (transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Draft && key === EnumNextAction.Approve) {
      requestUpdate.action = EnumTransferMaterialStatus.Inprogress;
    }

    //Inprogress => Delivering
    else if (
      transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Inprogress &&
      key === EnumNextAction.Delivering
    ) {
      requestUpdate.action = EnumTransferMaterialStatus.Delivering;
    }

    //Delivering => Completed
    else if (
      transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Delivering &&
      key === EnumNextAction.Complete
    ) {
      requestUpdate.action = EnumTransferMaterialStatus.Completed;
    }

    //Draft || Inprogress || Delivering => Cancel
    else if (
      (transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Draft ||
        transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Inprogress ||
        transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Delivering) &&
      key === EnumNextAction.Cancel
    ) {
      requestUpdate.action = EnumTransferMaterialStatus.Canceled;
    }

    handleUpdateStatusTransferMaterial(requestUpdate);
  };

  const checkShowMenuAction = (key) => {
    switch (key) {
      case EnumKeyMenuAction.Edit:
        return isDraftStatus || transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Inprogress;
      case EnumKeyMenuAction.Cancel:
        return (
          isDraftStatus ||
          transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Inprogress ||
          transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Delivering
        );
      default:
        return false;
    }
  };

  const stateDropdown = (open) => {
    setIsUpDropDown(open);
  };

  const renderDropdownLink = () => {
    const menu = (
      <Menu className="dropdown-menu-action-transfer-material">
        {hasPermission(PermissionKeys.EDIT_TRANSFER_MATERIAL) && checkShowMenuAction(EnumKeyMenuAction.Edit) && (
          <Menu.Item key={EnumKeyMenuAction.Edit}>
            <a onClick={onEditTransferMaterial}>
              <Space>
                <EditIcon />
                {pageData.edit}
              </Space>
            </a>
          </Menu.Item>
        )}
        {hasPermission(PermissionKeys.CANCEL_TRANSFER_MATERIAL) && checkShowMenuAction(EnumKeyMenuAction.Cancel) && (
          <Menu.Item key={EnumKeyMenuAction.Cancel}>
            <CancelConfirmComponent
              title={pageData.confirmCancel}
              content={pageData.cancelTransferMaterial}
              okText={pageData.cancel}
              cancelText={pageData.ignore}
              permission={PermissionKeys.CANCEL_TRANSFER_MATERIAL}
              onOk={() => onUpdateStatus(EnumNextAction.Cancel)}
            />
          </Menu.Item>
        )}
        <Menu.Item key={EnumKeyMenuAction.Print}>
          <a>
            <Space>
              <PrintIcon />
              {pageData.print}
            </Space>
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown
        className="ant-dropdown-link button-action"
        trigger={["click"]}
        overlay={menu}
        onOpenChange={(open) => stateDropdown(open)}
      >
        <Row>
          {pageData.action}
          <span className="icon-dropdown-action">{isUpDropdown ? <ArrowUpActionIcon /> : <ArrowDownActionIcon />}</span>
        </Row>
      </Dropdown>
    );
  };

  const renderButtonApprove = () => {
    let dataButton = { name: "", key: 0, isPermission: true };
    if (isDraftStatus) {
      dataButton = {
        name: pageData.statusButton.approve,
        key: EnumNextAction.Approve,
        isPermission: hasPermission(PermissionKeys.APPROVE_TRANSFER_MATERIAL),
      };
    } else if (transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Inprogress) {
      dataButton = {
        name: pageData.statusButton.deliver,
        key: EnumNextAction.Delivering,
        isPermission: hasPermission(PermissionKeys.DELIVER_TRANSFER_MATERIAL),
      };
    } else if (transferMaterialDetail?.statusId === EnumTransferMaterialStatus.Delivering) {
      dataButton = {
        name: pageData.statusButton.complete,
        key: EnumNextAction.Complete,
        isPermission: hasPermission(PermissionKeys.COMPLETE_TRANSFER_MATERIAL),
      };
    } else {
      dataButton = { ...dataButton, isPermission: false };
    }

    return (
      dataButton?.isPermission && (
        <Button className="float-right mr-3" type="primary" onClick={() => onUpdateStatus(dataButton.key)}>
          {dataButton.name}
        </Button>
      )
    );
  };

  const handleHideModalStatusIsChanged = () => {
    fetchData();
    setIsShowModalStatusIsChanged(false);
  };

  const handleHideModalError = () => {
    setIsShowModalError(false);
  };

  const handleUpdateStatusTransferMaterial = async (requestUpdate) => {
    const responseUpdate = await transferMaterialDataService.UpdateTransferMaterialStatusByIdAsync(requestUpdate);

    if (responseUpdate?.isSuccess) {
      if (requestUpdate === EnumTransferMaterialStatus.Canceled) {
        message.success(pageData.cancelTransferMaterialSuccess);
      } else {
        message.success(pageData.updateTransferMaterialSuccess);
      }
    } else {
      if (responseUpdate?.typeError === EnumTransferMaterialError.NotEnoughQuantity) {
        setContentModalError(t(responseUpdate?.message));
        setIsShowModalError(true);
      } else {
        message.error(pageData.updateTransferMaterialFailed);
      }
    }
    fetchData();
  };

  return (
    <div className="transfer-material-view">
      <Row>
        <Col span={24}>
          <Link to="/inventory/transfer-material" className="back-to-list">
            <ArrowLeftOutlined /> <span></span> {pageData.backTo} {pageData.transferMaterialManagement}
          </Link>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col xs={24} sm={24} md={24} lg={24} xl={5} xxl={6}>
          <Row>
            <Text className="text-code">{transferMaterialDetail?.code}</Text>
          </Row>
          <Row>{renderDropdownLink()}</Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={19} xxl={13}>
          <div className="steps-custom steps-wrapper">
            <div className="step-region">{renderStepsTransferMaterial(transferMaterialDetail)}</div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={5} className="float-right">
          {renderButtonApprove()}
        </Col>
      </Row>
      <div className="card-parent">
        <Card className="mt-3 mb-4 card-general-info" title={pageData.generalInfo}>
          <Row className="mb-3">
            <Col xs={24} lg={12}>
              <span className="title-branch-warehouse">{pageData.fromBranchWarehouse}: </span>
              <p className="mt-2">
                <span className="content-branch-warehouse">{transferMaterialDetail?.fromWarehouse?.name}</span>
              </p>
            </Col>
            <Col xs={24} lg={12}>
              <span className="title-branch-warehouse">{pageData.destination}: </span>
              <p className="mt-2">
                <span className="content-branch-warehouse">{transferMaterialDetail?.toWarehouse?.name}</span>
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={24} lg={24}>
              <h3>{pageData.note}: </h3>
              <p className="mt-2 content-branch-warehouse">{transferMaterialDetail?.note}</p>
            </Col>
          </Row>
        </Card>
        <Card className="mt-1 card-material-info" title={pageData.materialInformation}>
          <FnbTable dataSource={transferMaterialMaterials} columns={columnsMaterial()} />
          {transferMaterialMaterials?.length > 0 && (
            <Row className="right-total-material">
              <Row className="float-right total">
                <Col className="total-width">
                  <Row total>
                    <Text className="material-quantity-label">{pageData.table.total}: </Text>
                  </Row>
                </Col>
                <Col className="total-width">
                  <Row className="float-right">
                    <Text strong className="material-quantity-label">
                      {transferMaterialMaterials?.length}
                    </Text>
                    &nbsp;
                    {pageData.table.material}
                  </Row>
                </Col>
              </Row>
            </Row>
          )}
        </Card>
      </div>
      <Modal
        className={`delete-confirm-modal`}
        title={pageData.titleNotification}
        open={isShowModalStatusIsChanged}
        okText={pageData.ok}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => {
          handleHideModalStatusIsChanged();
        }}
        centered={true}
        closable={false}
      >
        <span>{pageData.contentNotificationStatusIsChanged}</span>
      </Modal>

      <Modal
        className={`delete-confirm-modal`}
        title={pageData.titleNotification}
        open={isShowModalError}
        okText={pageData.iGotIt}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => {
          handleHideModalError();
        }}
        centered={true}
        closable={false}
      >
        <span>{contentModalError}</span>
      </Modal>
    </div>
  );
}
