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
import ActionButtonGroup from "components/action-button-group/action-button-group.component";
import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import { FnbGuideline } from "components/fnb-guideline/fnb-guideline.component";
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
import { checkOnKeyPressValidation, fileNameNormalize, formatCurrencyWithSymbol, getValidationMessagesWithParentField } from "utils/helpers";
import "./select-product-price.page.scss";
import { FnbSelectMultipleProductRenderOption } from "components/fnb-select-multiple-product-render-option/fnb-select-multiple-product-render-option";
import comboDefaultImage from "assets/images/combo-default-img.jpg";
const { Text } = Typography;
const { Option, OptGroup } = Select;

export default function CreateNewDiscountCode(props) {
  const [t] = useTranslation();
  const { discountCodeTypeId, form } = props;
  const [listProduct, setListProduct] = useState([]);
  const [isApplyAllProducts, setIsApplyAllProducts] = useState(false);
  const [restProductPriceOptions, setRestAllProductPriceOptions] = useState([]);
 
  const pageData = {
    form: {
      allProduct: t("discountCode.formCreate.allProducts"),
      allCategories: t("discountCode.formCreate.allCategories"),
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

  const onChangeOption = (e) => {
    const isChecked = e.target.checked;
    setIsApplyAllProducts(isChecked);
  };

  const onSelectProductPrice = (e, options) => {
    setProductIds(new Set(options.map(option => option.productId)));
  }
  
  const renderProductSpecificOptions = () => {
    let options = [];
    let allProducts = listProduct;

    allProducts.sort(function (a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    allProducts.forEach((product, index) => {
      const listProductPriceByProductId = restProductPriceOptions.filter(
        (p) => p.productId === product.id
      );
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
                        <Col
                          span={24}
                          className="item-product-prices-name text-normal text-line-clamp-2"
                        >
                          <Text>{optionData?.text}</Text>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col
                          span={24}
                          className="item-product-prices-unit text-normal"
                        >
                          <span>{optionData?.unitName}</span>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={4}>
                      <Row>
                        <Col
                          span={24}
                          className="item-product-prices-price-value text-normal"
                        >
                          <span>
                            {formatCurrencyWithSymbol(optionData?.productPrice)}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={0}
                  className="option-item-responsive"
                >
                  <div className="option-grouped-item-responsive">
                    <Row align="middle">
                      <Col
                        span={24}
                        className="item-grouped-responsive-product-name text-normal text-line-clamp-2"
                      >
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
                        <Text>
                          {formatCurrencyWithSymbol(optionData?.productPrice)}
                        </Text>
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
                      <Image
                        preview={false}
                        src={groupThumbnail ?? "error"}
                        fallback={comboDefaultImage}
                      />
                    </div>
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={22}>
                    <div className="item-group-product-name text-line-clamp-2">
                      <span>{groupName}</span>
                    </div>
                  </Col>
                  <Col xs={15} sm={15} md={15} lg={0}>
                    <div className="option-grouped-label-responsive">
                      {groupName}
                    </div>
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
        const optionData =
          listProductPriceByProductId.length > 0
            ? listProductPriceByProductId[0]
            : null;
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
                    <Image
                      preview={false}
                      src={optionData?.thumbnail ?? "error"}
                      fallback={comboDefaultImage}
                    />
                  </div>
                </Col>
                <Col xs={0} sm={0} md={0} lg={22}>
                  <Row>
                    <Col span={16}>
                      <Row>
                        <Col
                          span={24}
                          className="item-product-name text-bold text-line-clamp-2"
                        >
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
                        <Col
                          span={24}
                          className="item-product-price text-normal"
                        >
                          <span>
                            {formatCurrencyWithSymbol(optionData?.productPrice)}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={15}
                  sm={15}
                  md={15}
                  lg={0}
                  className="option-item-responsive"
                >
                  <div className="option-group-item-responsive">
                    <Row align="middle">
                      <Col
                        span={24}
                        className="item-responsive-product-name text-bold text-line-clamp-2"
                      >
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
                        <Text>
                          {formatCurrencyWithSymbol(optionData?.productPrice)}
                        </Text>
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
        </Form.Item>) :
        (
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
                const inputStr = input.removeVietnamese();
                const productName = option?.value?.removeVietnamese();
                return (
                  productName
                    ?.trim()
                    .toLowerCase()
                    .indexOf(inputStr.trim().toLowerCase()) >= 0
                );
              }}
              selectOption={renderProductSpecificOptions()}
              listHeight={700}
              onChange={(e, option) => onSelectProductPrice(e, option)}
            ></FnbSelectMultipleProductRenderOption>
          </Form.Item>)}
    </>
  );
}
