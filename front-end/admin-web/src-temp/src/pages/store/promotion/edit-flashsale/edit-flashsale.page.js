import { PercentageOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  TimePicker,
  Tooltip,
  Typography,
} from "antd";
import comboDefaultImage from "assets/images/combo-default-img.jpg";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbDeleteIcon } from "components/fnb-delete-icon/fnb-delete-icon";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import FnbParagraph from "components/fnb-paragraph/fnb-paragraph";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbTable } from "components/fnb-table/fnb-table";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import PageTitle from "components/page-title";
import { Thumbnail } from "components/thumbnail/thumbnail";
import { DELAYED_TIME, tableSettings } from "constants/default.constants";
import {
  ArrowDown,
  CalendarNewIconBold,
  FlashSalePercentIcon,
  InfoCircleFlashSaleIcon,
  SearchIcon,
  SelectCheckedIcon,
} from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { currency, DateFormat } from "constants/string.constants";
import comboDataService from "data-services/combo/combo-data.service";
import flashSaleDataService from "data-services/flash-sale/flash-sale-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import {
  convertUtcToLocalTime,
  formatCurrencyWithSymbol,
  formatNumber,
  getCurrency,
  getValidationMessagesWithParentField,
  roundNumber,
} from "utils/helpers";
const { Text } = Typography;
const { Option, OptGroup } = Select;

export default function EditFlashSaleComponent(props) {
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [t] = useTranslation();
  const history = useHistory();
  const [currencyCode, setCurrencyCode] = useState(null);
  const [isMinimumPurchaseAmount, setIsMinimumPurchaseAmount] = useState(false);
  const [isSpecificBranch, setIsSpecificBranch] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [disableAllBranches, setDisableAllBranches] = useState(false);
  const [pageNumber, setPageNumber] = useState(tableSettings.page);
  const [dataSelectedProduct, setDataSelectedProduct] = useState([]);

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
      editTitle: t("promotion.flashSale.editTitle"),
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
    },
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
  };
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProductPriceOptions, setAllProductPriceOptions] = useState([]);
  const [restProductPriceOptions, setRestAllProductPriceOptions] = useState([]);
  const [selectedProductPriceIds, setSelectedProductPriceIds] = useState([]);
  const [hiddenPercent, setHiddenPercent] = useState(false);

  useEffect(() => {
    if (props?.match?.params?.id) {
      getInitialData(props?.match?.params?.id);
    }
  }, []);

  const getInitialData = async (id) => {
    var productData = await comboDataService.getPrepareCreateProductComboDataAsync();
    const { branches, products } = productData;
    setBranches(branches);
    setProducts(products);
    const productDataOptions = getProductDataOptions(products);
    setAllProductPriceOptions(productDataOptions);

    var flashSaleData = await flashSaleDataService.getFlashSaleByIdAsync(id);
    if (flashSaleData) {
      let data = flashSaleData?.flashSale;
      let startDateToLocal = convertUtcToLocalTime(data?.startDate);
      // setStartDate(startDateToLocal);
      let formValue = {
        flashSale: {
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
        },
      };

      if (data?.isSpecificBranch === true) {
        setIsSpecificBranch(true);
        formValue.flashSale.branchIds = data?.branchIds;
      }

      if (data?.isMinimumPurchaseAmount === true) {
        setIsMinimumPurchaseAmount(true);
      }

      const isAppliedForAllBranches = data?.branchIds.length === branches.length;
      setDisableAllBranches(isAppliedForAllBranches);

      const listOptionsByListSelectedName = productDataOptions.filter((b) =>
        data?.products?.find((v) => v.productPriceId === b.productPriceId),
      );

      const restMaterials = productDataOptions.filter((b) => {
        return !listOptionsByListSelectedName.includes(b);
      });

      setRestAllProductPriceOptions(restMaterials);
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
          flashSaleQuantity: product?.flashSaleQuantity,
          maximumLimit: product?.maximumLimit,
        };
        listProducts.push(newRow);
        formValue.flashSale.products.push(newRow);
      });
      setDataSelectedProduct(listProducts);
      form.setFieldsValue(formValue);
      setSelectedProductPriceIds(data?.products?.map((v) => v.productPriceId));
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

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const renderProductSpecificOptions = () => {
    let options = [];
    let allProducts = products;

    allProducts.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    allProducts.forEach((product, index) => {
      const listProductPriceByProductId = restProductPriceOptions.filter((p) => p.productId === product.id);
      if (listProductPriceByProductId.length > 1) {
        const groupName = listProductPriceByProductId[0].productName;
        const groupThumbnail = listProductPriceByProductId[0].thumbnail;
        const groupOptions = [];
        listProductPriceByProductId?.forEach((optionData) => {
          const option = (
            <Option
              key={optionData?.key}
              value={optionData?.text}
              productId={optionData?.productId}
              productPriceId={optionData?.productPriceId}
              price={optionData?.productPrice}
              className="option-item-grouped"
            >
              <Row className="option-item-grouped-row">
                <Col xs={0} sm={0} md={0} lg={24}>
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col span={24} className="item-product-prices-name text-normal text-line-clamp-2">
                          <Text>{optionData?.text}</Text>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col span={24} className="item-product-prices-unit text-normal">
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col span={24} className="item-product-prices-price-value text-normal">
                          <span>{formatCurrencyWithSymbol(optionData?.productPrice)}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={24} md={24} lg={0} className="option-item-responsive">
                  <div className="option-grouped-item-responsive">
                    <Row align="middle">
                      <Col span={24} className="item-grouped-responsive-product-name text-normal text-line-clamp-2">
                        <Text>{optionData?.text}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{optionData?.unitName}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{formatCurrencyWithSymbol(optionData?.productPrice)}</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Option>
          );

          groupOptions.push(option);
        });

        if (groupOptions.length > 0) {
          const groupOption = (
            <OptGroup
              label={
                <Row className="option-grouped-label">
                  <Col xs={9} sm={9} md={9} lg={2}>
                    <div className="item-group-product-image">
                      <Image preview={false} src={groupThumbnail ?? "error"} fallback={comboDefaultImage} />
                    </div>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={22}>
                    <div className="item-group-product-name text-line-clamp-2">
                      <span>{groupName}</span>
                    </div>
                  </Col>
                  <Col xs={15} sm={15} md={15} lg={0}>
                    <div className="option-grouped-label-responsive">{groupName}</div>
                  </Col>
                </Row>
              }
            >
              {groupOptions}
            </OptGroup>
          );
          options.push(groupOption);
        }
      } else {
        const optionData = listProductPriceByProductId.length > 0 ? listProductPriceByProductId[0] : null;
        if (optionData) {
          const option = (
            <Option
              key={optionData?.key}
              value={optionData?.text}
              productId={optionData?.productId}
              productPriceId={optionData?.productPriceId}
              price={optionData?.productPrice}
              className="option-item"
            >
              <Row className="option-item-row">
                <Col xs={9} sm={9} md={9} lg={2}>
                  <div className="item-product-image">
                    <Image preview={false} src={optionData?.thumbnail ?? "error"} fallback={comboDefaultImage} />
                  </div>
                </Col>
                <Col xs={0} sm={0} md={0} lg={22}>
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col span={24} className="item-product-name text-bold text-line-clamp-2">
                          <span>{optionData?.text}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={3}>
                      <Row>
                        <Col span={24} className="text-normal">
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={5}>
                      <Row>
                        <Col span={24} className="item-product-price text-normal">
                          <span>{formatCurrencyWithSymbol(optionData?.productPrice)}</span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={15} sm={15} md={15} lg={0} className="option-item-responsive">
                  <div className="option-group-item-responsive">
                    <Row align="middle">
                      <Col span={24} className="item-responsive-product-name text-bold text-line-clamp-2">
                        <Text>{optionData?.text}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{optionData?.unitName}</Text>
                      </Col>
                    </Row>
                    <Row align="middle">
                      <Col span={24} className="text-normal">
                        <Text>{formatCurrencyWithSymbol(optionData?.productPrice)}</Text>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Option>
          );

          options.push(option);
        }
      }
    });

    return options;
  };

  const columnsProduct = (indexPriceName) => {
    let columns = [
      {
        title: pageData.form.no,
        align: "center",
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
            <Col span={10} className="table-selling-product-no">
              <Row>
                <Col span={24} className="table-selling-product-text-product-name table-selling-product-name-overflow">
                  <FnbParagraph>{record?.name}</FnbParagraph>
                </Col>
              </Row>
              <Row style={record?.productPriceName && { marginTop: "4px" }}>
                <Col span={24} className="table-selling-product-text-no table-selling-product-text-no-font-size">
                  {record?.productPriceName}
                </Col>
              </Row>
            </Col>
          </Row>
        ),
      },
      {
        title: `${pageData.form.price} (${getCurrency()})`,
        dataIndex: "priceFormat",
        align: "right",
        width: "10%",
        render: (_, record) => <div className="mb-4">{record?.priceFormat}</div>,
      },
      {
        title: pageData.form.flashSalePrice,
        dataIndex: "flashSalePrice",
        width: "20%",
        align: "right",
        editable: true,
        className: "inventory-tracking-material-item",
        render: (_, record, index) => {
          return (
            <>
              <Form.Item
                name={["flashSale", "products", index, "flashSalePrice"]}
                rules={[
                  {
                    required: true,
                    message: pageData.form.pleaseInputPrice,
                  },
                  {
                    type: "number",
                    min: 1,
                    message: pageData.inventoryTracking.quantityMoreThanZero,
                  },
                  () => ({
                    validator(_, value) {
                      if (value >= dataSelectedProduct[index]?.price) {
                        setHiddenPercent(true);
                        return Promise.reject(pageData.form.flashSalePriceValidate);
                      } else if (value) {
                        setHiddenPercent(false);
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                className={hiddenPercent ? "form-item-quantity mt-2 mb-4" : "form-item-quantity mt-2 mb-2"}
              >
                <InputNumber
                  className="fnb-input input-quantity"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onChange={() => {
                    let { flashSale } = form.getFieldValue();
                    var productSelect = [...dataSelectedProduct];
                    productSelect[index].flashSalePrice = flashSale?.products[index]?.flashSalePrice;
                    setDataSelectedProduct(productSelect);
                    if (!flashSale?.products[index]?.flashSalePrice) {
                      setHiddenPercent(true);
                    }
                  }}
                />
              </Form.Item>
              <div className="float-left color-primary discount-products-wrapper" hidden={hiddenPercent}>
                <Row>
                  <Col className="discount-icon-col">
                    <FlashSalePercentIcon />
                  </Col>
                  <Col className="discount-percent-col">
                    <span className="ml-2">
                      {record?.price === 0
                        ? 0
                        : roundNumber(
                            ((record?.price - dataSelectedProduct[index]?.flashSalePrice) / record?.price) * 100,
                            1,
                          )}
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
        align: "right",
        editable: true,
        className: "inventory-tracking-material-item",
        render: (_, record, index) => (
          <Form.Item
            name={["flashSale", "products", index, "flashSaleQuantity"]}
            rules={[
              {
                required: true,
                message: pageData.form.pleaseInputQuantity,
              },
              {
                type: "number",
                min: 1,
                message: pageData.inventoryTracking.quantityMoreThanZero,
              },
              {
                type: "number",
                max: 999999,
                message: pageData.form.flashSaleQuantityValidate,
              },
            ]}
            className="form-item-quantity mb-4"
          >
            <InputNumber
              className="fnb-input input-quantity"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={() => {
                let { flashSale } = form.getFieldValue();
                var productSelect = [...dataSelectedProduct];
                productSelect[index].flashSaleQuantity = flashSale?.products[index]?.flashSaleQuantity;
                setDataSelectedProduct(productSelect);
              }}
            />
          </Form.Item>
        ),
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
        align: "center",
        editable: true,
        className: "inventory-tracking-material-item",
        render: (_, record, index) => (
          <Form.Item
            name={["flashSale", "products", index, "maximumLimit"]}
            rules={[
              {
                type: "number",
                min: 1,
                message: pageData.inventoryTracking.quantityMoreThanZero,
              },
              () => ({
                validator(_, value) {
                  let formValue = form.getFieldsValue();
                  let { flashSale } = formValue;
                  if (value > flashSale?.products[index]?.flashSaleQuantity) {
                    return Promise.reject(pageData.form.maximumLimitValidate);
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            className="form-item-quantity mb-4"
          >
            <InputNumber
              className="fnb-input input-quantity"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onChange={() => {
                let { flashSale } = form.getFieldValue();
                var productSelect = [...dataSelectedProduct];
                productSelect[index].maximumLimit = flashSale?.products[index]?.maximumLimit;
                setDataSelectedProduct(productSelect);
              }}
            />
          </Form.Item>
        ),
      },
      {
        dataIndex: "action",
        align: "center",
        width: "5%",
        render: (_, record, index) => (
          <Row className="mb-4">
            <a onClick={() => onDeSelectProduct(record?.id)}>
              <FnbDeleteIcon />
            </a>
          </Row>
        ),
      },
    ];
    return columns;
  };

  const onSelectProduct = (listSelectedItemName, options) => {
    let listSelectProductPrice = [...selectedProductPriceIds, options?.productPriceId];
    const optionsByListSelectedName = allProductPriceOptions.find((p) => options?.productPriceId === p.productPriceId);
    const restProductPriceOptions = allProductPriceOptions.filter((b) => {
      return listSelectProductPrice.indexOf(b.productPriceId) < 0;
    });

    setRestAllProductPriceOptions(restProductPriceOptions);
    const newRow = {
      id: optionsByListSelectedName?.productPriceId,
      name: optionsByListSelectedName?.productName,
      price: optionsByListSelectedName?.productPrice,
      priceFormat: formatNumber(optionsByListSelectedName?.productPrice),
      isSinglePrice: optionsByListSelectedName?.isSinglePrice,
      productPriceName: optionsByListSelectedName?.productPriceName,
      thumbnail: optionsByListSelectedName?.thumbnail,
      flashSalePrice: null,
      flashSaleQuantity: null,
      maximumLimit: null,
    };

    var newDataSelectedProduct = [...dataSelectedProduct, newRow];
    setDataSelectedProduct(newDataSelectedProduct);
    setSelectedProductPriceIds(listSelectProductPrice);

    newDataSelectedProduct.map((product, index) => {
      form.setFieldValue(["flashSale", "products", index, "flashSalePrice"], product?.flashSalePrice);
      form.setFieldValue(["flashSale", "products", index, "flashSaleQuantity"], product?.flashSaleQuantity);
      form.setFieldValue(["flashSale", "products", index, "maximumLimit"], product?.maximumLimit);
    });
  };

  const onDeSelectProduct = (id) => {
    const restProductPriceIds = selectedProductPriceIds.filter((x) => x !== id);
    setSelectedProductPriceIds(restProductPriceIds);
    const restProductPriceOptions = allProductPriceOptions.filter((b) => {
      return restProductPriceIds.indexOf(b.productPriceId) < 0;
    });
    setRestAllProductPriceOptions(restProductPriceOptions);

    var dataProductAfterDelete = dataSelectedProduct.filter((x) => x.id !== id);
    setDataSelectedProduct(dataProductAfterDelete);

    dataProductAfterDelete.map((product, index) => {
      form.setFieldValue(["flashSale", "products", index, "flashSalePrice"], product?.flashSalePrice);
      form.setFieldValue(["flashSale", "products", index, "flashSaleQuantity"], product?.flashSaleQuantity);
      form.setFieldValue(["flashSale", "products", index, "maximumLimit"], product?.maximumLimit);
    });
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

  const clickCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true);
    } else {
      onCancel();
    }
  };

  const onDiscard = () => {
    setShowConfirm(false);
  };

  const onCancel = () => {
    setIsChangeForm(false);
    setTimeout(() => {
      history.push("/store/promotion/flashSale");
    }, DELAYED_TIME);
  };

  const onSelectBranches = (values) => {
    const listBranch = branches.filter((b) => values.find((v) => v === b.id));
    if (values && values.length > 0) {
      let formValues = form.getFieldsValue();
      let branchIds = [];
      branchIds = listBranch?.map((item) => item?.id);

      form.setFieldsValue({ ...formValues, flashSale: { branchIds: branchIds } });
    }
  };

  const onSelectAllBranches = (event) => {
    let isChecked = event.target.checked;
    setDisableAllBranches(isChecked);
    let branchIds = [];
    if (isChecked) {
      branchIds = branches?.map((item) => item?.id);
      onSelectBranches(branchIds);
      let formValue = {
        flashSale: {
          branchIds: branchIds,
        },
      };
      form.setFieldsValue(formValue);
    }
  };

  const setStartTime = (value) => {
    let formValue = form.getFieldsValue();
    let { flashSale } = formValue;
    flashSale.startTime = value;
    form.setFieldsValue(formValue);
  };

  const setEndTime = (value) => {
    let formValue = form.getFieldsValue();
    let { flashSale } = formValue;
    flashSale.endTime = value;
    form.setFieldsValue(formValue);
  };

  const onCheckSpecificBranches = (e) => {
    setIsSpecificBranch(e.target.checked);
  };

  const onCreateNewFlashSale = (values) => {
    let { flashSale } = values;
    if (!flashSale?.products || flashSale?.products?.length < 1) {
      message.error(pageData.form.productValidate);
    } else {
      flashSale?.products?.map((product, index) => {
        var productSelect = dataSelectedProduct[index];
        productSelect.flashSalePrice = product.flashSalePrice;
        productSelect.flashSaleQuantity = product.flashSaleQuantity;
        productSelect.maximumLimit = product.maximumLimit;
      });
      var flashStartDate = new Date(
        moment(flashSale?.startDate).year(),
        moment(flashSale?.startDate).month(),
        moment(flashSale?.startDate).date(),
        moment(flashSale?.startTime).hours(),
        moment(flashSale?.startTime).minutes(),
        moment(flashSale?.startTime).seconds(),
      );
      var flashEndDate = new Date(
        moment(flashSale?.startDate).year(),
        moment(flashSale?.startDate).month(),
        moment(flashSale?.startDate).date(),
        moment(flashSale?.endTime).hours(),
        moment(flashSale?.endTime).minutes(),
        moment(flashSale?.endTime).seconds(),
      );

      var saveObj = {
        flashSale: {
          ...flashSale,
          startDate: moment.utc(flashStartDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2),
          endDate: moment.utc(flashEndDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2),
          isMinimumPurchaseAmount: isMinimumPurchaseAmount,
          flashSaleProducts: dataSelectedProduct,
          id: props?.match?.params?.id,
        },
      };
      flashSaleDataService
        .editFlashSaleAsync(saveObj)
        .then((response) => {
          if (response === true) {
            onCancel();
            message.success(pageData.form.editFlashSaleSuccess);
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessagesWithParentField(errs, "flashSale"));
        });
    }
  };

  /**
   * Disable Hour From Start Time
   */

  const getDisabledHoursStartTime = () => {
    var hours = [];
    let formValue = form.getFieldsValue();
    let { flashSale } = formValue;
    var flashSaleDate = new Date(
      moment(flashSale?.startDate).year(),
      moment(flashSale?.startDate).month(),
      moment(flashSale?.startDate).date(),
    );
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (flashSaleDate.toDateString() === currentDate.toDateString()) {
      for (var i = 0; i < moment().hour(); i++) {
        hours.push(i);
      }
    }
    return hours;
  };

  /**
   * Disable Hour Minute From Start Time
   * @param {*} selectedHour
   */

  const getDisabledMinutesStartTime = (selectedHour) => {
    var minutes = [];
    let formValue = form.getFieldsValue();
    let { flashSale } = formValue;
    var flashSaleDate = new Date(
      moment(flashSale?.startDate).year(),
      moment(flashSale?.startDate).month(),
      moment(flashSale?.startDate).date(),
    );
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (flashSaleDate.toDateString() === currentDate.toDateString()) {
      if (selectedHour === moment().hour()) {
        for (var i = 0; i < moment().minute(); i++) {
          minutes.push(i);
        }
      }
    }
    return minutes;
  };

  /**
   * Disable Hour From End Time
   */

  const getDisabledHoursEndTime = () => {
    var hours = [];
    let formValue = form.getFieldsValue();
    let { flashSale } = formValue;
    for (var i = 0; i < moment(flashSale.startTime).hour(); i++) {
      hours.push(i);
    }
    return hours;
  };

  /**
   * Disable Hour Minute From End Time
   * @param {*} selectedHour
   */
  const getDisabledMinutesEndTime = (selectedHour) => {
    var minutes = [];
    let formValue = form.getFieldsValue();
    let { flashSale } = formValue;
    if (selectedHour === moment(flashSale.startTime).hour()) {
      for (var i = 0; i <= moment(flashSale.startTime).minute(); i++) {
        minutes.push(i);
      }
    }
    return minutes;
  };

  return (
    <>
      <Form
        onFinish={onCreateNewFlashSale}
        form={form}
        onFieldsChange={() => setIsChangeForm(true)}
        layout="vertical"
        autoComplete="off"
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <PageTitle className="promotion-guideline-page-title" content={pageData.form.editTitle} />
            <FnbGuideline placement="rightTop" title={pageData.guideline.title} content={pageData.guideline.content} />
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button type="primary" htmlType="submit">
                      {pageData.btnSave}
                    </Button>
                  ),
                  permission: PermissionKeys.CREATE_FLASH_SALE,
                },
                {
                  action: (
                    <p className="fnb-text-action-group mr-3 action-cancel" onClick={clickCancel}>
                      {pageData.btnCancel}
                    </p>
                  ),
                  permission: null,
                },
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Card className="fnb-card w-100">
            <Row>
              <h3 className="label-information">{pageData.form.general}</h3>
            </Row>
            <Row>
              <h4 className="fnb-form-label mt-32">
                {pageData.form.name}
                <span className="text-danger">*</span>
              </h4>
              <Form.Item
                name={["flashSale", "name"]}
                rules={[
                  {
                    required: true,
                    message: pageData.form.nameValidateMessage,
                  },
                  {
                    type: "string",
                    max: 100,
                  },
                ]}
                className="w-100"
              >
                <Input
                  className="fnb-input-with-count"
                  showCount
                  maxLength={pageData.form.maxLengthName}
                  placeholder={pageData.form.enterCampaignName}
                />
              </Form.Item>
            </Row>
            <Row>
              <h4 className="fnb-form-label">{pageData.form.termsAndConditions}</h4>
              <Form.Item name={["flashSale", "termsAndCondition"]} className="w-100">
                <FnbTextArea
                  placeholder={pageData.form.enterTermsAndCondition}
                  showCount
                  maxLength={pageData.form.maxLengthTermsAndConditions}
                  rows={4}
                ></FnbTextArea>
              </Form.Item>
            </Row>
          </Card>
        </Row>
        <Row className="mt-3">
          <Card className="fnb-card w-100">
            <Row gutter={[32, 16]}>
              <Col xs={24} lg={8}>
                <h4 className="fnb-form-label">
                  {pageData.form.startDate} <span className="text-danger">*</span>
                </h4>

                <Form.Item
                  name={["flashSale", "startDate"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.form.pleaseSelectStartDate,
                    },
                  ]}
                >
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={pageData.selectDate}
                    className="fnb-date-picker w-100"
                    disabledDate={disabledDate}
                    format={DateFormat.DD_MM_YYYY}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <h4 className="fnb-form-label">
                  {pageData.form.startTime} <span className="text-danger">*</span>
                </h4>

                <Form.Item
                  name={["flashSale", "startTime"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.form.pleaseSelectStartTime,
                    },
                  ]}
                >
                  <TimePicker
                    className="fnb-date-picker   w-100"
                    dropdownClassName="fnb-date-time-picker-dropdown"
                    format={"HH:mm"}
                    onSelect={(time) => {
                      setStartTime(moment(time, "HH:mm"));
                    }}
                    showNow={false}
                    showConfirm={false}
                    disabledHours={getDisabledHoursStartTime}
                    disabledMinutes={getDisabledMinutesStartTime}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <h4 className="fnb-form-label">
                  {pageData.form.endTime} <span className="text-danger">*</span>
                </h4>

                <Form.Item
                  name={["flashSale", "endTime"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.form.pleaseStartEndTime,
                    },
                  ]}
                >
                  <TimePicker
                    className="fnb-date-picker   w-100"
                    dropdownClassName="fnb-date-time-picker-dropdown"
                    format={"HH:mm"}
                    onSelect={(time) => {
                      setEndTime(moment(time, "HH:mm"));
                    }}
                    showNow={false}
                    showConfirm={false}
                    disabledHours={getDisabledHoursEndTime}
                    disabledMinutes={getDisabledMinutesEndTime}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row className="mt-3">
          <Card className="fnb-card w-100">
            <Row>
              <h4 className="fnb-form-label">{pageData.form.product}</h4>
              <Col span={24}>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch={true}
                  optionLabelProp="label"
                  showArrow
                  allowClear
                  value={null}
                  onChange={(e, option) => onSelectProduct(e, option)}
                  className={`search-material-information`}
                  popupClassName="fnb-select-multiple-product-with-group-dropdown"
                  suffixIcon={<ArrowDown />}
                  menuItemSelectedIcon={<SelectCheckedIcon />}
                  placeholder={pageData.product.productPlaceholder}
                  listHeight={600}
                  filterOption={(input, option) => {
                    const inputStr = input.removeVietnamese();
                    const productName = option?.value?.removeVietnamese();
                    return productName?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0;
                  }}
                >
                  {renderProductSpecificOptions()}
                </Select>
                <div className="icon-search-material">
                  <SearchIcon />
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col span={24}>{getFormSelectedMaterials()}</Col>
            </Row>
          </Card>
        </Row>
        <Row className="mt-3 edit-flash-sale-form-item">
          <Card className="fnb-card w-100">
            <Row>
              <h5 className="title-group">{pageData.form.condition.title}</h5>
            </Row>
            <Row className="mb-2">
              <Form.Item name={["flashSale", "isMinimumPurchaseAmount"]} valuePropName="checked">
                <Checkbox
                  valuePropName="checked"
                  noStyle
                  onChange={(e) => setIsMinimumPurchaseAmount(e.target.checked)}
                >
                  <Text>{pageData.form.condition.checkboxPurchaseAmount}</Text>
                </Checkbox>
                <Tooltip placement="topLeft" title={pageData.form.condition.minimumPurchaseAmountTooltip}>
                  <InfoCircleFlashSaleIcon size={24} />
                </Tooltip>
              </Form.Item>
            </Row>
            {isMinimumPurchaseAmount && (
              <Row>
                <Form.Item
                  name={["flashSale", "minimumPurchaseAmount"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.form.condition.pleaseEnterMinimum,
                    },
                  ]}
                  className="w-100"
                >
                  <InputNumber
                    className="w-100 fnb-input-number"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    min={1}
                    precision={currencyCode === currency.vnd ? 0 : 2}
                    onKeyPress={(event) => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Row>
            )}
            <Row className="mb-2">
              <Form.Item name={["flashSale", "isSpecificBranch"]} valuePropName="checked">
                <Checkbox onChange={onCheckSpecificBranches}>
                  <Text>{pageData.form.condition.checkboxSpecificBranches}</Text>
                </Checkbox>
              </Form.Item>
              <Tooltip placement="topLeft" title={pageData.form.condition.specificBranchesTooltip}>
                <InfoCircleFlashSaleIcon style={{ marginTop: "10px" }} size={24} />
              </Tooltip>
            </Row>
            {isSpecificBranch && (
              <>
                <h3 className="fnb-form-label mt-16">{pageData.branch}</h3>
                <div className="material-check-box-select-all-branch">
                  <Checkbox checked={disableAllBranches} onChange={(event) => onSelectAllBranches(event)}>
                    {pageData.allBranch}
                  </Checkbox>
                </div>
                <Row>
                  <Col span={24} hidden={disableAllBranches}>
                    <Form.Item
                      name={["flashSale", "branchIds"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.condition.pleaseSelectSpecificBranches,
                        },
                      ]}
                      className="w-100"
                    >
                      <FnbSelectMultiple
                        onChange={(values) => onSelectBranches(values)}
                        placeholder={pageData.form.condition.selectBranchPlaceholder}
                        className="w-100"
                        allowClear
                        option={branches?.map((item) => ({
                          id: item.id,
                          name: t(item.name),
                        }))}
                      ></FnbSelectMultiple>
                    </Form.Item>
                  </Col>
                  <Col span={24} hidden={!disableAllBranches}>
                    <Form.Item name="tmpBranchIds">
                      <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <Form.Item name={["flashSale", "isIncludedTopping"]} valuePropName="checked">
                <Checkbox>
                  <Text>{pageData.form.condition.includedTopping}</Text>
                </Checkbox>
              </Form.Item>
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
        onOk={onCancel}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
