import { StopOutlined } from "@ant-design/icons";
import { Button, Col, message, Row } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { CancelButton } from "components/cancel-button";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbQrCode } from "components/fnb-qr-code/fnb-qr-code.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { StopFill } from "constants/icons.constants";
import { OrderTypeConstants } from "constants/order-type-status.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { QRCodeStatus } from "constants/qr-code.constants";
import { DateFormat } from "constants/string.constants";
import qrCodeDataService from "data-services/qr-code/qr-code-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { setQrCodeData } from "store/modules/qr-code/qr-code.actions";
import { formatTextNumber } from "utils/helpers";
import "./detail-qr-order.scss";

export default function QrCodeDetailPage(props) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const param = useParams();
  const history = useHistory();
  const [qrCode, setQrCode] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmStop, setShowConfirmStop] = useState(false);

  const pageData = {
    noColumnTitle: t("detailQrCode.noColumnTitle", "No"),
    productNameColumnTitle: t(
      "detailQrCode.productNameColumnTitle",
      "Product name"
    ),
    quantityColumnTitle: t("detailQrCode.quantityColumnTitle", "Quantity"),
    unitNameColumnTitle: t("detailQrCode.unitNameColumnTitle", "Unit"),
    generalInformation: t(
      "detailQrCode.generalInformation",
      "General information"
    ),
    name: t("detailQrCode.name", "Name"),
    branch: t("detailQrCode.branch", "Branch"),
    serviceType: t("detailQrCode.serviceType", "Service Type"),
    area: t("detailQrCode.area", "Area"),
    table: t("detailQrCode.table", "Table"),
    validFrom: t("detailQrCode.validFrom", "Valid from"),
    validUntil: t("detailQrCode.validUntil", "Valid until"),
    target: t("detailQrCode.target", "Target"),
    discount: t("detailQrCode.discount", "Discount"),
    discountValue: t("detailQrCode.discountValue", "Discount Value"),
    maxDiscount: t("detailQrCode.maxDiscount", "Max Discount"),
    button: {
      leave: t("button.leave", "Leave"),
      edit: t("button.edit", "Edit"),
      clone: t("button.clone", "Clone"),
      stop: t("button.stop", "Stop"),
      delete: t("button.delete", "Delete"),
      btnStop: t("button.stop"),
      btnIgnore: t("button.ignore"),
      btnIgnoreDelete: t("marketing.qrCode.ignoreText"),
    },
    deleteQrCodeSuccess: t("marketing.qrCode.deleteQrCodeSuccess"),
    deleteQrCodeFail: t("marketing.qrCode.deleteQrCodeFail"),
    confirmDeleteMessage: t("marketing.qrCode.confirmDeleteMessage"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    stopQrCodeSuccess: t("marketing.qrCode.stopQrCodeSuccess"),
    stopQrCodeFail: t("marketing.qrCode.stopQrCodeFail"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmStopQrCode: t("marketing.qrCode.confirmStop"),
    stop: t("button.stop"),
  };

  useEffect(() => {
    getInitDataAsync(param.qrCodeId);
  }, []);

  const getInitDataAsync = async (id) => {
    var res = await qrCodeDataService.getQrCodeByIdAsync(id);
    if (res) {
      setQrCode(res.qrCodeDetail);
    } else {
      goBack();
    }
  };

  const getProductTableColumns = () => {
    let columns = [
      {
        title: pageData.noColumnTitle,
        width: "74px",
        className: "",
        render: (_, record, index) => <>{index + 1}</>,
      },
      {
        title: pageData.productNameColumnTitle,
        width: "707px",
        className: "",
        render: (_, record) => (
          <div className="product-name-box">
            <div>
              <Thumbnail
                src={record?.productThumbnail}
                width={88}
                height={88}
              />
            </div>
            <span className="product-name-text">{record?.productName}</span>
          </div>
        ),
      },
      {
        title: pageData.quantityColumnTitle,
        width: "375px",
        className: "",
        render: (_, record) => <>{formatTextNumber(record?.productQuantity)}</>,
      },
      {
        title: pageData.unitNameColumnTitle,
        width: "318px",
        className: "",
        render: (_, record) => <>{record?.unitName}</>,
      },
    ];
    return columns;
  };

  const goToEditQrCodePage = () => {
    history.push(`/qr-order/edit/${param.qrCodeId}`);
  };

  const goBack = () => {
    history.push("/marketing/qr-order");
  };

  const goToClonePage = async () => {
    const response = await qrCodeDataService.getQrCodeByIdAsync(
      qrCode.qrCodeId
    );
    if (response) {
      const { qrCodeDetail } = response;
      dispatch(setQrCodeData(qrCodeDetail));

      history.push("/qr-order/clone");
    }
  };

  const onDeleteQrCode = async (id) => {
    const res = await qrCodeDataService.deleteQrCodeByIdAsync(id);
    if (res) {
      message.success(pageData.deleteQrCodeSuccess);
    } else {
      message.error(pageData.deleteQrCodeFail);
    }
    goBack();
  };

  const onStopQrCode = async (id) => {
    await qrCodeDataService.stopQrCodeByIdAsync(id).then((res) => {
      if (res) {
        message.success(pageData.stopQrCodeSuccess);
      } else {
        message.error(pageData.stopQrCodeFail);
      }
      goBack();
    });
  };

  const getActionButton = () => {
    const editButton = {
      action: (
        <Button
          className="button-edit-qr-code"
          type="primary"
          onClick={goToEditQrCodePage}
        >
          {pageData.button.edit}
        </Button>
      ),
      permission: PermissionKeys.EDIT_QR_CODE,
    };

    const cloneButton = {
      action: (
        <Button
          className={
            qrCode?.statusId === QRCodeStatus.Finish
              ? "button-edit-qr-code"
              : "button-stop-qr-code"
          }
          type={qrCode?.statusId === QRCodeStatus.Finish ? "primary" : "link"}
          onClick={goToClonePage}
        >
          {pageData.button.clone}
        </Button>
      ),
      permission: PermissionKeys.CREATE_QR_CODE,
    };

    const stopButton = {
      action: (
        <Button
          className={
            qrCode?.statusId !== QRCodeStatus.Schedule
              ? "button-edit-qr-code"
              : "button-stop-qr-code"
          }
          type={qrCode?.statusId !== QRCodeStatus.Schedule ? "primary" : "link"}
          onClick={() => setShowConfirmStop(true)}
        >
          {pageData.button.stop}
        </Button>
      ),
      permission: qrCode?.isStopped ? " " : PermissionKeys.STOP_QR_CODE,
    };

    const leaveButton = {
      action: <CancelButton buttonText={pageData.button.leave} onOk={goBack} />,
    };

    const deleteButton = {
      action: (
        <Button
          className="button-stop-qr-code button-delete-qr-code"
          type="link"
          onClick={() => setShowConfirmDelete(true)}
        >
          {pageData.button.delete}
        </Button>
      ),
      permission: qrCode?.canDelete ? PermissionKeys.DELETE_QR_CODE : " ",
    };

    switch (qrCode?.statusId) {
      case QRCodeStatus.Active:
        return [stopButton, leaveButton, cloneButton];

      case QRCodeStatus.Finish:
        return [cloneButton, leaveButton];

      case QRCodeStatus.Schedule:
        return [editButton, cloneButton, leaveButton, deleteButton];

      default:
        return [leaveButton];
    }
  };

  return (
    <>
      <DeleteConfirmComponent
        title={pageData.confirmDelete}
        content={t(pageData.confirmDeleteMessage, { name: qrCode?.name })}
        skipPermission={true}
        okText={pageData.button.delete}
        cancelText={pageData.button.btnIgnoreDelete}
        permission={PermissionKeys.DELETE_QR_CODE}
        onOk={() => onDeleteQrCode(param?.qrCodeId)}
        onCancel={() => setShowConfirmDelete(false)}
        visible={showConfirmDelete}
      />
      <DeleteConfirmComponent
        icon={<StopOutlined />}
        buttonIcon={<StopFill className="icon-svg-hover pointer" />}
        title={pageData.confirmStop}
        content={t(pageData.confirmStopQrCode, { name: qrCode?.name })}
        skipPermission={true}
        okText={pageData.button.btnStop}
        cancelText={pageData.button.btnIgnoreDelete}
        permission={PermissionKeys.STOP_QR_CODE}
        onCancel={() => setShowConfirmStop(false)}
        onOk={() => onStopQrCode(param?.qrCodeId)}
        tooltipTitle={pageData.stop}
        visible={showConfirmStop}
      />
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header card-header">
            <PageTitle content={qrCode?.name} />
          </p>
        </Col>
        <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
          <ActionButtonGroup arrayButton={getActionButton()} />
        </Col>
      </Row>
      <div className="clearfix"></div>

      <div className="qr-code-info-wrapper">
        <div className="qr-code-general-info-card">
          <div className="qr-code-general-info-container">
            <Row>
              <Col xs={24} sm={24} lg={16}>
                <div>
                  <p className="title-text">{pageData.generalInformation}</p>
                </div>
                <div>
                  <p className="label-text mt-20">{pageData.name}</p>
                  <p className="detail-text mt-25">{qrCode?.name}</p>
                </div>
                <div>
                  <p className="label-text mt-56">{pageData.branch}</p>
                  <p className="detail-text mt-25">{qrCode?.branchName}</p>
                </div>
                <div>
                  <p className="label-text mt-56">{pageData.serviceType}</p>
                  <p className="detail-text mt-25">{qrCode?.serviceTypeName}</p>
                </div>

                {qrCode?.serviceTypeId === OrderTypeConstants.InStore && (
                  <Row>
                    <Col xs={24} sm={24} lg={12}>
                      <div>
                        <p className="label-text mt-56">{pageData.area}</p>
                        <p className="detail-text mt-25">{qrCode?.areaName}</p>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} lg={12}>
                      <div>
                        <p className="label-text mt-56">{pageData.table}</p>
                        <p className="detail-text mt-25">
                          {qrCode?.areaTableName}
                        </p>
                      </div>
                    </Col>
                  </Row>
                )}

                <Row className="mb-56">
                  <Col xs={24} sm={24} lg={12}>
                    <div>
                      <p className="label-text mt-56">{pageData.validFrom}</p>
                      <p className="detail-text mt-25">
                        {qrCode?.startDate
                          ? moment
                              .utc(qrCode?.startDate)
                              .local()
                              .format(DateFormat.DD_MM_YYYY)
                          : "-"}
                      </p>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} lg={12}>
                    <div>
                      <p className="label-text mt-56">{pageData.validUntil}</p>
                      <p className="detail-text mt-25">
                        {qrCode?.endDate
                          ? moment
                              .utc(qrCode?.endDate)
                              .local()
                              .format(DateFormat.DD_MM_YYYY)
                          : "-"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} lg={8}>
                <Row className="justify-content-center">
                  <FnbQrCode
                    fileName={qrCode?.qrCodeId}
                    value={qrCode?.url ?? ""}
                    size={172}
                    showDownloadButton
                  />
                </Row>
              </Col>
            </Row>
          </div>
        </div>

        <div className="qr-code-target-info-card mt-24">
          <div className="qr-code-target-info-container">
            <div>
              <p className="title-text">{pageData.target}</p>
            </div>
            <div>
              <p className="label-text mt-20">{pageData.target}</p>
              <p className="detail-text mt-25">{t(qrCode?.targetName)}</p>
            </div>

            {qrCode && qrCode.products && qrCode.products.length > 0 && (
              <div className="mt-48">
                <FnbTable
                  className="table-qr-code-product"
                  dataSource={qrCode?.products}
                  columns={getProductTableColumns()}
                  total={qrCode?.products?.length}
                  scrollY={116 * 5}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
