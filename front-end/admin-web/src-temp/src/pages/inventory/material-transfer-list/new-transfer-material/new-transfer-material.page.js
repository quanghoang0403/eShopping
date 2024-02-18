import { Button, Card, Col, Form, Input, InputNumber, Row, Space, Tooltip, Typography, message } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import FnbSelectMaterialByWareHouseComponent from "components/fnb-select-material/fnb-select-material-by-warehouse";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { DELAYED_TIME, tableSettings } from "constants/default.constants";
import { IconBtnAdd, TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import materialDataService from "data-services/material/material-data.service";
import transferMaterialDataService from "data-services/transfer-material/transfer-material-data.service";
import unitConversionDataService from "data-services/unit-conversion/unit-conversion-data.service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { formatTextNumber, formatterDecimalNumber, isDecimalKey, parserDecimalNumber } from "utils/helpers";
import "../index.scss";
import "./new-transfer-material.scss";
const { TextArea } = Input;
const { Text } = Typography;

export default function NewTransferMaterialComponent(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [initDataMaterials, setInitDataMaterials] = useState([]);
  const [dataSelectedMaterial, setDataSelectedMaterial] = useState([]);
  const [fromDataSelect, setFromDataSelect] = useState(branches);
  const [toDataSelect, setToDataSelect] = useState(branches);
  const [fromDataSelectChoice, setFromDataSelectChoice] = useState(branches);
  const [isSelectedMaterial, setIsSelectedMaterial] = useState(true);
  const isOnMobileDevice = useMediaQuery({ maxWidth: 575 });
  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    okText: t("button.ok"),
    leaveForm: t("messages.leaveForm"),
    createTransferMaterialSuccess: t("messages.createTransferMaterialSuccess"),
    updateTransferMaterialSuccess: t("messages.updateTransferMaterialSuccess"),
    createTransferMaterial: t("transferMaterial.createTransferMaterial"),
    from: t("transferMaterial.from"),
    selectTransferMaterial: t("transferMaterial.selectTransferMaterial"),
    pleaseSelectTransferMaterial: t("transferMaterial.pleaseSelectTransferMaterial"),
    materials: t("transferMaterial.materials"),
    materialInformation: t("purchaseOrder.materialInformation"),
    searchMaterial: t("purchaseOrder.searchMaterial"),
    pleaseSelectMaterial: t("inventoryTracking.pleaseSelectMaterial"),
    pleaseSelectMaterialTransfer: t("inventoryTracking.pleaseSelectMaterialTransfer"),
    note: t("form.note"),
    selectBranch: t("staffManagement.permission.selectBranch"),
    pleaseSelectBranch: t("staffManagement.permission.pleaseSelectBranch"),
    supplier: {
      title: t("supplier.title"),
      selectSupplier: t("supplier.selectSupplier"),
      pleaseSelectSupplier: t("supplier.pleaseSelectSupplier"),
    },
    table: {
      no: t("table.no"),
      sku: t("table.sku"),
      materialName: t("table.materialName"),
      material: t("material.title"),
      quantity: t("table.quantity"),
      importUnit: t("table.importUnit"),
      transferUnit: t("table.transferUnit"),
      pleaseSelectTransferUnit: t("productManagement.unit.pleaseSelectTransferUnit"),
      unitPlaceholder: t("productManagement.unit.unitPlaceholder"),
      importPrice: t("table.importPrice"),
      total: t("table.total"),
      totalCost: t("table.totalCost"),
      action: t("table.action"),
      inventory: t("table.inventory"),
      branchName: t("table.branchName"),
    },
    btnCreate: t("button.create"),
    generalInformation: t("purchaseOrder.generalInformation"),
    goBackToPurchaseOrder: t("purchaseOrder.goBackTo"),
    pleaseEnterQuantity: t("purchaseOrder.pleaseEnterQuantity"),
    pleaseImportPrice: t("purchaseOrder.pleaseImportPrice"),
    confirmation: t("leaveDialog.confirmation"),
    confirmationOkText: t("button.confirmationOkText"),
    confirmationCancelText: t("button.confirmationCancelText"),
    confirmMessage: t("messages.confirmLeave"),
    freeTextArea: t("purchaseOrder.freeTextArea"),
    destination: t("purchaseOrder.destinationLabel"),
    maximumAvailable: t("transferMaterial.maximumAvailable"),
    validateMinQtyMessage: t("productManagement.pricing.priceRange"),
  };

  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [maxQuantityConversions, setMaxQuantityConversions] = useState(0);
  const [disableCreateButton, setDisableCreateButton] = useState(true);
  const [visibleModalLeaveConfirm, setVisibleModelLeaveConfirm] = useState(false);

  useEffect(() => {
    fetchInitData();
  }, []);

  const fetchInitData = async () => {
    const response = await transferMaterialDataService.getComboTransferMaterialDataAsync("");
    const { warehouses, materials } = response;
    setBranches(warehouses);
    setMaterials(materials);
    setInitDataMaterials(materials);
    setFromDataSelect(warehouses);
    setToDataSelect(warehouses);
  };

  const getUnitConversionsByMaterialId = async (id, material) => {
    let res = await unitConversionDataService.getUnitConversionsByMaterialIdAsync(id);
    let units = [];
    if (res) {
      res.unitConversions?.map((uc) => {
        let unit = {
          id: uc?.unitId,
          name: uc?.unit?.name,
          capacity: uc?.capacity,
        };
        units.push(unit);
      });
      units.push(material.unit);
    }
    return units.sort((a, b) => a.name.localeCompare(b.name));
  };

  const getMaterialByFromWareHouseId = async (id, material) => {
    let res = await materialDataService.getMaterialByIdAsync(id);
    let materialInventoryBranches = [];
    if (res) {
      res.material?.materialInventoryBranches?.map((mt) => {
        let materialInventoryBranch = {
          branchId: mt?.branch.id,
          name: mt?.branch.name,
          quantity: mt?.quantity,
        };
        materialInventoryBranches.push(materialInventoryBranch);
      });
    }
    return materialInventoryBranches.sort((a, b) => a.name.localeCompare(b.name));
  };

  const maxQuantityByBranches = (index, rule, value, callback) => {
    const changeRecord = dataSelectedMaterial[index];
    var maxQuantity = 0;
    let isQuantity = true;

    if (fromDataSelectChoice) {
      const newRecordQuantity = changeRecord.materialInventoryBranches.find((x) => x.branchId === fromDataSelectChoice);
      maxQuantity = newRecordQuantity ? newRecordQuantity.quantity : 0;
      if (maxQuantityConversions && maxQuantityConversions !== 0) {
        let maxQuantityConversion = maxQuantityConversions * changeRecord?.quantity;
        isQuantity = maxQuantity > maxQuantityConversion;
      }
    }

    if ((value && value > maxQuantity) || !isQuantity) {
      maxQuantity = maxQuantityConversions !== 0 ? maxQuantity / maxQuantityConversions : maxQuantity;
      const validateMessage = pageData.maximumAvailable + formatTextNumber(maxQuantity);
      return Promise.reject(validateMessage);
    }
    return Promise.resolve();
  };

  const mappingToDataTable = (item, index) => {
    return {
      id: item?.id,
      no: index + 1,
      sku: item?.sku,
      material: item?.name,
      quantity: 0,
      unitId: item?.unit?.id ?? null,
    };
  };

  const onFinish = async (values) => {
    form.validateFields().then(async (values) => {
      const fromWarehouseType = branches.find((x) => x?.id === values.transferMaterial.fromWarehouseId)?.type;
      const toWarehouseType = branches.find((x) => x?.id === values.transferMaterial.toWarehouseId)?.type;

      if (dataSelectedMaterial.length > 0) {
        const createTransferMaterialRequestModel = {
          ...values.transferMaterial,
          fromWarehouseType,
          toWarehouseType,
          materials: dataSelectedMaterial,
        };
        /// Add Transfer Material
        const res = await transferMaterialDataService.createTransferMaterialAsync(createTransferMaterialRequestModel);
        if (res) {
          leaveOnOk();
          message.success(pageData.createTransferMaterialSuccess);
        }
      } else {
        setIsSelectedMaterial(false);
        var element = document.getElementById("select-material-error");
        scrollingIntoErrorMessage(element);
      }
    });
  };

  const scrollingIntoErrorMessage = (messageErrorElement) => {
    if (messageErrorElement) {
      messageErrorElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "start",
      });
    }
  };

  const columnsMaterial = () => {
    let columns = [
      {
        title: pageData.table.no,
        dataIndex: "no",
        align: "left",
        width: "8%",
        render: (_, record, index) => (
          <Row className="ml-10">
            <Col span={24}>{index + 1}</Col>
          </Row>
        ),
      },
      {
        title: pageData.table.sku,
        dataIndex: "sku",
        align: "left",
        width: "15%",
      },
      {
        title: pageData.table.materialName,
        dataIndex: "material",
        align: "left",
        width: "27%",
        render: (record, index) => {
          return (
            <Link to={`/inventory/material/detail/${index.id}`} target="_blank">
              {record}
            </Link>
          );
        },
      },
      {
        title: pageData.table.quantity,
        dataIndex: "quantity",
        align: "left",
        width: "20%",
        render: (_, record, index) => (
          <Row align="middle" justify="start">
            <Col span={24}>
              <Form.Item
                name={["transferMaterial", "materials", index, "quantity"]}
                rules={[
                  {
                    required: true,
                    message: pageData.pleaseEnterQuantity,
                  },
                  {
                    validator: (rule, value, callback) => maxQuantityByBranches(index, rule, value, callback),
                  },
                  () => ({
                    validator(_, value) {
                      if (value < 1) {
                        return Promise.reject(pageData.validateMinQtyMessage);
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                className="input-quantity"
              >
                <InputNumber
                  onChange={(value) => onChangeRecord(index, "quantity", value)}
                  defaultValue={record.quantity}
                  className="fnb-input quantity-material w-100"
                  formatter={(value) => formatterDecimalNumber(value)}
                  parser={(value) => parserDecimalNumber(value)}
                  onKeyPress={(event) => {
                    if (!isDecimalKey(event)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        ),
      },
      {
        title: pageData.table.transferUnit,
        dataIndex: "unitId",
        align: "left",
        width: "20%",
        render: (_, record, index) => {
          const units = record?.units?.filter((a) => a?.id !== undefined);
          return (
            <Row align="middle" justify="start">
              <Col span={24}>
                <Form.Item
                  name={["transferMaterial", "selectedMaterials", index, "unit"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.table.pleaseSelectTransferUnit,
                    },
                  ]}
                  className="input-unit"
                >
                  <FnbSelectSingle
                    showSearch
                    placeholder={pageData.unitPlaceholder}
                    option={units?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    }))}
                    onChange={(value) => onSelectUnit(value, index)}
                  />
                </Form.Item>
              </Col>
            </Row>
          );
        },
      },
      {
        title: pageData.table.action,
        dataIndex: "action",
        align: "center",
        justify: "middle",
        width: "10%",
        render: (_, record, index) => (
          <Space wrap>
            <div className="fnb-table-action-icon">
              <Tooltip placement="top" title={t("button.delete")} color="#50429B">
                <TrashFill className="icon-svg-hover" onClick={() => onRemoveItemMaterial(record?.id, index)} />
              </Tooltip>
            </div>
          </Space>
        ),
      },
    ];
    return columns;
  };

  const onSelectMaterial = async (id, pageNumber, pageSize) => {
    setIsSelectedMaterial(true);
    let formValue = form.getFieldsValue();
    let { transferMaterial } = formValue;

    const restMaterials = materials.filter((o) => o.id !== id);
    const selectedMaterial = materials.find((o) => o.id === id);
    const newRow = mappingToDataTable(selectedMaterial, dataSelectedMaterial.length);
    var units = await getUnitConversionsByMaterialId(id, selectedMaterial);
    var materialInventoryBranches = await getMaterialByFromWareHouseId(id, selectedMaterial);
    newRow.units = units;
    newRow.materialInventoryBranches = materialInventoryBranches;
    setMaterials(restMaterials);
    setDataSelectedMaterial([...dataSelectedMaterial, newRow]);
    transferMaterial.material = null;
    form.setFieldsValue(formValue);
    let numberRecordCurrent = dataSelectedMaterial.length ?? 0;
    if (numberRecordCurrent > dataSelectedMaterial.length) {
      numberRecordCurrent = dataSelectedMaterial.length + 1;
    }
    setNumberRecordCurrent(numberRecordCurrent);
    setIsChangeForm(true);
  };

  const onRemoveItemMaterial = (id) => {
    let restMaterials = dataSelectedMaterial.filter((o) => o.id !== id);
    setDataSelectedMaterial(restMaterials);

    let initDataMaterial = initDataMaterials.find((o) => o.id === id);
    materials.push(initDataMaterial);
    setNumberRecordCurrent(numberRecordCurrent - 1);
    dataSelectedMaterial.length === 1 &&
      form.setFieldValue(["transferMaterial", "selectedMaterials", 0, "unit"], undefined);

    restMaterials.map((product, index) => {
      form.setFieldValue(["transferMaterial", "materials", index, "quantity"], product?.quantity);
      form.setFieldValue(["transferMaterial", "selectedMaterials", index, "unit"], product?.unitId);
    });

    if (restMaterials.length === 0) {
      setIsSelectedMaterial(false);
    }
  };

  const onSelectUnit = (value, index) => {
    dataSelectedMaterial?.map((items, i) => {
      if (i === index) {
        items.unitId = value;
      }
      const quantity = items?.units.find((item) => item.id === value)?.capacity ?? 0;
      setMaxQuantityConversions(quantity);
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onChangeRecord = (index, column, value) => {
    const changeRecord = dataSelectedMaterial[index];
    const quantity = column === "quantity" ? value : changeRecord.quantity;
    dataSelectedMaterial?.map((item, i) => {
      if (i === index) {
        item.quantity = quantity;
      }
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setVisibleModelLeaveConfirm(true);
    } else {
      setVisibleModelLeaveConfirm(false);
      leaveOnOk();
    }
  };

  const changeForm = () => {
    setIsChangeForm(true);
    setDisableCreateButton(false);
  };

  const leaveOnOk = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push("/inventory/transfer-material");
    }, DELAYED_TIME);
  };

  const leaveOnCancel = () => {
    setVisibleModelLeaveConfirm(false);
  };

  const getTotalMaterials = () => {
    let total = dataSelectedMaterial.length;
    return total;
  };

  const onChangeFromWarehouseId = async (warehouseId) => {
    const newFromData = [...branches];
    setToDataSelect(newFromData.filter((x) => x?.id !== warehouseId));
    setFromDataSelectChoice(warehouseId);
    const response = await transferMaterialDataService.getComboTransferMaterialDataAsync(warehouseId);
    const { materials } = response;
    setMaterials(materials);
  };

  const onComboToChange = (value) => {
    const newToData = [...branches];
    setFromDataSelect(newToData.filter((x) => x?.id !== value));
  };

  const onFinishFailed = (errorInfo) => {
    const { errorFields } = errorInfo;

    if (errorFields.length > 0 && errorFields[0].name.includes("transferMaterial")) {
      const elementId = `basic_${errorFields[0].name[0]}_${errorFields[0].name[1]}_${errorFields[0].name[2]}_${errorFields[0].name[3]}`;
      const element = document.getElementById(elementId);

      scrollingIntoErrorMessage(element);
    }
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
        onFieldsChange={(e) => changeForm(e)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 22,
        }}
        className="create-transfer-material-form"
      >
        <Row className="fnb-row-page-header">
          <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
            <p className="card-header">
              <PageTitle content={pageData.createTransferMaterial} />
            </p>
          </Col>
          <Col span={12} xs={24} sm={24} md={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={disableCreateButton}
                      icon={<IconBtnAdd className="icon-btn-add-purchase-order" />}
                      className="btn-add-purchase-order"
                    >
                      {pageData.btnCreate}
                    </Button>
                  ),
                  permission: PermissionKeys.CREATE_NEW_TRANSFER_MATERIAL,
                },
                {
                  action: (
                    <Button htmlType="button" onClick={(props) => onCancel(props)} className="action-cancel">
                      {pageData.btnCancel}
                    </Button>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>
        <div className="col-input-full-width">
          <Row align="middle">
            <Card className="w-100 mb-3 fnb-card h-auto">
              <Row gutter={16} align="middle">
                <Col span={24}>
                  <h4 className="title-transfer-material">{pageData.generalInformation}</h4>
                </Col>
                <Col className="gutter-row" span={12} md={12} sm={24} xs={24}>
                  <h4 className="fnb-form-label">
                    {pageData.from}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["transferMaterial", "fromWarehouseId"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseSelectTransferMaterial,
                      },
                    ]}
                  >
                    <FnbSelectSingle
                      placeholder={pageData.selectTransferMaterial}
                      showSearch
                      option={fromDataSelect?.map((item) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                      onChange={(value) => onChangeFromWarehouseId(value)}
                    />
                  </Form.Item>
                </Col>
                <Col className="gutter-row" span={12} md={12} sm={24} xl={12} xs={24}>
                  <h4 className="fnb-form-label">
                    {pageData.destination}
                    <span className="text-danger">*</span>
                  </h4>
                  <Form.Item
                    name={["transferMaterial", "toWarehouseId"]}
                    rules={[
                      {
                        required: true,
                        message: pageData.pleaseSelectTransferMaterial,
                      },
                    ]}
                  >
                    <FnbSelectSingle
                      showSearch
                      placeholder={pageData.selectTransferMaterial}
                      option={toDataSelect?.map((item) => ({
                        id: item.id,
                        name: item.name,
                      }))}
                      onChange={(value) => onComboToChange(value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row align="middle">
                <Col span={24}>
                  <h4 className="fnb-form-label">
                    {pageData.note}
                    <span className="text-danger"></span>
                  </h4>
                  <Form.Item name={["transferMaterial", "note"]}>
                    <TextArea
                      className="fnb-text-area-with-count no-resize combo-description-box"
                      showCount
                      maxLength={255}
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      placeholder={pageData.freeTextArea}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Row>
          <Row className="display-contents">
            <Card className="mt-1 fnb-card h-auto">
              <Row>
                <Col span={24} className="mb-15">
                  <h4 className="title-transfer-material">{pageData.materialInformation}</h4>
                  <Form.Item className="w-100">
                    <FnbSelectMaterialByWareHouseComponent
                      materialList={materials}
                      t={t}
                      onChangeEvent={onSelectMaterial}
                      fromWareHouseId={fromDataSelectChoice}
                    />
                    {!isSelectedMaterial && (
                      <div
                        id="select-material-error"
                        className="ant-form-item-material-error"
                        ref={(errorDiv) => {
                          scrollingIntoErrorMessage(errorDiv);
                        }}
                      >
                        {pageData.pleaseSelectMaterialTransfer}
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <FnbTable
                    tableId="material-list"
                    className="mt-4 material-list fnb-table-min-height fnb-table-new-transfer"
                    columns={columnsMaterial()}
                    pageSize={tableSettings.pageSize}
                    dataSource={dataSelectedMaterial}
                    currentPageNumber={pageNumber}
                    total={dataSelectedMaterial.length}
                    scrollX={isOnMobileDevice ? 1224 : ""}
                  />
                </Col>
              </Row>
              <br />
              <Row justify="end" align="middle" className="h-bg-brad-transfer-material-class">
                <Col xs={0} sm={0} md={0} lg={14}></Col>
                <Col xs={24} sm={24} md={24} lg={10}>
                  <Row align="middle">
                    <Col span={24} className="pl20">
                      <br />
                      <Row>
                        <Col span={24} className="fz16 mb20 text-center">
                          <Text className="float-left" strong>
                            {pageData.table.total}:
                          </Text>
                          <span className="float-right pr10">
                            <span className="bold-materials">{getTotalMaterials()}</span>
                            {pageData.materials}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.confirmation}
        content={pageData.leaveForm}
        visible={visibleModalLeaveConfirm}
        skipPermission={true}
        cancelText={pageData.confirmationCancelText}
        cancelButtonProps={{ className: "cancel-leave-button" }}
        okText={pageData.confirmationOkText}
        onCancel={leaveOnCancel}
        onOk={leaveOnOk}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
