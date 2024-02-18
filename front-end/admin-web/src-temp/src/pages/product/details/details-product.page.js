import { Button, Checkbox, Col, Form, Image, Row, Table, Tabs, Tag, Typography, message } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import productImageDefault from "assets/images/product-img-default.png";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import { FnbModal } from "components/fnb-modal/fnb-modal-component";
import { FnbNotifyDialog } from "components/fnb-notify-dialog/fnb-notify-dialog.component";
import { FnbTable } from "components/fnb-table/fnb-table";
import PageTitle from "components/page-title";
import { PermissionKeys } from "constants/permission-key.constants";
import { ProductStatus } from "constants/product-status.constants";
import productDataService from "data-services/product/product-data.service";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  formatCurrency,
  formatCurrencyWithoutSuffix,
  formatNumber,
  formatNumberDecimalOrInteger,
  getCurrency,
  hasPermission,
} from "utils/helpers";
import productDefaultImage from "../../../assets/images/combo-default-img.jpg";
import "../product-dependencies.scss";
import DeleteProductComponent from "../product-management/components/delete-product.component";
import "./index.scss";
const { TabPane } = Tabs;
const { Text } = Typography;

export default function ProductDetailPage(props) {
  const { t, match } = props;
  const history = useHistory();

  const [product, setProduct] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [activate, setActivate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [titleModal, setTitleModal] = useState();
  const [isVisibaleProductToppingModal, setIsVisibaleProductToppingModal] = useState(false);
  const [isModalNotificationVisible, setIsModalNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationDatasource, setNotificationDatasource] = useState(null);
  const [notificationTable, setNotificationTable] = useState(null);
  const [preventDeleteProduct, setPreventDeleteProduct] = useState({});

  const pageData = {
    btnDelete: t("button.delete"),
    btnEdit: t("button.edit"),
    btnLeave: t("button.leave"),
    action: t("button.action"),
    confirmDelete: t("leaveDialog.confirmDelete"),
    confirmDeleteMessage: t("messages.confirmDeleteMessage"),
    productDeleteSuccess: t("productManagement.productDeleteSuccess"),
    productDeleteFail: t("productManagement.productDeleteFail"),
    generalInformation: {
      title: t("productManagement.generalInformation.title"),
      name: {
        label: t("productManagement.generalInformation.name"),
      },
      description: {
        label: t("productManagement.generalInformation.description"),
      },
    },
    pricing: {
      title: t("productManagement.pricing.title"),
      price: t("productManagement.pricing.price"),
    },
    unit: {
      title: t("productManagement.unit.title"),
      recipe: t("productManagement.unit.recipe"),
    },
    optionInformation: {
      title: t("option.title"),
    },
    inventoryTracking: {
      title: t("inventoryTracking.title"),
      byMaterial: t("inventoryTracking.byMaterial"),
      totalCost: t("table.totalCost"),
      pleaseEnterQuantity: t("inventoryTracking.pleaseEnterQuantity"),
      table: {
        materialName: t("table.materialName"),
        quantity: t("table.quantity"),
        unit: t("table.unit"),
        cost: t("table.cost"),
        totalCost: t("table.totalCost"),
      },
    },
    productCategory: {
      label: t("productManagement.category.title"),
    },
    tax: {
      title: t("productManagement.details.tax"),
    },
    topping: t("productManagement.topping"),
    media: "MEDIA",
    notificationTitle: t("form.notificationTitle"),
    platform: {
      title: t("platform.title"),
    },
    addTopping: t("productManagement.addTopping"),
    toppingSelected: t("productManagement.toppingSelected"),
    table: {
      name: t("productManagement.table.name"),
    },
    selectedTopping: t("productManagement.selectedTopping"),
    productHasActiveCombos: t("messages.productHasActiveCombos"),
    productHasActiveCampaigns: t("messages.productHasActiveCampaigns"),
    buttonIGotIt: t("form.buttonIGotIt"),
    comboName: t("combo.generalInformation.comboName"),
    campaignName: t("promotion.flashSale.name"),
    no: t("table.no"),
    active: t("status.active"),
    inactive: t("status.inactive"),
    productActivatedSuccess: t("productManagement.productActivatedSuccess"),
    productDeactivatedSuccess: t("productManagement.productDeactivatedSuccess"),
  };

  const tableComboSettings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.comboName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link to={`/combo/detail/${record?.id}`} target="_blank" rel="noopener noreferrer" className="combo-name">
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableCombo403Settings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.comboName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link to={`/page-not-permitted`} target="_blank" rel="noopener noreferrer" className="combo-name">
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableDiscountSettings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.campaignName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link
            to={`/store/discount/detail/${record?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="combo-name"
          >
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableDiscount403Settings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.campaignName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link to={`/page-not-permitted`} target="_blank" rel="noopener noreferrer" className="combo-name">
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableDiscountCodeSettings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.campaignName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link
            to={`/store/discountCode/view/${record?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="combo-name"
          >
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableDiscountCode403Settings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.campaignName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link to={`/page-not-permitted`} target="_blank" rel="noopener noreferrer" className="combo-name">
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableFlashSaleSettings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.campaignName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link
            to={`/store/flashSale/view/${record?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="combo-name"
          >
            {record?.name}
          </Link>
        );
      },
    },
  ];

  const tableFlashSale403Settings = [
    {
      title: pageData.no,
      dataIndex: "id",
      key: "id",
      align: "left",
      width: "40%",
      render: (value, record, index) => {
        return index + 1;
      },
    },
    {
      title: pageData.campaignName,
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "60%",
      render: (value, record) => {
        return (
          <Link to={`/page-not-permitted`} target="_blank" rel="noopener noreferrer" className="combo-name">
            {record?.name}
          </Link>
        );
      },
    },
  ];

  useEffect(async () => {
    getInitData();
  }, []);

  const getInitData = async () => {
    let response = await productDataService.getProductDetailByIdAsync(match?.params?.id);
    setProduct(response.product);

    if (response?.product?.statusId === ProductStatus.Activate) {
      setActivate("productManagement.deactivate");
    } else {
      setActivate("productManagement.activate");
    }
  };

  const onChangeStatus = async () => {
    if (product?.statusId === ProductStatus.Activate) {
      const productID = match?.params?.id;
      var relatedObjects = await productDataService.getAllProductDependenciesByIdAsync(productID);
      if (relatedObjects?.isHasDependencies) {
        //Show notification dialog
        setIsModalNotificationVisible(true);
        let message = t(pageData.productHasActiveCombos, { name: product?.name });
        setNotificationMessage(message);

        if (relatedObjects.activeCombos.length > 0) {
          if (hasPermission(PermissionKeys.VIEW_COMBO)) setNotificationTable(tableComboSettings);
          else setNotificationTable(tableCombo403Settings);
          setNotificationDatasource(relatedObjects.activeCombos);
        } else if (relatedObjects.activeDiscounts.length > 0) {
          message = t(pageData.productHasActiveCampaigns, { name: product?.name });
          setNotificationMessage(message);
          if (hasPermission(PermissionKeys.VIEW_PROMOTION)) setNotificationTable(tableDiscountSettings);
          else setNotificationTable(tableDiscount403Settings);
          setNotificationDatasource(relatedObjects.activeDiscounts);
        } else if (relatedObjects.activeFlashSales.length > 0) {
          message = t(pageData.productHasActiveCampaigns, { name: product?.name });
          setNotificationMessage(message);
          if (hasPermission(PermissionKeys.VIEW_FLASH_SALE)) setNotificationTable(tableFlashSaleSettings);
          else setNotificationTable(tableFlashSale403Settings);
          setNotificationDatasource(relatedObjects.activeFlashSales);
        } else if (relatedObjects.activeDiscountCodes.length > 0) {
          message = t(pageData.productHasActiveCampaigns, { name: product?.name });
          setNotificationMessage(message);
          if (hasPermission(PermissionKeys.VIEW_DISCOUNT_CODE)) setNotificationTable(tableDiscountCodeSettings);
          else setNotificationTable(tableDiscountCode403Settings);
          setNotificationDatasource(relatedObjects.activeDiscountCodes);
        }

        return;
      } else setIsModalNotificationVisible(false);
    }

    var res = await productDataService.changeStatusAsync(match?.params?.id);
    if (res) {
      if (product?.statusId === ProductStatus.Deactivate) {
        message.success(pageData.productActivatedSuccess);
      } else {
        message.success(pageData.productDeactivatedSuccess);
      }
      getInitData();
    }
  };

  const getFormSelectedMaterials = () => {
    return (
      <>
        <Row className="mt-3 mb-3">
          {product?.productPrices?.length > 1 && product?.productInventoryData?.length > 0 && (
            <Tabs type="card" className="w-100" onChange={getTotalCost}>
              {product?.productInventoryData?.map((p, index) => {
                return (
                  <TabPane tab={<Text className="material-tabs">{p?.priceName}</Text>} key={index}>
                    <Row className="w-100">
                      <Col span={24}>
                        <FnbTable dataSource={p.listProductPriceMaterial} columns={columnsMaterial(index)} />
                      </Col>
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          )}
          {product?.productPrices?.length === 1 && product?.productInventoryData?.length > 0 && (
            <>
              <Row className="w-100 mt-2">
                <Col span={24}>
                  <FnbTable
                    dataSource={product?.productInventoryData[0]?.listProductPriceMaterial}
                    columns={columnsMaterial(0)}
                  />
                </Col>
              </Row>
            </>
          )}
        </Row>
        {product?.productPrices?.length > 0 && product?.productInventoryData?.length > 0 && (
          <Row className="float-right">
            <Text className="total-material-price text-total">{pageData.inventoryTracking.totalCost}: </Text>
            <Text col className="total-material-price text-cost">
              {totalCost
                ? formatNumberDecimalOrInteger(totalCost)
                : formatNumberDecimalOrInteger(product?.productInventoryData[0]?.totalCost)}
            </Text>
            <Text className="total-material-price text-unit-name">/ {product?.unit.name}</Text>
          </Row>
        )}
      </>
    );
  };

  const getTotalCost = (index) => {
    let sum = 0;
    product.productInventoryData[index]?.listProductPriceMaterial?.map((material) => {
      sum = sum + material.quantity * material.unitCost;
    });
    setTotalCost(sum);
  };

  const columnsMaterial = (indexPriceName) => {
    let columns = [
      {
        title: pageData.inventoryTracking.table.materialName,
        dataIndex: "material",
        width: "26%",
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "materialId"]}>
            <p>{record.material}</p>
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.quantity,
        dataIndex: "quantity",
        width: "15%",
        align: "right",
        editable: true,
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "quantity"]}>
            <p>{formatCurrencyWithoutSuffix(record.quantity)}</p>
          </Form.Item>
        ),
      },
      {
        title: pageData.inventoryTracking.table.unit,
        dataIndex: "unit",
        width: "10%",
        align: "right",
        render: (value, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "unit"]}>
            <p>{value}</p>
          </Form.Item>
        ),
      },
      {
        title: `${pageData.inventoryTracking.table.cost} (${getCurrency()})`,
        dataIndex: "unitCost",
        align: "right",
        width: "20%",
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "unitCost"]}>
            <p>{formatNumberDecimalOrInteger(record.unitCost)}</p>
          </Form.Item>
        ),
      },
      {
        title: `${pageData.inventoryTracking.table.totalCost} (${getCurrency()})`,
        dataIndex: "cost",
        align: "right",
        width: "25%",
        render: (_, record, index) => (
          <Form.Item name={["product", "materials", "priceName", indexPriceName, "material", index, "cost"]}>
            <p>{formatNumberDecimalOrInteger(record.cost)}</p>
          </Form.Item>
        ),
      },
    ];
    return columns;
  };

  const renderOptions = () => {
    return (
      <Row className="mt-3" gutter={[0, 16]}>
        {product?.options?.map((option, index) => {
          option?.optionLevel.sort((elementA, elementB) => elementB.isSetDefault - elementA.isSetDefault);
          return (
            <>
              <Col span={20}>
                <Paragraph className="option-name" placement="top" ellipsis={{ tooltip: option.name }} key={option.id}>
                  <Text strong className="option-name-text">
                    {option.name}
                  </Text>
                </Paragraph>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <div id={"container-options-" + index} className="w-100 container-options">
                      {option?.optionLevel.map((item) => {
                        return (
                          <>
                            <Tag
                              key={item.id}
                              className={
                                item.isSetDefault === true
                                  ? `option-default option--border`
                                  : `option-value option--border`
                              }
                            >
                              <Paragraph id={item.id} ellipsis={{ tooltip: item.name }}>
                                <span>{item.name}</span>
                              </Paragraph>
                            </Tag>
                          </>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </Col>
            </>
          );
        })}
      </Row>
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.confirmDeleteMessage, { name: name });
    return mess;
  };

  const onDeleteItem = () => {
    const { id } = product;
    productDataService.getAllOrderNotCompletedByProductIdAsync(id).then((res) => {
      const { preventDeleteProduct } = res;

      setPreventDeleteProduct(preventDeleteProduct);
      if (!preventDeleteProduct?.isPreventDelete) {
        setTitleModal(pageData.confirmDelete);
      } else {
        setTitleModal(pageData.notificationTitle);
      }
      setIsModalVisible(true);
    });
  };
  const handleDeleteItem = async (productId) => {
    var res = await productDataService.deleteProductByIdAsync(productId);
    if (res) {
      message.success(pageData.productDeleteSuccess);
    } else {
      message.error(pageData.productDeleteFail);
    }
    setIsModalVisible(false);
    window.location.href = "/product-management";
  };

  const onEditItem = () => {
    productDataService.getAllOrderNotCompletedByProductIdAsync(product?.id).then((res) => {
      const { preventDeleteProduct } = res;

      setPreventDeleteProduct(preventDeleteProduct);
      if (!preventDeleteProduct?.isPreventDelete) {
        return history.push(`/product/edit/${product?.id}`);
      } else {
        setTitleModal(pageData.notificationTitle);
      }
      setIsModalVisible(true);
    });
  };

  const productToppingSelectedColumnTable = () => {
    const column = [
      {
        title: pageData.table.name,
        dataIndex: "thumbnail",
        render: (_, record) => {
          return <Image preview={false} src={record.thumbnail ?? "error"} fallback={productDefaultImage} />;
        },
      },
      {
        title: " ",
        width: "80%",
        dataIndex: "name",
        align: "left",
      },
    ];

    return column;
  };

  const renderModalContent = () => {
    return (
      <Form>
        <div className="modal-product-topping">
          <Row className="modal-product-topping-table-detail">
            <Col span={24}>
              <FnbTable
                className="selected-product-topping-modal"
                dataSource={product?.productToppings}
                columns={productToppingSelectedColumnTable()}
              />
            </Col>
          </Row>
        </div>
      </Form>
    );
  };

  const handleCancelToppingModal = () => {
    setIsVisibaleProductToppingModal(false);
  };

  const items = [
    {
      label: (
        <a
          className={activate === "productManagement.activate" ? "action-activate" : "action-deactivate"}
          onClick={() => onChangeStatus()}
        >
          {t(activate)}
        </a>
      ),
      permission: PermissionKeys.ACTIVATE_PRODUCT,
      key: "0",
    },
    {
      label: (
        <a
          className="action-delete"
          onClick={() => {
            onDeleteItem();
          }}
        >
          {pageData.btnDelete}
        </a>
      ),
      key: "1",
      permission: null,
    },
  ];

  return (
    <>
      <Form layout="vertical" autoComplete="off" className="product-detail-form">
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <p className="card-header">
                <PageTitle content={product?.name} />
              </p>
              {product.statusId === ProductStatus.Activate && (
                <span class="badge-status active ml-3">
                  <span> {pageData.active}</span>
                </span>
              )}
              {product.statusId === ProductStatus.Deactivate && (
                <span class="badge-status default ml-3">
                  <span> {pageData.inactive}</span>
                </span>
              )}
            </Row>
          </Col>
          <Col xs={24} sm={24} lg={12} className="fnb-form-item-btn">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button type="primary" onClick={() => onEditItem()} className="button-edit">
                      {pageData.btnEdit}
                    </Button>
                  ),
                  permission: PermissionKeys.EDIT_PRODUCT,
                },
                {
                  action: (
                    <a onClick={() => history.push(`/product-management`)} className="action-cancel">
                      {pageData.btnLeave}
                    </a>
                  ),
                  permission: null,
                },
                {
                  action: (
                    <a
                      className={activate === "productManagement.activate" ? "action-activate" : "action-deactivate"}
                      onClick={() => onChangeStatus()}
                    >
                      {t(activate)}
                    </a>
                  ),
                  permission: PermissionKeys.ACTIVATE_PRODUCT,
                },
                {
                  action: (
                    <a
                      className="action-delete"
                      onClick={() => {
                        onDeleteItem();
                      }}
                    >
                      {pageData.btnDelete}
                    </a>
                  ),
                  permission: PermissionKeys.DELETE_PRODUCT,
                },
              ]}
            />
          </Col>
        </Row>
        <Row className="product-container">
          <div className="product-form-left">
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.generalInformation.title}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.generalInformation.name.label}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{product?.name}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.generalInformation.description.label}</Text>
              </div>
              <div className="div-text">
                <Text className="text-name">{product?.description}</Text>
              </div>
              {product?.productToppings?.length > 0 && (
                <div className="div-text-product-topping">
                  <Row onClick={() => setIsVisibaleProductToppingModal(!isVisibaleProductToppingModal)}>
                    <span className="topping-selected-count">{product?.productToppings.length}</span>
                    <span className="topping-selected-text">{pageData.toppingSelected}</span>
                  </Row>
                </div>
              )}
            </div>
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.pricing.title}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.pricing.price}</Text>
              </div>
              <div className="product-detail-div">
                {product?.productPrices?.length > 1 && (
                  <div className="list-price" style={{ marginLeft: "18px" }}>
                    {product?.productPrices?.map((item, index) => {
                      const position = (item?.position || 0) + 1;
                      return (
                        <Row key={index} className="price-item mb-4">
                          <Col span={24} className="col-title">
                            <div className="m-4 title-center position-text position-mobile">{position + "."}</div>
                            <Row className="w-100">
                              <Col span={24}>
                                <Row className="box-product-price">
                                  <Col xs={24} sm={24} md={24} lg={14}>
                                    <Text className="text-name pr-4" style={{ marginLeft: "30px" }}>
                                      <li className="pr-5">{item?.priceName} </li>
                                    </Text>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={10}>
                                    <Row>
                                      <Col xs={12} sm={24} md={24} lg={8}>
                                        <Text className="text-name text-bold" style={{ marginLeft: "30px" }}>
                                          <li className="text-bold">{formatNumber(item?.priceValue)} </li>
                                        </Text>
                                      </Col>
                                      <Col xs={12} sm={24} md={24} lg={6}>
                                        <Text className="text-name" style={{ color: "#9F9F9F" }}>
                                          <li>{getCurrency()} </li>
                                        </Text>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                )}
                {product?.productPrices?.length === 1 && (
                  <Text className="text-name">{formatCurrency(product?.productPrices[0]?.priceValue)}</Text>
                )}
              </div>
              <Row className="product-detail-tax-unit">
                <Col xs={12} sm={24} md={24} lg={12}>
                  <div className="product-detail-div">
                    <Text className="text-item">{pageData.tax.title}</Text>
                  </div>
                  <div className="div-text">
                    <Text className="text-name">
                      {product?.tax?.name && `${product?.tax?.name} (${product?.tax?.percentage} %)`}
                    </Text>
                  </div>
                </Col>
                <Col xs={12} sm={24} md={24} lg={12}>
                  <div className="product-detail-div">
                    <Text className="text-item">{pageData.unit.title}</Text>
                  </div>
                  <div className="div-text">
                    <Text className="text-name">{product?.unit?.name}</Text>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.unit.recipe}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{pageData.inventoryTracking.byMaterial}</Text>
              </div>
              <div className="dev-form-material">{getFormSelectedMaterials()}</div>
            </div>
          </div>
          <div className="product-form-right">
            <div className="form-image padding-t-l-b">
              <Text className="text-title media">{pageData.media}</Text>
              <div className="content-img">
                <Image width={176} src={product?.thumbnail ?? "error"} fallback={productImageDefault} />
              </div>
            </div>
            {!product?.isTopping && (
              <>
                <div className="form-category padding-t-l-b">
                  <div className="div-title">
                    <Text className="text-title">{pageData.productCategory.label}</Text>
                  </div>
                  <Text className="text-name">{product?.productCategoryName}</Text>
                </div>
                <div className="form-option padding-t-l-b">
                  <Text className="text-title">{pageData.optionInformation.title}</Text>
                  {renderOptions()}
                </div>
              </>
            )}
            <div className="form-option padding-t-l-b">
              <Text className="text-title">{pageData.platform.title}</Text>
              <div className="platform-group">
                <Checkbox.Group value={product?.listPlatformIds} disabled>
                  {product?.platforms?.map((p, index) => {
                    return (
                      <div key={index} className="platform-item">
                        <Checkbox value={p.id}>{p.name}</Checkbox>
                      </div>
                    );
                  })}
                </Checkbox.Group>
              </div>
            </div>
          </div>
        </Row>
      </Form>
      <FnbModal
        width={"800px"}
        title={pageData.selectedTopping}
        visible={isVisibaleProductToppingModal}
        handleCancel={handleCancelToppingModal}
        footer={null}
        content={renderModalContent()}
      ></FnbModal>
      <DeleteProductComponent
        isModalVisible={isModalVisible}
        preventDeleteProduct={preventDeleteProduct}
        titleModal={titleModal}
        handleCancel={() => handleCancel()}
        onDelete={handleDeleteItem}
      />
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
        className={"fnb-notify-dialog-product-dependencies"}
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
                className="table-product-dependencies"
                columns={notificationTable}
                dataSource={notificationDatasource}
                pagination={false}
              />
            </>
          );
        }}
      />
    </>
  );
}
