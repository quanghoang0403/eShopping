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
  Radio,
  Row,
  Select,
  TimePicker,
  Tooltip,
  Typography,
} from "antd";
import comboDefaultImage from "assets/images/combo-default-img.jpg";
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
import { FnbSelectMultipleProductRenderOption } from "components/fnb-select-multiple-product-render-option/fnb-select-multiple-product-render-option";
import { FnbSelectMultiple } from "components/fnb-select-multiple/fnb-select-multiple";
import { FnbSelectSingle } from "components/fnb-select-single/fnb-select-single";
import { FnbTextArea } from "components/fnb-text-area/fnb-text-area.component";
import PageTitle from "components/page-title";
import { DELAYED_TIME } from "constants/default.constants";
import {
  ArrowDown,
  ArrowDownDropdown,
  CalendarNewIconBold,
  CheckboxCheckedIcon,
  InfoCircleFlashSaleIcon,
  PromoIcon,
} from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { defaultPlatforms } from "constants/platform.constants";
import { ListPromotionType, PromotionType } from "constants/promotion.constants";
import { currency, DateFormat } from "constants/string.constants";
import branchDataService from "data-services/branch/branch-data.service";
import customerSegmentDataService from "data-services/customer-segment/customer-segment-data.service";
import discountCodeDataService from "data-services/discount-code/discount-code-data.service";
import productCategoryDataService from "data-services/product-category/product-category-data.service";
import productDataService from "data-services/product/product-data.service";
import storeDataService from "data-services/store/store-data.service";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import {
  checkOnKeyPressValidation,
  fileNameNormalize,
  formatCurrencyWithSymbol,
  getValidationMessagesWithParentField,
} from "utils/helpers";
import "./index.scss";
const { Text } = Typography;
const { Option, OptGroup } = Select;

export default function CreateNewDiscountCode(props) {
  const [t] = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [isChangeForm, setIsChangeForm] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [discountCodeTypeId, setDiscountCodeTypeId] = useState(0);
  const [listProduct, setListProduct] = useState([]);
  const [listProductCategory, setListProductCategory] = useState([]);
  const [listbranches, setListbranches] = useState([]);
  const [isPercentDiscount, setIsPercentDiscount] = useState(true);
  const [currencyCode, setCurrencyCode] = useState(null);
  const [isMinimumPurchaseAmount, setIsMinimumPurchaseAmount] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAllBranches, setIsAllBranches] = useState(true);
  const [isLimitNumberCouponUse, setIsLimitNumberCouponUse] = useState(false);
  const [isIncludedTopping, setIsIncludedTopping] = useState(false);
  const [isLimitOneTimeUse, setIsLimitOneTimeUse] = useState(true);
  const [customerSegmentInSore, setCustomerSegmentInStore] = useState([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalEmail, setTotalEmail] = useState(0);
  const [totalSegment, setTotalSegment] = useState(0);
  const [listCustomerId, setListCustomerId] = useState([]);
  const [listCustomerSegmentId, setListCustomerSegmentId] = useState([]);
  const [showCountCustomerSegment, setShowCountCustomerSegment] = useState(false);
  const [isAllCustomers, setIsAllCustomers] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 576 });
  const [isApplyAllProducts, setIsApplyAllProducts] = useState(false);
  const [isApplyAllCategories, setIsApplyAllCategories] = useState(false);
  const [restProductPriceOptions, setRestAllProductPriceOptions] = useState([]);
  const [productIds, setProductIds] = useState([]);

  const pageData = {
    leaveForm: t("messages.leaveForm"),
    create: t("discountCode.btnNewDiscountCodeTitle"),
    btnCancel: t("button.cancel"),
    btnSave: t("button.save"),
    okText: t("button.ok"),
    createDiscountCodeSuccess: t("discountCode.formCreate.createDiscountCodeSuccess"),
    selectDate: t("promotion.selectDate"),
    form: {
      general: t("discountCode.formCreate.generalInformation"),
      name: t("discountCode.formCreate.name"),
      placeholderName: t("discountCode.formCreate.enterDiscountCodeName"),
      maxLengthName: 100,
      pleaseEnterDiscountCodeName: t("discountCode.formCreate.pleaseEnterDiscountCodeName"),
      applicableType: t("discountCode.formCreate.applicableType"),
      product: t("discountCode.formCreate.product"),
      selectProduct: t("discountCode.formCreate.selectProduct"),
      pleaseSelectProduct: t("discountCode.formCreate.pleaseSelectProduct"),
      productCategory: t("discountCode.formCreate.productCategory"),
      selectProductCategory: t("discountCode.formCreate.selectProductCategory"),
      pleaseSelectProductCategory: t("discountCode.formCreate.pleaseSelectProductCategory"),
      percent: "%",
      discountValue: t("discountCode.formCreate.discountValue"),
      maxDiscount: t("discountCode.formCreate.maxDiscount"),
      pleaseEnterPrecent: t("discountCode.formCreate.pleaseEnterPrecent"),
      pleaseEnterMaxDiscount: t("discountCode.formCreate.pleaseEnterMaxDiscount"),
      startDate: t("discountCode.formCreate.startDatetime"),
      pleaseStartDate: t("discountCode.formCreate.pleaseStartDate"),
      pleaseStartTime: t("discountCode.formCreate.pleaseStartTime"),
      pleaseEndDate: t("discountCode.formCreate.pleaseEndDate"),
      pleaseEndTime: t("discountCode.formCreate.pleaseEndTime"),
      endDate: t("discountCode.formCreate.endDatetime"),
      PlaceholderDateTime: t("discountCode.formCreate.placeholderDateTime"),
      termsAndConditions: t("discountCode.formCreate.termsAndConditions"),
      maxLengthTermsAndConditions: 2000,
      maximum: 999999999,
      couponConditions: t("discountCode.formCreate.couponConditions"),
      minimumPurchaseAmountOnBill: t("discountCode.formCreate.minimumPurchaseAmountOnBill"),
      pleaseInputValue: t("discountCode.formCreate.pleaseInputValue"),
      pleaseSelectBranch: t("discountCode.formCreate.pleaseSelectBranch"),
      allBranches: t("discountCode.formCreate.allBranches"),
      selectBranches: t("discountCode.formCreate.selectBranches"),
      includedTopping: t("discountCode.formCreate.includedTopping"),
      platform: t("discountCode.formCreate.platform"),
      pleaseSelectPlatform: t("discountCode.formCreate.pleaseSelectPlatform"),
      code: t("discountCode.formCreate.code"),
      usageLimits: t("discountCode.formCreate.usageLimits"),
      limitNumberOfTimesThisCouponCanBeUsed: t("discountCode.formCreate.limitNumberOfTimesThisCouponCanBeUsed"),
      limitOneUsedPerCustomer: t("discountCode.formCreate.limitOneUsedPerCustomer"),
      discountCode: t("discountCode.formCreate.discountCode"),
      enterDiscountCode: t("discountCode.formCreate.enterDiscountCode"),
      generateCodes: t("discountCode.formCreate.generateCodes"),
      thisCodeIsExisted: t("discountCode.formCreate.thisCodeIsExisted"),
      minimumAmounttoApplyDiscountCode: t("discountCode.formCreate.minimumAmounttoApplyDiscountCode"),
      pleaseEnterDiscountCodeOrGenerate: t("discountCode.formCreate.pleaseEnterDiscountCodeOrGenerate"),
      pleaseSelectTimeframeHasBecomePast: t("discountCode.formCreate.pleaseSelectTimeframeHasBecomePast"),
      allCustomers: t("discountCode.formCreate.allCustomers"),
      customerGroupPlaceholder: t("marketing.emailCampaign.generalTab.customerGroupPlaceholder"),
      customerGroupRequiredMessage: t("marketing.emailCampaign.generalTab.customerGroupRequiredMessage"),
      allProduct: t("discountCode.formCreate.allProducts"),
      allCategories: t("discountCode.formCreate.allCategories"),
    },
    discardBtn: t("button.discard"),
    confirmLeaveBtn: t("button.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
    guideline: {
      title: t("discountCode.guideline.title"),
      content: t("discountCode.guideline.content"),
    },
  };

  const [onChangeGenerateCode, setOnnChangeGenerateCode] = useState(false);

  useEffect(() => {
    getCurrency();
    setDataOnForm();
    getListBranches();
    getCustomerSegment();
  }, []);

  const setDataOnForm = () => {
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;

    discountCode.isPercentDiscount = true;
    discountCode.isLimitOneTimeUse = true;
    discountCode.isIncludedTopping = false;
    discountCode.discountCodeTypeId = PromotionType.DiscountTotal;
    discountCode.platformIds = defaultPlatforms.map((platform) => {
      return platform.id;
    });
    form.setFieldsValue(formValue);
  };

  const getCurrency = async () => {
    let currencyCode = await storeDataService.getCurrencyByStoreId();
    setCurrencyCode(currencyCode);
  };

  const getCustomerSegment = async () => {
    // Get customer segment list
    const customerSegmentListResult = await customerSegmentDataService.getCustomerSegmentByStoreIdAsync();
    setCustomerSegmentInStore(customerSegmentListResult);
  };

  const countDistinceObjectInArray = (arrayDistinct, array) => {
    array?.forEach((y) => {
      if (!arrayDistinct.includes(y)) {
        arrayDistinct.push(y);
      }
    });
    return arrayDistinct;
  };

  const onUpdateCustomerSegment = (values) => {
    const selectedCustomersSegment = customerSegmentInSore?.filter((x) => values?.indexOf(x.id) > -1);

    //Count distinct customers
    const distinctCustomers = [];
    selectedCustomersSegment?.forEach((x) => {
      if (x?.customers?.length > 0) {
        countDistinceObjectInArray(distinctCustomers, x.customers);
      }
    });
    setTotalCustomer(distinctCustomers.length);
    setListCustomerId(distinctCustomers);
    //Count distinct emails
    const distinctEmails = [];
    selectedCustomersSegment?.forEach((x) => {
      if (x?.emails?.length > 0) {
        countDistinceObjectInArray(distinctEmails, x.emails);
      }
    });
    setTotalEmail(distinctEmails.length);

    setTotalSegment(selectedCustomersSegment?.length);
    setListCustomerSegmentId(selectedCustomersSegment?.map((a) => a.id));
    setShowCountCustomerSegment(selectedCustomersSegment?.length > 0 ? true : false);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate;
  };

  const onCreateNewDiscountCode = (values) => {
    let currentDateTime = new Date();
    let { discountCode } = values;
    var discountCodeStartDate = new Date(
      moment(discountCode?.startDate).year(),
      moment(discountCode?.startDate).month(),
      moment(discountCode?.startDate).date(),
      moment(discountCode?.startTime).hours(),
      moment(discountCode?.startTime).minutes(),
      moment(discountCode?.startTime).seconds(),
    );
    var discountCodeEndDate = new Date(
      moment(discountCode?.endDate).year(),
      moment(discountCode?.endDate).month(),
      moment(discountCode?.endDate).date(),
      moment(discountCode?.endTime).hours(),
      moment(discountCode?.endTime).minutes(),
      moment(discountCode?.endTime).seconds(),
    );

    if (discountCodeStartDate > currentDateTime && discountCodeStartDate < discountCodeEndDate) {
      var req = {
        discountCode: {
          ...discountCode,
          startDate: moment.utc(discountCodeStartDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2),
          endDate: moment.utc(discountCodeEndDate).format(DateFormat.YYYY_MM_DD_HH_MM_SS_2),
          isMinimumPurchaseAmount: isMinimumPurchaseAmount,
          isLimitNumberCouponUse: isLimitNumberCouponUse,
          isAllBranches: isAllBranches,
          isIncludedTopping: isIncludedTopping,
          isLimitOneTimeUse: isLimitOneTimeUse,
          listCustomerId: listCustomerId,
          totalCustomerSegment: totalSegment,
          isAllCustomers: isAllCustomers,
          listCustomerSegmentId: listCustomerSegmentId,
          isApplyAllCategories: isApplyAllCategories,
          isApplyAllProducts: isApplyAllProducts,
          productIds: [...productIds],
        },
      };
      discountCodeDataService
        .createDiscountCodeAsync(req)
        .then((res) => {
          if (res) {
            onCancel();
            message.success(pageData.createDiscountCodeSuccess);
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessagesWithParentField(errs, "discountCode"));
        });
    } else {
      message.error(pageData.form.pleaseSelectTimeframeHasBecomePast);
    }
  };

  const onChangeDiscountCodeType = (key) => {
    setDiscountCodeTypeId(key);
    if (key === PromotionType.DiscountProduct) {
      getListProducts();
    } else if (key === PromotionType.DiscountProductCategory) {
      getListProductCategorys();
    }
  };

  const getListProducts = async () => {
    var res = await productDataService.getAllProductsAsync();
    if (res) {
      setListProduct(res.products);
      const productDataOptions = getProductDataOptions(res.products);
      setRestAllProductPriceOptions(productDataOptions);
    }
  };
  const getProductDataOptions = (products) => {
    let productOptions = [];
    // eslint-disable-next-line array-callback-return
    products?.map((product) => {
      if (product && product.productPrices && product.productPrices.length > 0) {
        // eslint-disable-next-line array-callback-return
        product.productPrices.map((price) => {
          if (price) {
            const option = {
              key: price.id,
              productId: product.id,
              productName: product.name,
              text: price.priceName ? `${product.name} (${price.priceName})` : product.name,
              productPriceId: price.id,
              productPriceName: price.priceName,
              productPrice: price.priceValue,
              isSinglePrice: product.productPrices.length <= 1,
              thumbnail: product.thumbnail,
              unitName: product.unit?.name,
            };
            productOptions.push(option);
          }
        });
      }
    });
    return productOptions;
  };

  const getListProductCategorys = async () => {
    var res = await productCategoryDataService.getAllProductCategoriesAsync();
    if (res) {
      setListProductCategory(res.allProductCategories);
    }
  };

  const getListBranches = async () => {
    var res = await branchDataService.getAllBranchsAsync();
    if (res) {
      setListbranches(res.branchs);
      onSelectAllBranches(true, res.branchs);
    }
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
      history.push("/store/promotion/discountCode");
    }, DELAYED_TIME);
  };

  const onSelectBranches = (values) => {
    const listBranch = listbranches.filter((b) => values.find((v) => v === b.id));
    if (values && values.length > 0) {
      let formValues = form.getFieldsValue();
      let branchIds = [];
      branchIds = listBranch?.map((item) => item?.id);

      form.setFieldsValue({ ...formValues, discountCode: { branchIds: branchIds } });
    }
  };

  const onSelectAllBranches = (isChecked, listbranches) => {
    setIsAllBranches(isChecked);
    let branchIds = [];
    if (isChecked) {
      branchIds = listbranches?.map((item) => item?.id);
      onSelectBranches(branchIds);
      let formValue = {
        discountCode: {
          branchIds: branchIds,
        },
      };
      form.setFieldsValue(formValue);
    }
  };

  const onChangePlatform = (values) => {
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;
    discountCode.platformIds = values;
    form.setFieldsValue(formValue);
  };

  /**
   * Disable Hour From Start Time
   */

  const getDisabledHoursStartTime = () => {
    var hours = [];
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;
    var discountCodeDate = new Date(
      moment(discountCode?.startDate).year(),
      moment(discountCode?.startDate).month(),
      moment(discountCode?.startDate).date(),
    );
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (discountCodeDate.toDateString() === currentDate.toDateString()) {
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
    let { discountCode } = formValue;
    var discountCodeDate = new Date(
      moment(discountCode?.startDate).year(),
      moment(discountCode?.startDate).month(),
      moment(discountCode?.startDate).date(),
    );
    var currentDate = new Date(moment().year(), moment().month(), moment().date());
    if (discountCodeDate.toDateString() === currentDate.toDateString()) {
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
    let { discountCode } = formValue;

    var discountCodeStartDate = new Date(
      moment(discountCode?.startDate).year(),
      moment(discountCode?.startDate).month(),
      moment(discountCode?.startDate).date(),
    );
    var discountCodeEndDate = new Date(
      moment(discountCode?.endDate).year(),
      moment(discountCode?.endDate).month(),
      moment(discountCode?.endDate).date(),
    );

    if (discountCodeEndDate <= discountCodeStartDate) {
      for (var i = 0; i < moment(discountCode.startTime).hour(); i++) {
        hours.push(i);
      }
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
    let { discountCode } = formValue;

    var discountCodeStartDate = new Date(
      moment(discountCode?.startDate).year(),
      moment(discountCode?.startDate).month(),
      moment(discountCode?.startDate).date(),
    );
    var discountCodeEndDate = new Date(
      moment(discountCode?.endDate).year(),
      moment(discountCode?.endDate).month(),
      moment(discountCode?.endDate).date(),
    );

    if (discountCodeEndDate <= discountCodeStartDate) {
      if (selectedHour === moment(discountCode.startTime).hour()) {
        for (var i = 0; i <= moment(discountCode.startTime).minute(); i++) {
          minutes.push(i);
        }
      }
    }
    return minutes;
  };

  const setStartTime = (value) => {
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;
    discountCode.startTime = value;
    form.setFieldsValue(formValue);
  };

  const setEndTime = (value) => {
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;
    discountCode.endTime = value;
    form.setFieldsValue(formValue);
  };

  const onGenerateDiscountCode = async () => {
    let res = await discountCodeDataService.generateDiscountCodeByStoreId();
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;
    discountCode.code = res?.discountCode;
    form.setFieldsValue(formValue);
  };

  const onChangeDiscountCode = (e) => {
    let formValue = form.getFieldsValue();
    let { discountCode } = formValue;
    discountCode.code = fileNameNormalize(e.target.value);
    form.setFieldsValue(formValue);
  };

  const onChangeLimitNumberCouponUse = (checked) => {
    setIsLimitNumberCouponUse(checked);
    let discountCode = form.getFieldValue("discountCode");
    if (checked === true && discountCode?.maximumLimitCouponUse === undefined) {
      // Set default value for maximumLimitCouponUse when user check the first time
      discountCode.maximumLimitCouponUse = 1;
    }
    form.setFieldValue("discountCode", discountCode);
  };

  const onSelectAllCustomer = (isChecked) => {
    setIsAllCustomers(isChecked);
    if (isChecked) {
      setShowCountCustomerSegment(false);
    } else {
      onUpdateCustomerSegment([]);
      let formValue = form.getFieldsValue();
      let { discountCode } = formValue;
      discountCode.listCustomerSegmentId = [];
      form.setFieldsValue(formValue);
    }
  };

  const onChangeOption = (e) => {
    const isChecked = e.target.checked;
    if (discountCodeTypeId === PromotionType.DiscountProductCategory) {
      setIsApplyAllCategories(isChecked);
    }
    if (discountCodeTypeId === PromotionType.DiscountProduct) {
      setIsApplyAllProducts(isChecked);
    }
  };

  const onSelectProductPrice = (e, options) => {
    setProductIds(new Set(options.map((option) => option.productId)));
  };
  const renderSelectProducts = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.form.product}
          <span className="text-danger">*</span>
        </h4>
        <div className="check-box-select-all">
          <Checkbox onChange={(event) => onChangeOption(event)} checked={isApplyAllProducts}>
            {pageData.form.allProduct}
          </Checkbox>
        </div>
        {isApplyAllProducts ? (
          <Form.Item hidden={!isApplyAllProducts} className="w-100">
            <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
          </Form.Item>
        ) : (
          <Form.Item
            hidden={isApplyAllProducts}
            name={["discountCode", "productPriceIds"]}
            className="w-100"
            rules={[
              {
                required: !isApplyAllProducts,
                message: pageData.form.pleaseSelectProduct,
              },
            ]}
          >
            <FnbSelectMultipleProductRenderOption
              placeholder={pageData.form.selectProduct}
              className="w-100 ant-form-item"
              allowClear
              filterOption={(input, option) => {
                if (typeof option?.label == "string") {
                  const inputStr = input.removeVietnamese();
                  const productName = option?.label?.removeVietnamese();
                  return productName?.trim().toLowerCase().indexOf(inputStr.trim().toLowerCase()) >= 0;
                }
              }}
              selectOption={renderProductSpecificOptions()}
              listHeight={700}
              onChange={(e, option) => onSelectProductPrice(e, option)}
            ></FnbSelectMultipleProductRenderOption>
          </Form.Item>
        )}
      </>
    );
  };
  const renderProductSpecificOptions = () => {
    let options = [];
    let allProducts = listProduct;

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
              label={optionData?.text}
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
              label={optionData?.text}
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

  const renderSelectCategorys = () => {
    return (
      <>
        <h4 className="fnb-form-label">
          {pageData.form.productCategory}
          <span className="text-danger">*</span>
        </h4>
        <div className="check-box-select-all">
          <Checkbox onChange={(event) => onChangeOption(event)} checked={isApplyAllCategories}>
            {pageData.form.allCategories}
          </Checkbox>
        </div>
        <Form.Item
          hidden={isApplyAllCategories}
          name={["discountCode", "productCategoryIds"]}
          className="w-100"
          rules={[
            {
              required: !isApplyAllCategories,
              message: pageData.form.pleaseSelectProductCategory,
            },
          ]}
        >
          <FnbSelectMultiple
            placeholder={pageData.form.selectProductCategory}
            className="w-100"
            allowClear
            option={listProductCategory?.map((item) => ({
              id: item.id,
              name: item.name,
            }))}
          ></FnbSelectMultiple>
        </Form.Item>
        <Form.Item hidden={!isApplyAllCategories} className="w-100">
          <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <Form
        onFinish={onCreateNewDiscountCode}
        form={form}
        onFieldsChange={() => setIsChangeForm(true)}
        layout="vertical"
        autoComplete="off"
        className="discount-code-page"
      >
        <Row className="fnb-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <PageTitle className="promotion-guideline-page-title" content={pageData.create} />
            <FnbGuideline
              styles={isMobile ? { maxWidth: 330 } : { maxWidth: 371 }}
              placement={isMobile ? "bottomRight" : "rightTop"}
              title={pageData.guideline.title}
              content={pageData.guideline.content}
              largeButton={true}
            />
          </Col>
          <Col xs={24} sm={24} lg={12} className="m-18">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button type="primary" htmlType="submit">
                      {pageData.btnSave}
                    </Button>
                  ),
                  permission: PermissionKeys.CREATE_DISCOUNT_CODE,
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
                name={["discountCode", "name"]}
                rules={[
                  {
                    required: true,
                    message: pageData.form.pleaseEnterDiscountCodeName,
                  },
                  {
                    type: "string",
                    max: pageData.form.maxLengthName,
                  },
                ]}
                className="w-100"
              >
                <Input
                  className="fnb-input-with-count"
                  showCount
                  maxLength={pageData.form.maxLengthName}
                  placeholder={pageData.form.placeholderName}
                />
              </Form.Item>
            </Row>
            <Row>
              <h4 className="fnb-form-label">
                {pageData.form.applicableType}
                <span className="text-danger">*</span>
              </h4>
              <Form.Item name={["discountCode", "discountCodeTypeId"]} className="w-100">
                <FnbSelectSingle
                  option={ListPromotionType?.map((item) => ({
                    id: item.key,
                    name: t(item.name),
                  }))}
                  onChange={(key) => onChangeDiscountCodeType(key)}
                />
              </Form.Item>
            </Row>
            {discountCodeTypeId === PromotionType.DiscountProduct && renderSelectProducts()}
            {discountCodeTypeId === PromotionType.DiscountProductCategory && renderSelectCategorys()}

            <Row gutter={[32, 16]}>
              <Col xs={24} lg={12}>
                <Input.Group size="large">
                  <h4 className="fnb-form-label">{pageData.form.discountValue}</h4>
                  {isPercentDiscount ? (
                    <Form.Item
                      name={["discountCode", "percentNumber"]}
                      rules={[
                        { required: true, message: pageData.form.pleaseEnterPrecent },
                        {
                          min: 0,
                          max: 100,
                          type: "integer",
                          message: pageData.form.pleaseEnterPrecent,
                        },
                      ]}
                    >
                      <InputNumber
                        id="discountPercent"
                        className="fnb-input-number w-100 discount-amount"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        min={1}
                        max={100}
                        addonAfter={
                          <Form.Item name={["discountCode", "isPercentDiscount"]} style={{ display: "contents" }}>
                            <Radio.Group
                              className="radio-group-discount custom-flex"
                              defaultValue={isPercentDiscount}
                              onChange={(e) => setIsPercentDiscount(e.target.value)}
                            >
                              <Radio.Button value={true} className="percent-option custom-flex-cell">
                                {pageData.form.percent}
                              </Radio.Button>
                              <Radio.Button value={false} className="currency-option custom-flex-cell">
                                {currencyCode}
                              </Radio.Button>
                            </Radio.Group>
                          </Form.Item>
                        }
                        onKeyPress={(event) => {
                          const checkStatus = checkOnKeyPressValidation(event, "discountPercent", 1, 100, 0);
                          if (!checkStatus) event.preventDefault();
                        }}
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name={["discountCode", "maximumDiscountAmount"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseEnterMaxDiscount,
                        },
                        {
                          min: 1,
                          type: "integer",
                          max: pageData.form.maximum,
                          message: pageData.form.pleaseEnterMaxDiscount,
                        },
                      ]}
                    >
                      <InputNumber
                        id="discountAmount"
                        className="w-100 fnb-input-number discount-amount"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        precision={currencyCode === currency.vnd ? 0 : 2}
                        addonAfter={
                          <Form.Item name={["discountCode", "isPercentDiscount"]} style={{ display: "contents" }}>
                            <Radio.Group
                              className="radio-group-discount"
                              defaultValue={isPercentDiscount}
                              onChange={(e) => setIsPercentDiscount(e.target.value)}
                            >
                              <Radio.Button value={true} className="percent-option">
                                {pageData.form.percent}
                              </Radio.Button>
                              <Radio.Button value={false} className="currency-option">
                                {currencyCode}
                              </Radio.Button>
                            </Radio.Group>
                          </Form.Item>
                        }
                        onKeyPress={(event) => {
                          const checkStatus = checkOnKeyPressValidation(
                            event,
                            "discountAmount",
                            1,
                            pageData.form.maximum,
                            currencyCode === currency.vnd ? 0 : 2,
                          );
                          if (!checkStatus) event.preventDefault();
                        }}
                      />
                    </Form.Item>
                  )}
                </Input.Group>
              </Col>
              {isPercentDiscount && (
                <Col xs={24} lg={12}>
                  <h4 className="fnb-form-label">{pageData.form.maxDiscount}</h4>
                  <Form.Item
                    name={["discountCode", "maximumDiscountAmount"]}
                    rules={[
                      {
                        min: 1,
                        type: "integer",
                        max: pageData.form.maximum,
                        message: pageData.form.pleaseEnterMaxDiscount,
                      },
                    ]}
                    className="w-100"
                  >
                    <InputNumber
                      id="maximumDiscountAmount"
                      addonAfter={currencyCode}
                      className="fnb-input-number w-100"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      precision={currencyCode === currency.vnd ? 0 : 2}
                      onKeyPress={(event) => {
                        const checkStatus = checkOnKeyPressValidation(
                          event,
                          "maximumDiscountAmount",
                          1,
                          pageData.form.maximum,
                          currencyCode === currency.vnd ? 0 : 2,
                        );
                        if (!checkStatus) event.preventDefault();
                      }}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>
            <Row gutter={[32, 16]}>
              <Col xs={24} lg={12}>
                <Row>
                  <h4 className="fnb-form-label">
                    {pageData.form.startDate}
                    <span className="text-danger">*</span>
                  </h4>
                </Row>
                <Row className="w-100">
                  <Col xs={14} lg={14} xl={16}>
                    <Form.Item
                      name={["discountCode", "startDate"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseStartDate,
                        },
                      ]}
                    >
                      <DatePicker
                        suffixIcon={<CalendarNewIconBold />}
                        placeholder={pageData.selectDate}
                        className="fnb-date-picker w-100"
                        disabledDate={disabledDate}
                        format={DateFormat.DD_MM_YYYY}
                        onChange={(date) => {
                          setStartDate(date);

                          // Clear end date after select start date if endate < startdate only
                          const formValues = form.getFieldsValue();
                          if (formValues.discountCode?.endDate != null && formValues.discountCode?.endDate < date) {
                            form.setFieldsValue({
                              ...formValues,
                              discountCode: {
                                endDate: null,
                                endTime: null,
                              },
                            });
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={10} lg={10} xl={8} className="padding-left">
                    <Form.Item
                      name={["discountCode", "startTime"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseStartTime,
                        },
                      ]}
                    >
                      <TimePicker
                        disabled={startDate ? false : true}
                        className="fnb-date-picker fnb-date-picker-discount-code fnb-time-picker w-100"
                        popupClassName="fnb-date-time-picker-dropdown"
                        format={"HH:mm"}
                        placeholder={pageData.selectTime}
                        onSelect={(time) => {
                          setStartTime(moment(time, "HH:mm"));
                          // Clear end date after select start date if endate < startdate only
                          const formValues = form.getFieldsValue();
                          let isSameDay =
                            moment(formValues.discountCode?.startDate.toDate()).format("DD/MM/YYYY") ==
                            moment(formValues.discountCode?.endDate.toDate()).format("DD/MM/YYYY");
                          if (
                            formValues.discountCode?.endDate != null &&
                            formValues.discountCode?.endTime < time &&
                            isSameDay
                          ) {
                            form.setFieldsValue({
                              ...formValues,
                              discountCode: {
                                endTime: null,
                              },
                            });
                          }
                        }}
                        showNow={false}
                        showConfirm={false}
                        disabledHours={getDisabledHoursStartTime}
                        disabledMinutes={getDisabledMinutesStartTime}
                        suffixIcon={<ArrowDownDropdown />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} lg={12}>
                <Row>
                  <h4 className="fnb-form-label">{pageData.form.endDate}</h4>
                </Row>
                <Row className="w-100">
                  <Col xs={14} lg={14} xl={16}>
                    <Form.Item
                      name={["discountCode", "endDate"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseEndDate,
                        },
                      ]}
                    >
                      <DatePicker
                        suffixIcon={<CalendarNewIconBold />}
                        placeholder={pageData.selectDate}
                        className="fnb-date-picker w-100"
                        disabledDate={disabledDateByStartDate}
                        format={DateFormat.DD_MM_YYYY}
                        disabled={startDate ? false : true}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={10} lg={10} xl={8} className="padding-left">
                    <Form.Item
                      name={["discountCode", "endTime"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseEndTime,
                        },
                      ]}
                    >
                      <TimePicker
                        disabled={startDate ? false : true}
                        className="fnb-date-picker fnb-date-picker-discount-code fnb-time-picker w-100"
                        popupClassName="fnb-date-time-picker-dropdown"
                        format={"HH:mm"}
                        placeholder={pageData.selectTime}
                        onSelect={(time) => {
                          setEndTime(moment(time, "HH:mm"));
                        }}
                        showNow={false}
                        showConfirm={false}
                        disabledHours={getDisabledHoursEndTime}
                        disabledMinutes={getDisabledMinutesEndTime}
                        suffixIcon={<ArrowDownDropdown />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <h4 className="fnb-form-label">{pageData.form.termsAndConditions}</h4>
              <Form.Item name={["discountCode", "termsAndCondition"]} className="w-100">
                <FnbTextArea showCount maxLength={pageData.form.maxLengthTermsAndConditions} rows={4}></FnbTextArea>
              </Form.Item>
            </Row>
          </Card>
        </Row>
        <Row className="mt-3">
          <Card className="fnb-card w-100">
            <Row>
              <h5 className="title-group">{pageData.form.couponConditions}</h5>
            </Row>
            {discountCodeTypeId === PromotionType.DiscountTotal && (
              <>
                <Row className="mb-2">
                  <Checkbox
                    valuePropName="checked"
                    noStyle
                    onChange={(e) => setIsMinimumPurchaseAmount(e.target.checked)}
                  >
                    <Text>{pageData.form.minimumPurchaseAmountOnBill}</Text>
                  </Checkbox>
                  <Tooltip placement="topLeft" title={pageData.form.minimumAmounttoApplyDiscountCode}>
                    <InfoCircleFlashSaleIcon size={24} />
                  </Tooltip>
                </Row>
                {isMinimumPurchaseAmount && (
                  <Row>
                    <Form.Item
                      name={["discountCode", "minimumPurchaseAmount"]}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseInputValue,
                        },
                      ]}
                      className="w-100"
                    >
                      <InputNumber
                        addonAfter={currencyCode}
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
              </>
            )}
            <h3 className="fnb-form-label mt-16">
              <Checkbox
                defaultChecked={isAllBranches}
                onChange={(event) => onSelectAllBranches(event.target.checked, listbranches)}
              >
                {pageData.form.allBranches}
              </Checkbox>
            </h3>
            <Row>
              <Col span={24} hidden={isAllBranches}>
                <Form.Item
                  name={["discountCode", "branchIds"]}
                  rules={[
                    {
                      required: true,
                      message: pageData.form.pleaseSelectBranch,
                    },
                  ]}
                  className="w-100"
                >
                  <FnbSelectMultiple
                    onChange={(values) => onSelectBranches(values)}
                    placeholder={pageData.form.selectBranches}
                    className="w-100"
                    allowClear
                    option={listbranches?.map((item) => ({
                      id: item.id,
                      name: t(item.name),
                    }))}
                  ></FnbSelectMultiple>
                </Form.Item>
              </Col>
              <Col span={24} hidden={!isAllBranches}>
                <Form.Item name="tmpBranchIds">
                  <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
                </Form.Item>
              </Col>
            </Row>

            <Checkbox defaultChecked={isAllCustomers} onChange={(event) => onSelectAllCustomer(event.target.checked)}>
              {pageData.form.allCustomers}
            </Checkbox>
            {!isAllCustomers ? (
              <Form.Item
                className="select-control mt-2"
                name={["discountCode", "listCustomerSegmentId"]}
                rules={[
                  {
                    required: true,
                    message: pageData.form.customerGroupRequiredMessage,
                  },
                ]}
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  mode="multiple"
                  onChange={(e) => onUpdateCustomerSegment(e)}
                  className={`fnb-select-multiple-customer-segment dont-show-item`}
                  popupClassName="fnb-select-multiple-dropdown"
                  suffixIcon={<ArrowDown />}
                  menuItemSelectedIcon={<CheckboxCheckedIcon />}
                  placeholder={pageData.form.customerGroupPlaceholder}
                  optionFilterProp="children"
                  showArrow
                  showSearch={true}
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  id="fnb-select-multiple-customer-segment"
                  disabled={isAllCustomers}
                >
                  {customerSegmentInSore?.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item className="select-control mt-2">
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  mode="multiple"
                  className={`fnb-select-multiple-customer-segment dont-show-item`}
                  popupClassName="fnb-select-multiple-dropdown"
                  suffixIcon={<ArrowDown />}
                  menuItemSelectedIcon={<CheckboxCheckedIcon />}
                  placeholder={pageData.form.customerGroupPlaceholder}
                  optionFilterProp="children"
                  showArrow
                  showSearch={true}
                  id="fnb-select-multiple-customer-segment"
                  disabled={isAllCustomers}
                ></Select>
              </Form.Item>
            )}
            {showCountCustomerSegment && (
              <div
                className="selected-customer-segment selected-customer-segment-position"
                dangerouslySetInnerHTML={{
                  __html: `${t("discountCode.formCreate.customerSegmentSelected", {
                    totalSegment: totalSegment,
                    totalCustomer: totalCustomer,
                    totalEmail: totalEmail,
                  })}`,
                }}
              ></div>
            )}
            <h4 className="fnb-form-label mb-2 mt-2">{pageData.form.platform}</h4>
            <Form.Item
              name={["discountCode", "platformIds"]}
              rules={[
                {
                  required: true,
                  message: pageData.form.pleaseSelectPlatform,
                },
              ]}
            >
              <Checkbox.Group onChange={onChangePlatform} className="checkbox-group">
                {defaultPlatforms?.map((p, index) => {
                  return (
                    <div className="checkbox-platform">
                      <Checkbox value={p.id}>{p.name}</Checkbox>
                    </div>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
            <Row>
              <Form.Item name={["discountCode", "isIncludedTopping"]} valuePropName="checked">
                <Checkbox onChange={(e) => setIsIncludedTopping(e.target.checked)}>
                  <Text>{pageData.form.includedTopping}</Text>
                </Checkbox>
              </Form.Item>
            </Row>
          </Card>
        </Row>
        <Row className="mt-3">
          <Card className="fnb-card w-100">
            <h5 className="title-group">{pageData.form.code}</h5>
            <h4 className="fnb-form-label mb-2">{pageData.form.usageLimits}</h4>
            <Row className="mb-2">
              <Checkbox
                valuePropName="checked"
                noStyle
                onChange={(e) => onChangeLimitNumberCouponUse(e.target.checked)}
              >
                <Text>{pageData.form.limitNumberOfTimesThisCouponCanBeUsed}</Text>
              </Checkbox>
            </Row>
            {isLimitNumberCouponUse && (
              <Row className="w-100">
                <Col xs={12} lg={8}>
                  <Form.Item
                    name={["discountCode", "maximumLimitCouponUse"]}
                    rules={[
                      { required: true, message: pageData.form.pleaseInputValue },
                      {
                        min: 1,
                        max: 1000,
                        type: "integer",
                        message: pageData.form.pleaseInputValue,
                      },
                    ]}
                  >
                    <InputNumber
                      id="maximumLimitCouponUse"
                      className="fnb-input-number w-100 discount-amount"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      min={1}
                      max={1000}
                      defaultValue={1}
                      onKeyPress={(event) => {
                        const checkStatus = checkOnKeyPressValidation(event, "maximumLimitCouponUse", 1, 1000, 0);
                        if (!checkStatus) event.preventDefault();
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row>
              <Form.Item name={["discountCode", "isLimitOneTimeUse"]}>
                <Checkbox defaultChecked={true} onChange={(e) => setIsLimitOneTimeUse(e.target.checked)}>
                  <Text>{pageData.form.limitOneUsedPerCustomer}</Text>
                </Checkbox>
              </Form.Item>
            </Row>
            <Row>
              <Col xs={24} lg={12}>
                <Row>
                  <h4 className="fnb-form-label">
                    {pageData.form.discountCode}
                    <span className="text-danger">*</span>
                  </h4>
                </Row>
                <Row className="w-100">
                  <Col xs={24} lg={18}>
                    <Form.Item
                      name={["discountCode", "code"]}
                      rules={[
                        {
                          required: true,
                          type: "string",
                          min: 6,
                          max: 20,
                          message: pageData.form.pleaseEnterDiscountCodeOrGenerate,
                        },
                      ]}
                      validateTrigger={onChangeGenerateCode ? "onBlur" : false}
                    >
                      <Input
                        className="fnb-input-with-count code"
                        showCount
                        minLength={6}
                        maxLength={20}
                        onKeyPress={(event) => {
                          if (/\s/g.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        placeholder={pageData.form.enterDiscountCode}
                        onChange={() => setOnnChangeGenerateCode(true)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} lg={6} className="padding-left">
                    <Button
                      type="primary"
                      className="btn-generate-code"
                      icon={<PromoIcon className="icon-btn-promo" />}
                      onClick={onGenerateDiscountCode}
                    >
                      {pageData.form.generateCodes}
                    </Button>
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
        onOk={onCancel}
        isChangeForm={isChangeForm}
      />
    </>
  );
}
