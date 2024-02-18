import { PercentageOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Form, Modal, Row, Tooltip, Typography, message } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import widgetOrange from "assets/images/widget-orange.png";
import widgetPurple from "assets/images/widget-purple.png";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import FnbParagraph from "components/fnb-paragraph/fnb-paragraph";
import { FnbTable } from "components/fnb-table/fnb-table";
import OverviewWidget from "components/overview-widget/overview-widget.component";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { DELAYED_TIME, tableSettings } from "constants/default.constants";
import {
  FlashSalePercentIcon,
  InfoCircleFlashSaleIcon,
  SummaryWidgetOrangeIcon,
  SummaryWidgetPurpleIcon,
} from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { PromotionStatus } from "constants/promotion.constants";
import { DateFormat } from "constants/string.constants";
import flashSaleDataService from "data-services/flash-sale/flash-sale-data.service";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import {
  convertUtcToLocalTime,
  formatCurrency,
  formatNumber,
  formatTextNumber,
  getCurrency,
  roundNumber,
} from "utils/helpers";
import { FlashSaleUsageDetailComponent } from "./flash-sale-usage-detail.component";
import './view-flashsale.style.scss';
const { Text } = Typography;

export default function ViewFlashSaleComponent(props) {
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [t] = useTranslation();
  const history = useHistory();
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableAllBranches, setDisableAllBranches] = useState(false);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [dataSelectedProduct, setDataSelectedProduct] = useState([]);
  const [flashSaleData, setFlashSaleData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [showConfirmStop, setShowConfirmStop] = useState(false);
  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const [totalDiscountOrder, setTotalDiscountOrder] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [showModalUsageDetail, setShowModalUsageDetail] = useState(false);
  const flashSaleUsageDetailRef = useRef();

  const pageData = {
    leaveForm: t("messages.leaveForm"),
    create: t("promotion.create"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    okText: t("button.ok"),
    createPromotionSuccess: t("promotion.createPromotionSuccess"),
    selectDate: t("promotion.selectDate"),
    allBranch: t("productCategory.branch.all"),
    branch: t("material.inventory.branch"),
    deleteFlashSaleSuccess: t("promotion.flashSale.deleteFlashSaleSuccess"),
    deleteFlashSaleFail: t("promotion.flashSale.deleteFlashSaleFail"),
    stopFlashSaleSuccess: t("promotion.flashSale.stopFlashSaleSuccess"),
    stopFlashSaleFail: t("promotion.flashSale.stopFlashSaleFail"),
    stop: t("button.stop"),
    confirmStop: t("leaveDialog.confirmStop"),
    confirmStopFlashSale: t("promotion.flashSale.confirmStopFlashSale"),
    button: {
      btnDelete: t("button.delete"),
      btnIgnore: t("button.ignore"),
      btnStop: t("button.stop"),
    },
    form: {
      general: t("promotion.form.general"),
      name: t("promotion.flashSale.name"),
      PlaceholderName: t("promotion.form.PlaceholderName"),
      maxLengthName: 100,
      pleaseEnterPromotionName: t("promotion.form.pleaseEnterPromotionName"),
      promotionType: t("promotion.form.promotionType"),
      selectPromotionType: t("promotion.form.selectPromotionType"),
      pleaseSelectPromotionType: t("promotion.form.pleaseSelectPromotionType"),
      product: t("promotion.form.product"),
      selectProduct: t("promotion.form.selectProduct"),
      pleaseSelectProduct: t("promotion.form.pleaseSelectProduct"),
      productCategory: t("promotion.form.productCategory"),
      selectProductCategory: t("promotion.form.selectProductCategory"),
      pleaseSelectProductCategory: t("promotion.form.pleaseSelectProductCategory"),
      percent: "%",
      discountValue: t("promotion.form.discountValue"),
      pleaseEnterPrecent: t("promotion.form.pleaseEnterPrecent"),
      maxDiscount: t("promotion.form.maxDiscount"),
      pleaseEnterMaxDiscount: t("promotion.form.pleaseEnterMaxDiscount"),
      startDate: t("promotion.form.startDate"),
      PleaseStartDate: t("promotion.form.pleaseStartDate"),
      endDate: t("promotion.form.endDate"),
      PlaceholderDateTime: t("promotion.form.placeholderDateTime"),
      termsAndConditions: t("promotion.form.termsAndConditions"),
      maxLengthTermsAndConditions: 2000,
      maximum: 999999999,
      condition: {
        title: t("promotion.form.condition.title"),
        checkboxPurchaseAmount: t("promotion.form.condition.checkboxPurchaseAmount"),
        pleaseEnterMinimum: t("promotion.form.condition.pleaseEnterMinimum"),
        checkboxSpecificBranches: t("promotion.form.condition.checkboxSpecificBranches"),
        pleaseSelectSpecificBranches: t("promotion.flashSale.pleaseSelectSpecificBranches"),
        selectBranchPlaceholder: t("promotion.form.condition.selectBranchPlaceholder"),
        specificBranchesTooltip: t("promotion.form.condition.specificBranchesTooltip"),
        includedTopping: t("promotion.form.condition.includedTopping"),
        minimumPurchaseAmountTooltip: t("promotion.flashSale.minimumPurchaseAmountTooltip"),
      },
      startTime: t("promotion.flashSale.startTime"),
      endTime: t("promotion.flashSale.endTime"),
      no: t("promotion.table.no"),
      nameColumn: t("promotion.table.name"),
      price: t("combo.price.title"),
      flashSalePrice: t("promotion.flashSale.flashSalePrice"),
      flashSaleQuantity: t("promotion.flashSale.flashSaleQuantity"),
      maximumLimit: t("promotion.flashSale.maximumLimit"),
      viewTitle: t("promotion.flashSale.viewTitle"),
      enterCampaignName: t("promotion.flashSale.enterCampaignName"),
      nameValidateMessage: t("promotion.flashSale.nameValidateMessage"),
      enterTermsAndCondition: t("promotion.flashSale.enterTermsAndCondition"),
      pleaseSelectStartDate: t("promotion.flashSale.pleaseSelectStartDate"),
      pleaseSelectStartTime: t("promotion.flashSale.pleaseSelectStartTime"),
      pleaseStartEndTime: t("promotion.flashSale.pleaseStartEndTime"),
      pleaseInputPrice: t("promotion.flashSale.pleaseInputPrice"),
      pleaseInputQuantity: t("promotion.flashSale.pleaseInputQuantity"),
      maximumLimitValidate: t("promotion.flashSale.maximumLimitValidate"),
      tooltipFlashSaleQuantity: t("promotion.flashSale.tooltipFlashSaleQuantity"),
      tooltipMaximumLimit: t("promotion.flashSale.tooltipMaximumLimit"),
      productValidate: t("promotion.flashSale.productValidate"),
      flashSaleQuantityValidate: t("promotion.flashSale.flashSaleQuantityValidate"),
      flashSalePriceValidate: t("promotion.flashSale.flashSalePriceValidate"),
      editFlashSaleSuccess: t("promotion.flashSale.editFlashSaleSuccess"),
      deleteFlashSaleMessage: t("promotion.flashSale.deleteFlashSaleMessage"),
    },
    confirmDelete: t("leaveDialog.confirmDelete"),
    btnIgnore: t("button.ignore"),
    btnEdit: t("button.edit"),
    btnLeave: t("button.leave"),
    btnDelete: t("button.delete"),
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    guideline: {
      title: t("promotion.flashSale.guideline.title"),
      content: t("promotion.flashSale.guideline.content"),
    },
    product: {
      title: t("combo.product.title"),
      comboType: t("combo.comboType"),
      productPlaceholder: t("productManagement.table.searchPlaceholder"),
      productValidateMessage: t("combo.product.productValidateMessage"),
      tooltipMessage: t("combo.product.tooltipMessage"),
      categoryValidateMessage: t("combo.product.categoryValidateMessage"),
      categoryPlaceholder: t("combo.product.categoryPlaceholder"),
      groups: t("combo.product.groups"),
      group: t("combo.product.group"),
      category: t("combo.product.category"),
      itemQuantity: t("combo.product.itemQuantity"),
      itemQuantityPlaceholder: t("combo.product.itemQuantityPlaceholder"),
      itemQuantityValidateMessage: t("combo.product.itemQuantityValidateMessage"),
      addGroup: t("combo.product.addGroup"),
    },
    inventoryTracking: {
      pleaseEnterQuantity: t("inventoryTracking.pleaseEnterQuantity"),
      quantityMoreThanZero: t("inventoryTracking.quantityGreaterThanZero"),
    },
    summary: {
      title: t("promotion.summary.title"),
      viewDetail: t("promotion.summary.viewDetail"),
      totalDiscountOrder: t("promotion.summary.totalDiscountOrder"),
      totalDiscountAmount: t("promotion.summary.totalDiscountAmount"),
    },
  };
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (props?.match?.params?.id) {
      getInitialData(props?.match?.params?.id);
    }
  }, []);

  const getInitialData = async (id) => {
    var flashSaleData = await flashSaleDataService.getFlashSaleByIdForDetailPageAsync(id);
    if (flashSaleData) {
      setTotalDiscountAmount(flashSaleData?.totalDiscountAmount);
      setTotalDiscountOrder(flashSaleData?.totalDiscountOrder);
      let data = flashSaleData?.flashSale;
      const { branches, products } = flashSaleData;
      const productDataOptions = getProductDataOptions(products);
      let startDateToLocal = convertUtcToLocalTime(data?.startDate);

      let flashSale = {
        id: data?.id,
        name: data?.name,
        isMinimumPurchaseAmount: data?.isMinimumPurchaseAmount,
        isIncludedTopping: data?.isIncludedTopping,
        isPercentDiscount: data?.isPercentDiscount,
        isSpecificBranch: data?.isSpecificBranch,
        maximumDiscountAmount: data?.maximumDiscountAmount > 0 ? data?.maximumDiscountAmount : null,
        minimumPurchaseAmount: data?.minimumPurchaseAmount,
        startDate: startDateToLocal,
        startTime: startDateToLocal,
        endTime: convertUtcToLocalTime(data?.endDate),
        termsAndCondition: data?.termsAndCondition,
        products: [],
        statusId: data?.statusId,
      };
      setFlashSaleData(flashSale);
      if (data?.isSpecificBranch === true) {
        let branchSelect = branches.filter((branch) => data?.branchIds.find((branchId) => branchId === branch.id));
        setBranches(branchSelect);
      }

      const isAppliedForAllBranches = data?.branchIds.length === branches.length;
      setDisableAllBranches(isAppliedForAllBranches);

      const listOptionsByListSelectedName = productDataOptions.filter((b) =>
        data?.products?.find((v) => v.productPriceId === b.productPriceId)
      );
      let listProducts = [];
      listOptionsByListSelectedName?.map((optionsByListSelectedName) => {
        var product = data?.products?.find((v) => v.productPriceId === optionsByListSelectedName?.productPriceId);
        const newRow = {
          id: optionsByListSelectedName?.productPriceId,
          name: optionsByListSelectedName?.productName,
          price: optionsByListSelectedName?.productPrice,
          priceFormat: formatNumber(optionsByListSelectedName?.productPrice),
          isSinglePrice: optionsByListSelectedName?.isSinglePrice,
          productPriceName: optionsByListSelectedName?.productPriceName,
          thumbnail: optionsByListSelectedName?.thumbnail,
          flashSalePrice: product?.flashSalePrice,
          flashSaleQuantity: formatNumber(product?.flashSaleQuantity),
          maximumLimit: formatNumber(product?.maximumLimit),
          flashSalePriceFormat: formatNumber(product?.flashSalePrice),
        };
        listProducts.push(newRow);
      });
      setDataSelectedProduct(listProducts);
    }
  };

  const getProductDataOptions = (products) => {
    let productOptions = [];
    products?.map((product) => {
      if (product?.productPrices?.length > 0) {
        product?.productPrices.map((price) => {
          const text = price?.priceName ? `${product?.name} (${price?.priceName})` : product?.name;
          const option = {
            key: price?.id,
            productId: product?.id,
            productName: product?.name,
            text: text,
            productPriceId: price?.id,
            productPriceName: price?.priceName,
            productPrice: price?.priceValue,
            isSinglePrice: product?.productPrices?.length <= 1,
            thumbnail: product?.thumbnail,
            unitName: product?.unit?.name,
          };

          productOptions.push(option);
        });
      }
    });
    return productOptions;
  };

  const columnsProduct = (indexPriceName) => {
    let columns = [
      {
        title: pageData.form.no,
        align: "left",
        width: "5%",
        render: (_, record, index) => (
          <Row className="mb-4">
            <Col span={24}>{index + 1}</Col>
          </Row>
        ),
      },
      {
        title: pageData.form.nameColumn,
        dataIndex: "name",
        align: "left",
        width: "20%",
        render: (_, record, index) => (
          <Row className="mb-4">
            <div className="table-selling-product-thumbnail flash-sale-product-thumbnail">
              <Thumbnail src={record?.thumbnail} />
            </div>
            <div className="table-selling-product-no table-selling-product-no-flashSale">
              <Row>
                <Col span={24} className="table-selling-product-text-product-name">
                  <FnbParagraph>{record?.name}</FnbParagraph>
                </Col>
              </Row>
              <Row style={record?.productPriceName && { marginTop: "4px" }}>
                <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                  {record?.productPriceName}
                </Col>
              </Row>
            </div>
          </Row>
        ),
      },
      {
        title: `${pageData.form.price} (${getCurrency()})`,
        dataIndex: "priceFormat",
        align: "left",
        width: "10%",
        render: (_, record) => <div className="mb-4">{record?.priceFormat}</div>,
      },
      {
        title: `${pageData.form.flashSalePrice} (${getCurrency()})`,
        dataIndex: "flashSalePrice",
        width: "20%",
        align: "left",
        editable: true,
        className: "inventory-tracking-material-item",
        render: (_, record, index) => {
          return (
            <>
              <Form.Item className="form-item-quantity mt-2 mb-2">{record?.flashSalePriceFormat}</Form.Item>
              <div className="float-left color-primary discount-products-wrapper">
                <Row>
                  <Col className="discount-icon-col">
                    <FlashSalePercentIcon />
                  </Col>
                  <Col className="discount-percent-col">
                    <span className="ml-2">
                      {record?.price === 0
                        ? 0
                        : roundNumber(((record?.price - record?.flashSalePrice) / record?.price) * 100, 1)}
                    </span>
                    <PercentageOutlined />
                  </Col>
                </Row>
              </div>
            </>
          );
        },
      },
      {
        title: (
          <>
            {pageData.form.flashSaleQuantity}
            <Tooltip placement="topLeft" title={pageData.form.tooltipFlashSaleQuantity}>
              <InfoCircleFlashSaleIcon className="flash-sale-product-tooltip-icon" size={24} />
            </Tooltip>
          </>
        ),
        dataIndex: "flashSaleQuantity",
        width: "20%",
        align: "left",
        editable: true,
        render: (_, record) => <div className="mb-4">{record?.flashSaleQuantity}</div>,
      },
      {
        title: (
          <>
            {pageData.form.maximumLimit}
            <Tooltip placement="topLeft" title={pageData.form.tooltipMaximumLimit}>
              <InfoCircleFlashSaleIcon className="flash-sale-product-tooltip-icon" size={24} />
            </Tooltip>
          </>
        ),
        dataIndex: "maximumLimit",
        width: "20%",
        align: "left",
        editable: true,
        render: (_, record) => <div className="mb-4">{record?.maximumLimit}</div>,
      },
    ];
    return columns;
  };

  const getFormSelectedMaterials = () => {
    return (
      <>
        <Row className="w-100">
          <Col span={24}>
            <FnbTable
              dataSource={dataSelectedProduct}
              columns={columnsProduct(0)}
              pageSize={tableSettings.pageSize}
              pageNumber={pageNumber}
              total={dataSelectedProduct.length}
              showPaging={false}
              scrollY={96 * 5}
              className="table-material-product"
            />
          </Col>
        </Row>
      </>
    );
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const clickCancel = () => {
    setIsModalVisible(false);
  };

  const onCancel = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/store/promotion/flashSale");
    }, DELAYED_TIME);
  };

  const handleOpenDeletePopup = () => {
    setIsModalVisible(true);
    setIsShowPopover(false);
  };

  const renderModalDelete = () => {
    return (
      <Modal
        className="delete-confirm-modal"
        title={pageData.confirmDelete}
        visible={isModalVisible}
        okText={pageData.btnDelete}
        okType="danger"
        onOk={handleOk}
        onCancel={clickCancel}
      >
        {formatDeleteMessage(flashSaleData?.name)}
      </Modal>
    );
  };

  // Insert the name into the message
  const formatDeleteMessage = (name) => {
    let mess = t(pageData.form.deleteFlashSaleMessage, { name: name });

    return <span dangerouslySetInnerHTML={{ __html: mess }}></span>;
  };

  const handleOk = () => {
    setIsModalVisible(false);
    handleDeleteItem(props?.match?.params?.id);
  };

  const handleDeleteItem = async (id) => {
    await flashSaleDataService.deleteFlashSaleByIdAsync(id).then((res) => {
      if (res) {
        history.push("/store/promotion/flashSale");
        message.success(pageData.deleteFlashSaleSuccess);
      } else {
        message.error(pageData.deleteFlashSaleFail);
      }
    });
  };

  const renderModalStop = () => {
    return (
      <DeleteConfirmComponent
        title={pageData.confirmStop}
        content={t(pageData.confirmStopFlashSale, { name: flashSaleData?.name })}
        okText={pageData.button.btnStop}
        cancelText={pageData.button.btnIgnore}
        onOk={() => onStopFlashSale(props?.match?.params?.id)}
        tooltipTitle={pageData.stop}
        skipPermission={true}
        visible={showConfirmStop}
        onCancel={() => setShowConfirmStop(false)}
      />
    );
  };

  const onStopFlashSale = async (id) => {
    await flashSaleDataService.stopFlashSaleByIdAsync(id).then((res) => {
      if (res) {
        history.push("/store/promotion/flashSale");
        message.success(pageData.stopFlashSaleSuccess);
      } else {
        message.error(pageData.stopFlashSaleFail);
      }
    });
  };

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <div className="view-flash-sale-title">
            <Paragraph
              style={{ maxWidth: "inherit", fontSize: "32px" }}
              placement="top"
              ellipsis={{ tooltip: flashSaleData?.name }}
              color="#2B2162"
              className="flashSaleName"
            >
              {flashSaleData?.name}
            </Paragraph>
          </div>
          <div className="view-flash-sale-title-icon">
            <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
          </div>
        </Col>
        <Col xs={24} sm={24} lg={12}>
          <ActionButtonGroup
            arrayButton={
              flashSaleData?.statusId === PromotionStatus.Schedule
                ? [
                    {
                      action: (
                        <Button
                          onClick={() => history.push(`/store/flashSale/edit/${props?.match?.params?.id}`)}
                          className="material-view-button-edit"
                        >
                          {pageData.btnEdit}
                        </Button>
                      ),
                      permission: PermissionKeys.EDIT_FLASH_SALE,
                    },
                    {
                      action: (
                        <a onClick={() => history.push("/store/promotion/flashSale")} className="action-cancel">
                          {pageData.btnLeave}
                        </a>
                      ),
                      permission: null,
                    },
                    {
                      action: (
                        <a onClick={() => handleOpenDeletePopup()} className="action-delete">
                          {pageData.btnDelete}
                        </a>
                      ),
                      permission: PermissionKeys.DELETE_FLASH_SALE,
                    },
                  ]
                : flashSaleData?.statusId === PromotionStatus.Active
                ? [
                    {
                      action: (
                        <Button onClick={() => setShowConfirmStop(true)} className="material-view-button-edit">
                          {pageData.button.btnStop}
                        </Button>
                      ),
                      permission: PermissionKeys.STOP_FLASH_SALE,
                    },
                    {
                      action: (
                        <a onClick={() => history.push("/store/promotion/flashSale")} className="action-cancel">
                          {pageData.btnLeave}
                        </a>
                      ),
                      permission: null,
                    },
                  ]
                : [
                    {
                      action: (
                        <Button
                          onClick={() => history.push("/store/promotion/flashSale")}
                          className="material-view-button-edit"
                        >
                          {pageData.btnLeave}
                        </Button>
                      ),
                      permission: null,
                    },
                  ]
            }
          />
          {renderModalDelete()}
          {renderModalStop()}
        </Col>
      </Row>
      <div className="card-discount-code-detail">
        <div className="d-flex justify-space-between w-100">
          <div className="title-session">
            <span>{pageData.summary.title}</span>
          </div>
          <div
            className="view-detail-text ml-auto cursor-pointer"
            onClick={() => {
              setShowModalUsageDetail(true);
              flashSaleUsageDetailRef?.current?.fetchData(props?.match?.params?.id);
            }}
          >
            <span>{pageData.summary.viewDetail}</span>
          </div>
        </div>
        {isMaxWidth500 ? (
          <div>
            <OverviewWidget
              backgroundImage={widgetPurple}
              widgetIcon={<SummaryWidgetPurpleIcon />}
              amount={formatTextNumber(totalDiscountOrder)}
              description={pageData.summary.totalDiscountOrder}
            />
            <OverviewWidget
              backgroundImage={widgetOrange}
              widgetIcon={<SummaryWidgetOrangeIcon />}
              className="mt-24"
              amount={formatCurrency(totalDiscountAmount)}
              description={`${pageData.summary.totalDiscountAmount} (${getCurrency()})`}
            />
          </div>
        ) : (
          <Row gutter={[36, 36]}>
            <Col sm={24} lg={12}>
              <OverviewWidget
                backgroundImage={widgetPurple}
                widgetIcon={<SummaryWidgetPurpleIcon />}
                className="float-right"
                amount={formatTextNumber(totalDiscountOrder)}
                description={pageData.summary.totalDiscountOrder}
              />
            </Col>
            <Col sm={24} lg={12}>
              <OverviewWidget
                backgroundImage={widgetOrange}
                widgetIcon={<SummaryWidgetOrangeIcon />}
                amount={formatCurrency(totalDiscountAmount)}
                description={`${pageData.summary.totalDiscountAmount} (${getCurrency()})`}
              />
            </Col>
          </Row>
        )}
      </div>
      <Row>
        <Card className={`fnb-card card-general w-100 ${isMaxWidth500 ? "mt-36" : "mt-48"}`}>
          <Row>
            <h4 className="title-group">{pageData.form.general}</h4>
          </Row>
          <Row>
            <Col span={24}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.form.name}</h4>
              <div className="material-view-text">
                <Paragraph
                  style={{ maxWidth: "inherit" }}
                  placement="top"
                  ellipsis={{ tooltip: flashSaleData?.name }}
                  color="#50429B"
                >
                  {flashSaleData?.name}
                </Paragraph>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col span={24}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.form.termsAndConditions}</h4>
              <p className="material-view-text">{flashSaleData?.termsAndCondition}</p>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row className="mt-3">
        <Card className="fnb-card w-100">
          <Row>
            <h4 className="title-group">{"Time"}</h4>
          </Row>
          <Row gutter={[32, 16]}>
            <Col xs={24} lg={8}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.form.startDate}</h4>
              <p className="material-view-text"> {moment(flashSaleData?.startDate).format(DateFormat.DD_MM_YYYY)}</p>
            </Col>
            <Col xs={24} lg={8}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.form.startTime}</h4>
              <p className="material-view-text">{moment(flashSaleData?.startTime).format(DateFormat.HH_MM)}</p>
            </Col>
            <Col xs={24} lg={8}>
              <h4 className="fnb-form-label material-view-lable-text-color">{pageData.form.endTime}</h4>
              <p className="material-view-text">{moment(flashSaleData?.endTime).format(DateFormat.HH_MM)}</p>
            </Col>
          </Row>
        </Card>
      </Row>
      <Row className="mt-3">
        <Card className="fnb-card w-100">
          <Row>
            <h4 className="title-group">{pageData.form.product}</h4>
          </Row>
          <Row className="mt-3">
            <Col span={24}>{getFormSelectedMaterials()}</Col>
          </Row>
        </Card>
      </Row>
      <Row className="mt-3">
        <Card className="fnb-card w-100">
          <Row>
            <h5 className="title-group">{pageData.form.condition.title}</h5>
          </Row>
          <Row className="mb-2">
            <Checkbox valuePropName="checked" noStyle disabled={true} checked={flashSaleData?.isMinimumPurchaseAmount}>
              <Text className="fnb-form-label material-view-lable-text-color">
                {pageData.form.condition.checkboxPurchaseAmount}
              </Text>
            </Checkbox>
            <Tooltip placement="topLeft" title={pageData.form.condition.minimumPurchaseAmountTooltip}>
              <InfoCircleFlashSaleIcon size={24} />
            </Tooltip>
          </Row>

          {flashSaleData?.isMinimumPurchaseAmount && (
            <Row>
              <Col span={24}>
                <p className="material-view-text" style={{ marginLeft: "35px" }}>
                  {formatCurrency(flashSaleData?.minimumPurchaseAmount)}
                </p>
              </Col>
            </Row>
          )}
          {disableAllBranches && (
            <Checkbox checked={disableAllBranches} disabled={true} className="mt-3">
              <Text className="fnb-form-label material-view-lable-text-color">{pageData.allBranch}</Text>
            </Checkbox>
          )}

          {!disableAllBranches && (
            <>
              {branches.length > 0 ? (
                <h3 className="fnb-form-label material-view-lable-text-color">{pageData.branch}</h3>
              ) : (
                <Row>
                  <Checkbox disabled>
                    <Text>{pageData.form.condition.checkboxSpecificBranches}</Text>
                  </Checkbox>

                  <Tooltip placement="topLeft" title={pageData.form.condition.specificBranchesTooltip}>
                    <InfoCircleFlashSaleIcon size={24} />
                  </Tooltip>
                </Row>
              )}
              <Row>
                <Col sm={24} xs={24} lg={24}>
                  <Row>
                    {branches?.map((item) => (
                      <Paragraph
                        style={{ maxWidth: "inherit" }}
                        placement="top"
                        ellipsis={{ tooltip: item?.name }}
                        color="#50429B"
                        className="material-view-branch-select material-view-text"
                      >
                        {item?.name}
                      </Paragraph>
                    ))}
                  </Row>
                </Col>
              </Row>
            </>
          )}
          <Row className="mt-3">
            <Checkbox disabled={true} checked={flashSaleData?.isIncludedTopping}>
              <Text className="fnb-form-label material-view-lable-text-color">
                {pageData.form.condition.includedTopping}
              </Text>
            </Checkbox>
          </Row>
        </Card>
      </Row>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCancel}
        isChangeForm={isChangeForm}
      />
      <FlashSaleUsageDetailComponent
        t={t}
        ref={flashSaleUsageDetailRef}
        showModalUsageDetail={showModalUsageDetail}
        onCancel={() => setShowModalUsageDetail(false)}
        flashSaleDataService={flashSaleDataService}
      />
    </>
  );
}
