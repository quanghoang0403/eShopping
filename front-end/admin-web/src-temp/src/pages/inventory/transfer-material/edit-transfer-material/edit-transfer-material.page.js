import { Button, Card, Col, Form, Input, InputNumber, Row, Space, Tooltip, Typography, message } from "antd";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbSelectMaterialByWareHouseComponent from "components/fnb-select-material/fnb-select-material-by-warehouse";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { DELAYED_TIME, tableSettings } from "constants/default.constants";
import { TrashFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import materialDataService from "data-services/material/material-data.service";
import transferMaterialDataService from "data-services/transfer-material/transfer-material-data.service";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatTextNumber, formatterDecimalNumber, isDecimalKey, parserDecimalNumber } from "utils/helpers";
import "./edit-transfer-material.page.scss";
const { TextArea } = Input;
const { Text } = Typography;

export default function UpdateTransferMaterialComponent(props) {
  const { t, unitConversionDataService, match, history } = props;

  const pageData = {
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    okText: t("button.ok"),
    leaveForm: t("messages.leaveForm"),
    createTransferMaterialSuccess: t("messages.createTransferMaterialSuccess"),
    updateTransferMaterialSuccess: t("messages.updateTransferMaterialSuccess"),
    createTransferMaterial: t("transferMaterial.createTransferMaterial"),
    updateTransferMaterial: t("transferMaterial.updateTransferMaterial"),
    from: t("transferMaterial.from"),
    materials: t("transferMaterial.materials"),
    pleaseSelectTransferMaterial: t("transferMaterial.pleaseSelectTransferMaterial"),
    pleaseEnterQuantity: t("transferMaterial.pleaseEnterQuantity"),
    selectTransferMaterial: t("transferMaterial.selectTransferMaterial"),
    materialInformation: t("purchaseOrder.materialInformation"),
    searchMaterial: t("purchaseOrder.searchMaterial"),
    pleaseSelectMaterialTransfer: t("inventoryTracking.pleaseSelectMaterialTransfer"),
    pleaseSelectMaterial: t("material.pleaseSelectMaterial"),
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
      pleaseEnterNameUnit: t("productManagement.unit.pleaseEnterNameUnit"),
      unitPlaceholder: t("productManagement.unit.unitPlaceholder"),
      importPrice: t("table.importPrice"),
      total: t("table.total"),
      totalCost: t("table.totalCost"),
      action: t("table.action"),
      inventory: t("table.inventory"),
      branchName: t("table.branchName"),
    },
    generalInformation: t("purchaseOrder.generalInformation"),
    destination: t("purchaseOrder.destinationLabel"),
    btnUpdate: t("button.update"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    maximumAvailable: t("transferMaterial.maximumAvailable"),
    validateMinQtyMessage: t("productManagement.pricing.priceRange"),
  };

  const [form] = Form.useForm();
  const [transferMaterialId, setTransferMaterialId] = useState(false);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [initDataMaterials, setInitDataMaterials] = useState([]);
  const [dataSelectedMaterial, setDataSelectedMaterial] = useState([]);
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [numberRecordCurrent, setNumberRecordCurrent] = useState();
  const [fromDataSelect, setFromDataSelect] = useState(branches);
  const [toDataSelect, setToDataSelect] = useState(branches);
  const [fromDataSelectChoice, setFromDataSelectChoice] = useState();
  const [maxQuantityConversions, setMaxQuantityConversions] = useState(0);

  const fetchInitData = async (res, transferMaterialDetails) => {
    const response = await transferMaterialDataService.getComboTransferMaterialDataAsync(
      res.transferMaterial?.fromWarehouseId,
    );
    if (response) {
      const { warehouses, materials } = response;
      setBranches(warehouses);
      getMaterialsUpdate(materials, transferMaterialDetails);
      onComboFromChangeFirst(res.transferMaterial?.fromWarehouseId, warehouses);
      onComboToChangeFirst(res?.transferMaterial?.toWarehouseId, warehouses);
    }
  };

  useEffect(() => {
    setTransferMaterialId(match?.params?.id);
    if (match?.params?.id) {
      transferMaterialDataService.getTransferMaterialIdAsync(match?.params?.id).then((res) => {
        if (res && res.transferMaterial) {
          fetchInitData(res, res.transferMaterial.transferMaterialDetails);
          mappingFormEditTransferMaterial(res.transferMaterial);
        }
      });
    }
  }, []);

  const mappingFormEditTransferMaterial = (data) => {
    let listData = [];
    let listDataUpdate = [];
    data?.transferMaterialDetails?.map((item, index) => {
      const restMaterials = materials.filter((o) => o.id !== item.materialId);
      const newRow = mappingToDataTableForEdit(item, index);
      listData.push(newRow);
      setMaterials(restMaterials);
      let detailMaterials = {
        unit: newRow?.unitId,
        quantity: newRow?.quantity,
      };
      listDataUpdate.push(detailMaterials);
    });
    setDataSelectedMaterial(listData);

    let formValue = {
      transferMaterial: {
        fromWarehouseId: data?.fromWarehouseId,
        toWarehouseId: data?.toWarehouseId,
        note: data?.note,
        selectedMaterials: listDataUpdate,
      },
    };
    form.setFieldsValue(formValue);
  };

  const onComboFromChangeFirst = (value, firstFromData) => {
    setToDataSelect(firstFromData.filter((x) => x?.id !== value));
    setFromDataSelectChoice(value);
  };

  const onComboToChangeFirst = (value, firstFromData) => {
    setFromDataSelect(firstFromData.filter((x) => x?.id !== value));
  };

  const mappingToDataTableForEdit = (item, index) => {
    let units = [];
    item.unitConversionUnits?.map((uc) => {
      let unit = {
        id: uc?.unitId,
        name: uc?.unit?.name,
      };
      units.push(unit);
    });
    let materialInventoryBranches = [];
    item.material?.materialInventoryBranches?.map((uc) => {
      let materialInventoryBranch = {
        branchId: uc?.branchId,
        quantity: uc?.quantity,
      };
      materialInventoryBranches.push(materialInventoryBranch);
    });
    units.unshift(item.material.unit);
    return {
      id: item.materialId,
      no: index + 1,
      sku: item?.material?.sku,
      material: item?.material?.name,
      quantity: item?.quantity,
      unitId: item?.unitId,
      unitConversionUnits: units,
      materialInventoryBranches: materialInventoryBranches,
    };
  };

  const getMaterialsUpdate = async (materials, transferMaterialDetails) => {
    setInitDataMaterials(materials);
    const materialsUpdate = materials.filter(
      (x) => transferMaterialDetails.filter((y) => y.materialId === x.id).length === 0,
    );
    setMaterials(materialsUpdate);
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
    return units;
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

    if (fromDataSelectChoice && changeRecord) {
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
      callback(validateMessage);
    }
    callback();
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
    const fromWarehouseType = branches.find((x) => x?.id === values.transferMaterial.fromWarehouseId)?.type;
    const toWarehouseType = branches.find((x) => x?.id === values.transferMaterial.toWarehouseId)?.type;

    if (dataSelectedMaterial.length > 0) {
      const createTransferMaterialRequestModel = {
        ...values.transferMaterial,
        fromWarehouseType,
        toWarehouseType,
        materials: dataSelectedMaterial,
      };

      let req = {
        id: transferMaterialId,
        transferMaterialDto: createTransferMaterialRequestModel,
      };
      const res = await transferMaterialDataService.updateTransferMaterialAsync(req);
      if (res) {
        message.success(pageData.updateTransferMaterialSuccess);
        onCompleted(transferMaterialId);
      }
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
        width: "30%",
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
        width: "15%",
        align: "left",
        render: (_, record, index) => (
          <Form.Item
            name={["transferMaterial", "selectedMaterials", index, "quantity"]}
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
            style={{ display: "contents" }}
          >
            <InputNumber
              onChange={(value) => onChangeRecord(index, "quantity", value)}
              style={{ width: "65%" }}
              defaultValue={record.quantity}
              className="fnb-input quantity-material"
              formatter={(value) => formatterDecimalNumber(value)}
              parser={(value) => parserDecimalNumber(value)}
              onKeyPress={(event) => {
                if (!isDecimalKey(event)) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
        ),
      },
      {
        title: pageData.table.transferUnit,
        dataIndex: "unitId",
        width: "20%",
        align: "left",
        render: (_, record, index) => (
          <Form.Item
            name={["transferMaterial", "selectedMaterials", index, "unit"]}
            rules={[
              {
                required: true,
                message: pageData.table.pleaseEnterNameUnit,
              },
            ]}
            style={{ display: "contents" }}
          >
            <FnbSelectSingle
              showSearch
              placeholder={pageData.table.unitPlaceholder}
              option={record?.unitConversionUnits?.map((item) => ({
                id: item?.id,
                name: item?.name,
              }))}
              style={{ width: "90%" }}
              defaultValue={record?.unitId}
              onChange={(value) => onSelectUnit(value, index)}
            />
          </Form.Item>
        ),
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
                <TrashFill className="icon-svg-hover" onClick={() => onRemoveItemMaterial(record?.id)} />
              </Tooltip>
            </div>
          </Space>
        ),
      },
    ];
    return columns;
  };

  const onSelectMaterial = async (id, pageNumber, pageSize) => {
    let formValue = form.getFieldsValue();
    let { transferMaterial } = formValue;

    const restMaterials = materials.filter((o) => o.id !== id);
    const selectedMaterial = materials.find((o) => o.id === id);

    var units = await getUnitConversionsByMaterialId(id, selectedMaterial);
    var materialInventoryBranches = await getMaterialByFromWareHouseId(id, selectedMaterial);

    const defaultUnitId = units[0]?.id;
    const defaultQuantityConversions = units[0]?.capacity ?? 0;
    setMaxQuantityConversions(defaultQuantityConversions);

    const newRow = mappingToDataTable(selectedMaterial, dataSelectedMaterial.length);
    newRow.unitConversionUnits = units;
    newRow.materialInventoryBranches = materialInventoryBranches;
    newRow.unitId = defaultUnitId;

    setMaterials(restMaterials);
    setDataSelectedMaterial([...dataSelectedMaterial, newRow]);
    transferMaterial.material = null;

    let formSelectedMaterials = transferMaterial.selectedMaterials;
    formSelectedMaterials.push({
      unit: defaultUnitId,
    });
    formSelectedMaterials[formSelectedMaterials?.length - 1].unit = defaultUnitId;

    form.setFieldsValue(formValue);

    let numberRecordCurrent = dataSelectedMaterial.length ?? 0;
    if (numberRecordCurrent > dataSelectedMaterial.length) {
      numberRecordCurrent = dataSelectedMaterial.length + 1;
    }
    setNumberRecordCurrent(numberRecordCurrent);
  };

  const onRemoveItemMaterial = (id) => {
    let restMaterials = dataSelectedMaterial.filter((o) => o.id !== id);
    setDataSelectedMaterial(restMaterials);

    restMaterials.map((product, index) => {
      form.setFieldValue(["transferMaterial", "selectedMaterials", index, "quantity"], product?.quantity);
      form.setFieldValue(["transferMaterial", "selectedMaterials", index, "unit"], product?.unitId);
    });

    let initDataMaterial = initDataMaterials.find((o) => o.id === id);
    materials.push(initDataMaterial);
  };

  const onChangeRecord = (index, column, value) => {
    changeForm();
    let changeRecord = dataSelectedMaterial[index];

    let quantity = column === "quantity" ? value : changeRecord.quantity;
    dataSelectedMaterial.map((item, i) => {
      if (i === index) {
        item.quantity = quantity;
      }
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onSelectUnit = (value, index) => {
    dataSelectedMaterial.map((items, i) => {
      if (i === index) {
        items.unitId = value;
      }
      const quantity = items?.units.find((item) => item.id === value)?.capacity ?? 0;
      setMaxQuantityConversions(quantity);
    });
    setDataSelectedMaterial([...dataSelectedMaterial]);
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const changeForm = (e) => {
    setIsChangeForm(true);
  };

  const onCompleted = (id) => {
    setIsChangeForm(false);
    setTimeout(() => {
      if (!id) return history.push(`/inventory/transfer-material`);
      return history.push(`/inventory/transfer-material/view/${id}`);
    }, DELAYED_TIME);
  };

  const onCancelNotChangeForm = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      return history.push(`/inventory/transfer-material`);
    }, DELAYED_TIME);
  };

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      setShowConfirm(false);
      onCancelNotChangeForm();
    }
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

  return (
    <>
      <Form form={form} name="basic" onFinish={onFinish} autoComplete="off" onFieldsChange={(e) => changeForm(e)}>
        <Row className="fnb-row-page-header">
          <Col span={12} xs={24} sm={24} md={24} lg={12} className="link">
            <p className="card-header">
              <PageTitle content={pageData.updateTransferMaterial} />
            </p>
          </Col>
          <Col span={12} xs={24} sm={24} md={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: <FnbAddNewButton type="primary" text={pageData.btnUpdate} htmlType="submit" />,
                  permission: PermissionKeys.EDIT_TRANSFER_MATERIAL,
                },
                {
                  action: (
                    <Button htmlType="button" onClick={() => onCancel()} className="action-cancel">
                      {pageData.btnCancel}
                    </Button>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>
        <Row>
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
                    option={fromDataSelect?.map((b) => ({
                      id: b.id,
                      name: b.name,
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
              <Col span={24}>
                <h4 className="title-transfer-material">{pageData.materialInformation}</h4>
                <Form.Item className="w-100">
                  <FnbSelectMaterialByWareHouseComponent
                    materialList={materials}
                    t={t}
                    onChangeEvent={onSelectMaterial}
                    fromWareHouseId={fromDataSelectChoice}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FnbTable
                  tableId="material-list"
                  className="mt-4 material-list"
                  columns={columnsMaterial()}
                  pageSize={tableSettings.pageSize}
                  dataSource={dataSelectedMaterial}
                  currentPageNumber={pageNumber}
                  total={dataSelectedMaterial.length}
                />
                {dataSelectedMaterial.length === 0 && (
                  <Text type="danger">{pageData.pleaseSelectMaterialTransfer}</Text>
                )}
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
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
        className={"confirm-leave"}
      />
    </>
  );
}
