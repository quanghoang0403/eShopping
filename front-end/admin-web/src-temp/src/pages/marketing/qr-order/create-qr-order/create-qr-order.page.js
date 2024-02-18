import { Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Typography } from "antd";
import { CancelButton } from "components/cancel-button";
import { FnbAddNewButton } from "components/fnb-add-new-button/fnb-add-new-button";
import FnbCard from "components/fnb-card/fnb-card.component";
import { FnbInput } from "components/fnb-input/fnb-input.component";
import { FnbPageHeader } from "components/fnb-page-header/fnb-page-header";
import { FnbQrCode } from "components/fnb-qr-code/fnb-qr-code.component";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTable } from "components/fnb-table/fnb-table";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { DELAYED_TIME, MaximumNumber } from "constants/default.constants";
import { CalendarNewIconBold, SearchLightIcon, TrashFill } from "constants/icons.constants";
import { OrderTypeConstants } from "constants/order-type-status.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { Platform } from "constants/platform.constants";
import { QRCodeTargetConstants } from "constants/qr-code-target.constants";
import { DateFormat } from "constants/string.constants";
import productDataService from "data-services/product/product-data.service";
import qrCodeDataService from "data-services/qr-code/qr-code-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { convertUtcToLocalTime, getEndDate, getStartDate } from "utils/helpers";
import "./create-qr-order.page.scss";

const { Option } = Select;
const { Text } = Typography;

export default function CreateQrCodePage({ initialData, isClone }) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [formDataChanged, setFormDataChanged] = useState(false);
  const [startDate, setStartDate] = useState(moment(moment(new Date()).format(DateFormat.YYYY_MM_DD)));
  const [createQrCodePrepareData, setCreateQrCodePrepareData] = useState({});
  const [currentAreas, setCurrentAreas] = useState([]);
  const [productDataSource, setProductDataSource] = useState([]);
  const [availableProductsInBranch, setAvailableProductsInBranch] = useState([]);
  const [currentAreaTable, setCurrentAreaTable] = useState([]);
  const [isOnlineServiceType, setIsOnlineServiceType] = useState(false);
  const [currentFormValue, setCurrentFormValue] = useState({
    qrCodeId: null,
    qrCodeUrl: null,
    startDate: startDate,
    qrCodeTarget: QRCodeTargetConstants.SHOP_MENU,
    serviceTypeId: OrderTypeConstants.InStore,
    isPercentage: true, // set default discount type is discount by percentage,
    qrCodeProducts: [],
  });

  const translateData = {
    cloneQrCode: t("createQrCode.cloneQrCode", "Clone QR code"),
    createQrCode: t("createQrCode.createQrCode", "Create QR code"),
    createQrCodeSuccess: t("createQrCode.createQrCodeSuccess", "Create qr code successfully"),
    createQrCodeFailed: t("createQrCode.createQrCodeFailed", "Create qr code failed"),
    noColumnTitle: t("createQrCode.noColumnTitle", "No"),
    productNameColumnTitle: t("createQrCode.productNameColumnTitle", "Product name"),
    quantityColumnTitle: t("createQrCode.quantityColumnTitle", "Quantity"),
    unitNameColumnTitle: t("createQrCode.unitNameColumnTitle", "Unit"),
    actionColumnTitle: t("createQrCode.actionColumnTitle", "Action"),
    searchByName: t("createQrCode.searchByName", "Search by name"),
    addNew: t("createQrCode.addNew", "Add new"),
    generalInformation: t("createQrCode.generalInformation", "General information"),
    name: t("createQrCode.name", "Name"),
    enterCampaignName: t("createQrCode.enterCampaignName", "Enter campaign name"),
    pleaseEnterCampaignName: t("createQrCode.pleaseEnterCampaignName", "Please enter campaign name"),
    branch: t("createQrCode.branch", "Branch"),
    pleaseSelectBranch: t("createQrCode.pleaseSelectBranch", "Please select branch"),
    selectBranch: t("createQrCode.selectBranch", "Select branch"),
    serviceType: t("createQrCode.serviceType", "Service Type"),
    pleaseSelectServiceType: t("createQrCode.pleaseSelectServiceType", "Please select service type"),
    selectServiceType: t("createQrCode.selectServiceType", "Select service type"),
    area: t("createQrCode.area", "Area"),
    pleaseSelectArea: t("createQrCode.pleaseSelectArea", "Please select area"),
    selectArea: t("createQrCode.selectArea", "Select area"),
    table: t("createQrCode.table", "Table"),
    pleaseSelectTable: t("createQrCode.pleaseSelectTable", "Please select table"),
    selectTable: t("createQrCode.selectTable", "Select table"),
    validFrom: t("createQrCode.validFrom", "Valid from"),
    validUntil: t("createQrCode.validUntil", "Valid until"),
    pleaseChooseValidFromDate: t("createQrCode.pleaseChooseValidFromDate", "Please choose valid from date"),
    target: t("createQrCode.target", "Target"),
    pleaseSelectTarget: t("createQrCode.pleaseSelectTarget", "Please select target"),
    selectTarget: t("createQrCode.selectTarget", "Select target"),
    discount: t("createQrCode.discount", "Discount"),
    discountValue: t("createQrCode.discountValue", "Discount Value"),
    enterDiscountValue: t("createQrCode.enterDiscountValue", "Enter discount value"),
    pleaseEnterValidPercent: t("createQrCode.pleaseEnterValidPercent"),
    maxDiscount: t("createQrCode.maxDiscount", "Max Discount"),
    enterMaxDiscount: t("createQrCode.enterMaxDiscount", "Enter max discount"),
    pleaseEnterValidMaxDiscount: t("createQrCode.pleaseEnterValidMaxDiscount"),
    pleaseEnterQuantity: t("createQrCode.pleaseEnterQuantity", "Please enter quantity"),
    enterQuantity: t("createQrCode.enterQuantity", "Enter quantity"),
    pleaseSelectProduct: t("createQrCode.pleaseSelectProduct", "Please select product"),
    noDataFound: t("table.noDataFound"),
    qrCodeNotFoundData: t("marketing.qrCode.qrCodeNotFoundData"),
    qrCodeNotSelectBranch: t("marketing.qrCode.qrCodeNotSelectBranch"),
  };

  useEffect(() => {
    if (isClone === true && !initialData?.qrCodeId) {
      history.goBack();
    } else {
      const fetchData = async () => {
        await getInitDataForCreateQrCode();
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    if (createQrCodePrepareData === null || !createQrCodePrepareData) return;
    if (createQrCodePrepareData.products === null || !createQrCodePrepareData.products) return;
    const fetchData = async () => {
      if (currentFormValue === null) return null;
      const listAvailableProductIDs = await productDataService.getAllProductsAvailableByBranchIdAsync(
        currentFormValue.branchId
      );
      if (listAvailableProductIDs === null || !listAvailableProductIDs) return;

      const filter_all_branch_products = createQrCodePrepareData.products.filter((p) =>
        listAvailableProductIDs.listAvailableProductIDs.includes(p.productId)
      );
      setAvailableProductsInBranch(filter_all_branch_products);

      if (productDataSource === null) return;
      const filter_selected_branch_products = productDataSource.filter((p) =>
        listAvailableProductIDs.listAvailableProductIDs.includes(p.productId)
      );
      setProductDataSource(filter_selected_branch_products);
    };
    fetchData();
  }, [currentFormValue?.branchId]);

  const getInitDataForCreateQrCode = async () => {
    const prepareData = await qrCodeDataService.getCreateQRCodePrepareDataAsync();
    setCreateQrCodePrepareData(prepareData);
    const { qrCodeId, qrCodeUrl } = prepareData;
    let newFormValue = {
      ...currentFormValue,
      qrCodeId: qrCodeId,
      qrCodeUrl: qrCodeUrl,
    };

    if (isClone === true) {
      newFormValue = fillInitialData(newFormValue, prepareData);
    } else {
      setProductDataSource([]);
    }

    updateFormValues(newFormValue);
  };

  const fillInitialData = (qrCodeData, prepareData) => {
    const { startDate, endDate } = initialData;
    const today = moment();
    const oldStartDate = convertUtcToLocalTime(startDate);
    const oldEndDate = convertUtcToLocalTime(endDate);
    const isTodayStartDate = today.isAfter(oldStartDate, "day");
    const isTodayEndDate = today.isAfter(oldEndDate, "day");

    const newFormValue = {
      ...qrCodeData,
      startDate: isTodayStartDate === true ? today : oldStartDate,
      endDate: isTodayEndDate === true ? today : oldEndDate,
      name: initialData?.name?.clone(100),
      qrCodeTarget: initialData?.targetId,
      branchId: initialData?.branchId,
      areaId: initialData?.areaId,
      tableId: initialData?.tableId,
      serviceTypeId: initialData?.serviceTypeId,
      qrCodeProducts: initialData?.products,
      totalProducts: initialData?.products?.length > 0 ? initialData?.products?.length : null,
    };

    const { areas } = prepareData;
    const brachAreas = areas
      ?.filter((area) => area.branchId === initialData?.branchId)
      ?.map((area) => {
        const { id, name } = area;
        return {
          id: id,
          name: name,
        };
      });

    setCurrentAreas(brachAreas);
    const area = areas?.find((a) => a.id === initialData?.areaId);
    setCurrentAreaTable(area?.tables ?? []);
    onChangeServiceType(newFormValue?.serviceTypeId);

    const listProductSelected = initialData?.products?.map((p, index) => {
      return {
        ...p,
        position: index + 1,
      };
    });

    setProductDataSource(listProductSelected ?? []);

    return newFormValue;
  };

  const onClickCreateQrCode = async () => {
    const formValue = await form.validateFields();
    const { startDate, endDate } = formValue;
    let request = {
      ...formValue,
      startDate: getStartDate(startDate),
      endDate: getEndDate(endDate),
    };

    if (isClone) {
      request = {
        ...request,
        clonedByQrCodeId: initialData?.qrCodeId,
      };
    }

    const createQrCodeResponse = await qrCodeDataService.createQrCodeAsync(request);
    if (createQrCodeResponse === true) {
      message.success(translateData.createQrCodeSuccess);
      navigateToQRCodePage();
    } else {
      message.error(translateData.createQrCodeFailed);
    }
  };

  const getBranches = () => {
    const { branches } = createQrCodePrepareData;
    return branches?.map((branch) => {
      const { branchId, branchName } = branch;
      return {
        id: branchId,
        name: branchName,
      };
    });
  };

  const getServiceTypes = () => {
    const { serviceTypes } = createQrCodePrepareData;
    return serviceTypes?.map((serviceType) => {
      const { serviceTypeId, serviceTypeName } = serviceType;
      return {
        id: serviceTypeId,
        name: serviceTypeName,
      };
    });
  };

  const getTargets = () => {
    const { targets } = createQrCodePrepareData;
    const targetOptions = targets?.map((target) => {
      const { targetType, targetName } = target;
      return {
        id: targetType,
        name: t(targetName),
      };
    });

    return targetOptions;
  };

  const updateFormValues = (formValues) => {
    setCurrentFormValue(formValues);
    form.setFieldsValue(formValues);
  };

  const onChangeArea = (areaId) => {
    const formValues = form.getFieldsValue();
    const { areas } = createQrCodePrepareData;
    const area = areas?.find((a) => a.id === areaId);
    if (area) {
      setCurrentAreaTable(area?.tables);
      updateFormValues({
        ...formValues,
        areaId: areaId,
        tableId: null,
      });
    } else {
      updateFormValues({
        ...formValues,
        tableId: null,
      });
      setCurrentAreaTable([]);
    }
  };

  const onChangeBranch = (branchId) => {
    const { areas } = createQrCodePrepareData;
    const brachAreas = areas
      ?.filter((area) => area.branchId === branchId)
      ?.map((area) => {
        const { id, name } = area;
        return {
          id: id,
          name: name,
        };
      });

    setCurrentAreas(brachAreas);
    setCurrentAreaTable([]);

    const formValues = form.getFieldsValue();
    updateFormValues({
      ...formValues,
      areaId: null,
      tableId: null,
    });
  };

  const onChangeQrCodeTarget = (qrCodeTarget) => {
    const formValues = form.getFieldsValue();
    updateFormValues({
      ...formValues,
      qrCodeTarget: qrCodeTarget,
    });
  };

  const onRemoveProduct = (index) => {
    const formValues = form.getFieldsValue();
    productDataSource.splice(index, 1);
    const newProductDataSource = productDataSource?.map((p, index) => {
      return {
        ...p,
        position: productDataSource.length - index,
      };
    });

    const listProductSelected = sortProducts(newProductDataSource);
    setProductDataSource(listProductSelected);
    updateFormValues({
      ...formValues,
      qrCodeProducts: mappingProductSelectedToFormValues(listProductSelected),
      totalProducts: listProductSelected?.length > 0 ? listProductSelected?.length : null,
    });
  };

  const disabledPreviousDateFromNow = (current) => {
    return current && current < moment().startOf("day");
  };

  const disabledPreviousDateFromStartDate = (current) => {
    return current && current < startDate;
  };

  const onSelectProduct = (productId) => {
    if (productId == null) return;
    if (productDataSource != null) {
      const existingProduct = productDataSource.find((p) => p.productId === productId);
      if (existingProduct != null) return;
    }

    const { products } = createQrCodePrepareData;
    const product = products?.find((p) => p.productId === productId);
    if (product) {
      let listProductSelected = [...productDataSource];
      listProductSelected.push({ ...product, productQuantity: 1, position: listProductSelected.length + 1 });

      listProductSelected = sortProducts(listProductSelected);
      setProductDataSource(listProductSelected);

      updateFormValues({
        ...form.getFieldsValue(),
        qrCodeProducts: mappingProductSelectedToFormValues(listProductSelected),
        totalProducts: listProductSelected?.length > 0 ? listProductSelected?.length : null,
      });
    }
  };

  const sortProducts = (products) => {
    const listProductSelected = products.sort(function (productA, productB) {
      return productB.position - productA.position;
    });

    return listProductSelected;
  };

  const mappingProductSelectedToFormValues = (listProductSelected) => {
    return listProductSelected?.map((product) => {
      return {
        productId: product?.productId,
        productQuantity: product?.productQuantity,
      };
    });
  };

  const onChangeServiceType = (serviceType) => {
    setIsOnlineServiceType(serviceType === OrderTypeConstants.Online);
  };

  const onChangeProductQuantity = (quantity, productId) => {
    if (!productDataSource || productDataSource.length == 0) return;
    const newProductDataSource = productDataSource?.map((p) => {
      if (p.productId === productId) {
        return {
          ...p,
          productQuantity: quantity,
        };
      } else {
        return p;
      }
    });

    setProductDataSource(newProductDataSource);
    updateFormValues({
      ...form.getFieldsValue(),
      qrCodeProducts: mappingProductSelectedToFormValues(newProductDataSource),
    });
  };

  const productTableColumns = [
    {
      key: "index",
      title: translateData.noColumnTitle,
      dataIndex: "index",
      align: "center",
      width: "10%",
      render: (index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      key: "productName",
      title: translateData.productNameColumnTitle,
      dataIndex: "productName",
      align: "left",
      render: (productName, product) => {
        const productDetailUrl = `/product/details/${product?.productId}`;
        return (
          <Link target="_blank" to={productDetailUrl}>
            {productName}
          </Link>
        );
      },
    },
    {
      key: "quantity",
      title: translateData.quantityColumnTitle,
      dataIndex: "quantity",
      width: "25%",
      render: (_, record) => {
        const { index, productId } = record;
        return (
          <>
            <Form.Item name={["qrCodeProducts", index, "productId"]} hidden>
              <Input />
            </Form.Item>
            <Form.Item
              className="mr-5"
              name={["qrCodeProducts", index, "productQuantity"]}
              rules={[{ required: true, message: translateData.pleaseEnterQuantity }]}
            >
              <InputNumber
                onChange={(value) => onChangeProductQuantity(value, productId)}
                className="w-100 fnb-input input-quantity"
                placeholder={translateData.enterQuantity}
                min={1}
                max={MaximumNumber}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      key: "unitName",
      title: translateData.unitNameColumnTitle,
      dataIndex: "unitName",
      width: "15%",
    },
    {
      key: "action",
      title: translateData.actionColumnTitle,
      align: "center",
      width: "10%",
      render: (_, record) => {
        const { index } = record;
        return (
          <>
            <div className="pointer" onClick={() => onRemoveProduct(index)}>
              <TrashFill />
            </div>
          </>
        );
      },
    },
  ];

  const getDataTable = (productDataSource) => {
    if (!productDataSource || productDataSource?.length === 0) return [];
    return productDataSource?.map((record, index) => {
      return {
        ...record,
        index: index,
      };
    });
  };

  const renderProductSelectedTable = (createQrCodePrepareData) => {
    if (!createQrCodePrepareData) {
      return <></>;
    }

    const productSelectOptions = (products) => {
      const { serviceTypeId } = currentFormValue;
      let dataProduct = products;
      if (serviceTypeId == OrderTypeConstants.InStore) {
        dataProduct = dataProduct.filter((product) => product.platformIds?.includes(Platform.POS?.toLowerCase()));
      }
      return dataProduct?.map((product) => {
        const { productId, productName, thumbnail } = product;
        return (
          <Option key={productId} value={productId} name={productName}>
            <Row>
              <Col>
                <Thumbnail src={thumbnail} width={50} height={50} />
              </Col>
              <Col className="d-flex ml-3">
                <Text className="m-auto">{productName}</Text>
              </Col>
            </Row>
          </Option>
        );
      });
    };

    return (
      <>
        <Select
          listHeight={300}
          value={null}
          className="search-product"
          getPopupContainer={(trigger) => trigger.parentNode}
          placeholder={translateData.searchByName}
          showSearch
          placement="topLeft"
          suffixIcon={<SearchLightIcon />}
          filterOption={(input, option) => {
            const inputStr = input.removeVietnamese();
            const productName = option?.name?.removeVietnamese();
            return productName?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0;
          }}
          onChange={onSelectProduct}
          notFoundContent={
            <div style={{ "text-align": "center", color: "red" }}>
              {currentAreas.length <= 0 ? translateData.qrCodeNotSelectBranch : translateData.qrCodeNotFoundData}
            </div>
          }
        >
          {productSelectOptions(availableProductsInBranch)}
        </Select>
        <FnbTable
          className="product-table mt-2"
          columns={productTableColumns}
          dataSource={getDataTable(productDataSource)}
          scrollY={500}
        />
        <Form.Item name={"totalProducts"} rules={[{ required: true, message: translateData.pleaseSelectProduct }]}>
          <Input hidden />
        </Form.Item>
      </>
    );
  };

  const renderProductTable = (createQrCodePrepareData, currentFormValue) => {
    switch (currentFormValue?.qrCodeTarget) {
      case QRCodeTargetConstants.ADD_PRODUCT:
        return renderProductSelectedTable(createQrCodePrepareData);

      case QRCodeTargetConstants.SHOP_MENU:
      default:
        return <></>;
    }
  };

  const getPageTitle = () => {
    if (isClone === true) {
      return translateData.cloneQrCode;
    } else {
      return translateData.createQrCode;
    }
  };

  const navigateToQRCodePage = () => {
    setFormDataChanged(false);
    setTimeout(() => {
      return history.push("/marketing/qr-order");
    }, DELAYED_TIME);
  };

  return (
    <>
      <FnbPageHeader
        actionDisabled={formDataChanged ? false : true}
        title={getPageTitle()}
        isNormal={true}
        actionButtons={[
          {
            action: <FnbAddNewButton onClick={onClickCreateQrCode} text={translateData.addNew} />,
            permission: PermissionKeys.CREATE_QR_CODE,
          },
          {
            action: <CancelButton showWarning={formDataChanged} onOk={navigateToQRCodePage} />,
          },
        ]}
      />
      <Form
        className="create-qr-code"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFieldsChange={() => setFormDataChanged(true)}
      >
        <FnbCard title={translateData.generalInformation} className="p-3">
          <Form.Item name="qrCodeId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="qrCodeUrl" hidden>
            <Input />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col sm={24} lg={16} className="w-100">
              <Form.Item
                name="name"
                label={translateData.name}
                rules={[{ required: true, message: translateData.pleaseEnterCampaignName }]}
              >
                <FnbInput autoFocus={true} showCount placeholder={translateData.enterCampaignName} maxLength={100} />
              </Form.Item>
              <Form.Item
                name="branchId"
                label={translateData.branch}
                rules={[{ required: true, message: translateData.pleaseSelectBranch }]}
              >
                <FnbSelectSingle
                  placeholder={translateData.selectBranch}
                  option={getBranches()}
                  onChange={onChangeBranch}
                />
              </Form.Item>
              <Form.Item
                name="serviceTypeId"
                label={translateData.serviceType}
                rules={[{ required: true, message: translateData.pleaseSelectServiceType }]}
              >
                <FnbSelectSingle
                  placeholder={translateData.selectServiceType}
                  option={getServiceTypes()}
                  onChange={onChangeServiceType}
                />
              </Form.Item>

              {isOnlineServiceType === false && (
                <Row gutter={[16, 16]} className="row-mobile-mode">
                  <Col sm={24} lg={12}>
                    <Form.Item
                      name="areaId"
                      label={translateData.area}
                      rules={[{ required: true, message: translateData.pleaseSelectArea }]}
                    >
                      <FnbSelectSingle
                        placeholder={translateData.selectArea}
                        option={currentAreas}
                        onChange={onChangeArea}
                      />
                    </Form.Item>
                  </Col>
                  <Col sm={24} lg={12}>
                    <Form.Item
                      name="tableId"
                      label={translateData.table}
                      rules={[{ required: true, message: translateData.pleaseSelectTable }]}
                    >
                      <FnbSelectSingle placeholder={translateData.selectTable} option={currentAreaTable} />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={[16, 16]} className="row-mobile-mode">
                <Col sm={24} lg={12}>
                  <Form.Item
                    name="startDate"
                    label={translateData.validFrom}
                    rules={[{ required: true, message: translateData.pleaseChooseValidFromDate }]}
                  >
                    <DatePicker
                      suffixIcon={<CalendarNewIconBold />}
                      placeholder="dd/mm/yyyy"
                      className="fnb-date-picker w-100"
                      disabledDate={disabledPreviousDateFromNow}
                      format={DateFormat.DD_MM_YYYY}
                      onChange={(date) => {
                        setStartDate(date);

                        // Clear end date after select start date if endate < startdate only
                        const formValues = form.getFieldsValue();
                        if (formValues.endDate != null && formValues.endDate < date) {
                          updateFormValues({
                            ...formValues,
                            endDate: null,
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} lg={12}>
                  <Form.Item name="endDate" label={translateData.validUntil}>
                    <DatePicker
                      suffixIcon={<CalendarNewIconBold />}
                      placeholder="dd/mm/yyyy"
                      className="fnb-date-picker w-100"
                      disabledDate={disabledPreviousDateFromStartDate}
                      format={DateFormat.DD_MM_YYYY}
                      disabled={startDate ? false : true}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={8} className="pb-3 qr-code-session">
              {currentFormValue && currentFormValue?.qrCodeUrl !== null && (
                <>
                  <FnbQrCode
                    fileName={currentFormValue?.qrCodeId}
                    value={currentFormValue.qrCodeUrl ?? ""}
                    size={172}
                    showDownloadButton
                  />
                </>
              )}
            </Col>
          </Row>
        </FnbCard>
        <FnbCard title={translateData.target} className="p-3 mt-4">
          <Row>
            <Col sm={24} lg={8} className="w-100">
              <Form.Item
                name="qrCodeTarget"
                label={translateData.target}
                rules={[{ required: true, message: translateData.pleaseSelectTarget }]}
              >
                <FnbSelectSingle
                  placeholder={translateData.selectTarget}
                  option={getTargets()}
                  onChange={onChangeQrCodeTarget}
                />
              </Form.Item>
            </Col>
          </Row>
          {renderProductTable(createQrCodePrepareData, currentFormValue)}
        </FnbCard>
      </Form>
    </>
  );
}
