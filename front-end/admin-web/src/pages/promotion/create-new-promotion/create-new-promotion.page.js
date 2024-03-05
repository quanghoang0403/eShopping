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
  Tooltip,
  Typography
} from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbGuideline } from 'components/shop-guideline/shop-guideline.component'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { CalendarNewIconBold, InfoCircleIcon } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ListPromotionType, PromotionType } from 'constants/promotion.constants'
import { currency, DateFormat } from 'constants/string.constants'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { checkOnKeyPressValidation, formatCurrencyWithSymbol, getEndDate, getStartDate } from 'utils/helpers'
import '../promotion.scss'
import { useTranslation } from 'react-i18next'
import { images } from 'constants/images.constants'
import { FnbSelectMultipleProductRenderOption } from 'components/shop-select-multiple-product-render-option/shop-select-multiple-product-render-option'
const { Text } = Typography
const { Option, OptGroup } = Select

export default function CreateNewPromotionManagement (props) {
  const [form] = Form.useForm()
  const [isChangeForm, setIsChangeForm] = useState(false)
  const { t } = useTranslation()
  const {
    productDataService,
    productCategoryDataService,
    storeDataService,
    promotionDataService,
    history
  } = props

  const [startDate, setStartDate] = useState(null)
  const [promotionTypeId, setPromotionTypeId] = useState(0)
  const [listProduct, setListProduct] = useState([])
  const [listProductCategory, setListProductCategory] = useState([])
  const [isPercentDiscount, setIsPercentDiscount] = useState(true)
  const [currencyCode, setCurrencyCode] = useState(null)
  const [isMinimumPurchaseAmount, setIsMinimumPurchaseAmount] = useState(false)
  const [isIncludedTopping, setIsIncludedTopping] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isApplyAllProducts, setIsApplyAllProducts] = useState(false)
  const [isApplyAllCategories, setIsApplyAllCategories] = useState(false)
  const [restProductPriceOptions, setRestAllProductPriceOptions] = useState([])
  const [productIds, setProductIds] = useState([])
  const pageData = {
    create: t('promotion:create'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnDiscard: t('button.discard'),
    createPromotionSuccess: t('promotion:createPromotionSuccess'),
    selectDate: t('promotion:selectDate'),
    discount: {
      total: t('promotion:discountTotal'),
      product: t('promotion:discountProduct'),
      productCategory: t('promotion:discountProductCategory')
    },
    form: {
      general: t('promotion:general'),
      name: t('promotion:name'),
      placeholderName: t('promotion:placeholderName'),
      maxLengthName: 100,
      pleaseEnterPromotionName: t('promotion:pleaseEnterPromotionName'),
      promotionType: t('promotion:promotionType'),
      selectPromotionType: t('promotion:selectPromotionType'),
      pleaseSelectPromotionType: t('promotion:pleaseSelectPromotionType'),
      product: t('promotion:product'),
      selectProduct: t('promotion:selectProduct'),
      pleaseSelectProduct: t('promotion:pleaseSelectProduct'),
      productCategory: t('promotion:productCategory'),
      selectProductCategory: t('promotion:selectProductCategory'),
      pleaseSelectProductCategory: t('promotion:pleaseSelectProductCategory'),
      percent: '%',
      discountValue: t('promotion:discountValue'),
      pleaseEnterPrecent: t('promotion:pleaseEnterPrecent'),
      maxDiscount: t('promotion:maxDiscount'),
      pleaseEnterMaxDiscount: t('promotion:pleaseEnterMaxDiscount'),
      startDate: t('promotion:startDate'),
      PleaseStartDate: t('promotion:pleaseStartDate'),
      endDate: t('promotion:endDate'),
      PlaceholderDateTime: t('promotion:placeholderDateTime'),
      termsAndConditions: t('promotion:termsAndConditions'),
      maxLengthTermsAndConditions: 2000,
      maximum: 999999999,
      condition: {
        title: t('promotion:titleCondition'),
        checkboxPurchaseAmount: t('promotion:checkboxPurchaseAmount'),
        pleaseEnterMinimum: t('promotion:pleaseEnterMinimum')
      },
      allProduct: t('common.allProducts'),
      allCategories: t('common.allCategories')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    },
    guideline: {
      title: t('promotion:titleGuideline'),
      content: t('promotion:contentGuideline')
    }
  }

  useEffect(() => {
    getCurrency()
    setDataOnForm()
  }, [])

  const setDataOnForm = () => {
    const formValue = form.getFieldsValue()
    const { promotion } = formValue
    promotion.isPercentDiscount = true
    promotion.promotionTypeId = PromotionType.DiscountTotal
    form.setFieldsValue(formValue)
  }

  const getCurrency = async () => {
    const currencyCode = await storeDataService.getCurrencyByStoreId()
    setCurrencyCode(currencyCode)
  }

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf('day')
  }

  const disabledDateByStartDate = (current) => {
    // Can not select days before today and today
    return current && current < startDate
  }

  const onCreateNewPromotion = async (values) => {
    const { promotion } = values
    promotion.isMinimumPurchaseAmount = isMinimumPurchaseAmount
    promotion.isIncludedTopping = isIncludedTopping
    promotion.isApplyAllCategories = isApplyAllCategories
    promotion.isApplyAllProducts = isApplyAllProducts
    promotion.productIds = [...productIds]
    const formValues = {
      ...values,
      promotion: {
        ...promotion,
        startDate: getStartDate(promotion.startDate),
        endDate: getEndDate(promotion.endDate)
      }
    }
    const res = await promotionDataService.createPromotionAsync(formValues)
    if (res) {
      onCancel()
      message.success(pageData.createPromotionSuccess)
    }
  }

  const onChangePromotionType = (key) => {
    setPromotionTypeId(key)
    if (key === PromotionType.DiscountProduct) {
      getListProducts()
    } else if (key === PromotionType.DiscountProductCategory) {
      getListProductCategorys()
    }
  }

  const getListProductCategorys = async () => {
    const res = await productCategoryDataService.getAllProductCategoriesAsync()
    if (res) {
      setListProductCategory(res.allProductCategories)
    }
  }

  const getListProducts = async () => {
    const res = await productDataService.getAllProductsAsync()
    if (res) {
      setListProduct(res.products)
      const productDataOptions = getProductDataOptions(res.products)
      setRestAllProductPriceOptions(productDataOptions)
    }
  }

  const getProductDataOptions = (products) => {
    const productOptions = []
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
              unitName: product.unit?.name
            }
            productOptions.push(option)
          }
        })
      }
    })
    return productOptions
  }

  const clickCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      onCancel()
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onCancel = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      history.push('/store/promotion/discount')
    }, DELAYED_TIME)
  }

  const onChangeOption = (e) => {
    const isChecked = e.target.checked
    if (promotionTypeId === PromotionType.DiscountProductCategory) {
      setIsApplyAllCategories(isChecked)
    }
    if (promotionTypeId === PromotionType.DiscountProduct) {
      setIsApplyAllProducts(isChecked)
    }
  }

  const onSelectProductPrice = (e, options) => {
    setProductIds(new Set(options.map(option => option.productId)))
  }

  const renderSelectProducts = () => {
    return (
      <>
        <h4 className="shop-form-label">
          {pageData.form.product}
          <span className="text-danger">*</span>
        </h4>
        <div className="check-box-select-all">
          <Checkbox onChange={(event) => onChangeOption(event)} checked={isApplyAllProducts}>
            {pageData.form.allProduct}
          </Checkbox>
        </div>
        {isApplyAllProducts
          ? (
          <Form.Item hidden={!isApplyAllProducts} className="w-100">
            <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
          </Form.Item>)
          : (
            <Form.Item
              hidden={isApplyAllProducts}
              name={['promotion', 'productPriceIds']}
              className="w-100"
              rules={[
                {
                  required: !isApplyAllProducts,
                  message: pageData.form.pleaseSelectProduct
                }
              ]}
            >
              <FnbSelectMultipleProductRenderOption
                placeholder={pageData.form.selectProduct}
                className="w-100 ant-form-item"
                allowClear
                filterOption={(input, option) => {
                  if (typeof option?.label === 'string') {
                    const inputStr = input.removeVietnamese()
                    const productName = option?.label?.removeVietnamese()
                    return (
                      productName
                        ?.trim()
                        .toLowerCase()
                        .indexOf(inputStr.trim().toLowerCase()) >= 0
                    )
                  }
                }}
                selectOption={renderProductSpecificOptions()}
                listHeight={700}
                onChange={(e, option) => onSelectProductPrice(e, option)}
              ></FnbSelectMultipleProductRenderOption>
            </Form.Item>)}
      </>
    )
  }
  const renderProductSpecificOptions = () => {
    const options = []
    const allProducts = listProduct

    allProducts.sort(function (a, b) {
      const textA = a.name.toUpperCase()
      const textB = b.name.toUpperCase()
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })
    allProducts.forEach((product, index) => {
      const listProductPriceByProductId = restProductPriceOptions.filter(
        (p) => p.productId === product.id
      )
      if (listProductPriceByProductId.length > 1) {
        const groupName = listProductPriceByProductId[0].productName
        const groupThumbnail = listProductPriceByProductId[0].thumbnail
        const groupOptions = []
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
          )

          groupOptions.push(option)
        })

        if (groupOptions.length > 0) {
          const groupOption = (
            <OptGroup
              label={
                <Row className="option-grouped-label">
                  <Col xs={9} sm={9} md={9} lg={2}>
                    <div className="item-group-product-image">
                      <Image
                        preview={false}
                        src={groupThumbnail ?? 'error'}
                        fallback={images.imgDefault}
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
          )
          options.push(groupOption)
        }
      } else {
        const optionData =
          listProductPriceByProductId.length > 0
            ? listProductPriceByProductId[0]
            : null
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
                      src={optionData?.thumbnail ?? 'error'}
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
          )

          options.push(option)
        }
      }
    })

    return options
  }

  const renderSelectCategorys = () => {
    return (
      <>
        <h4 className="shop-form-label">
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
          name={['promotion', 'productCategoryIds']}
          className="w-100"
          rules={[
            {
              required: !isApplyAllCategories,
              message: pageData.form.pleaseSelectProductCategory
            }
          ]}
        >
          <FnbSelectMultiple
            placeholder={pageData.form.selectProductCategory}
            className="w-100"
            allowClear
            option={listProductCategory?.map((item) => ({
              id: item.id,
              name: item.name
            }))}
          ></FnbSelectMultiple>
        </Form.Item>
        <Form.Item hidden={!isApplyAllCategories} className="w-100">
          <FnbSelectMultiple disabled={true}></FnbSelectMultiple>
        </Form.Item>
      </>
    )
  }

  return (
    <>
      <Form
        onFinish={onCreateNewPromotion}
        form={form}
        onFieldsChange={() => setIsChangeForm(true)}
        layout="vertical"
        autoComplete="off"
      >
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <PageTitle className="promotion-guideline-page-title" content={pageData.create} />
            <FnbGuideline placement="leftTop" title={pageData.guideline.title} content={pageData.guideline.content} />
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
                  permission: PermissionKeys.CREATE_PROMOTION
                },
                {
                  action: (
                    <p className="shop-text-action-group mr-3 action-cancel" onClick={clickCancel}>
                      {pageData.btnCancel}
                    </p>
                  ),
                  permission: null
                }
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Card className="shop-card w-100">
            <Row>
              <h3 className="label-information">{pageData.form.general}</h3>
            </Row>
            <Row>
              <h4 className="shop-form-label mt-32">
                {pageData.form.name}
                <span className="text-danger">*</span>
              </h4>
              <Form.Item
                name={['promotion', 'name']}
                rules={[
                  {
                    required: true,
                    message: pageData.form.pleaseEnterPromotionName
                  },
                  {
                    type: 'string',
                    max: 100
                  }
                ]}
                className="w-100"
              >
                <Input
                  className="shop-input-with-count"
                  showCount
                  maxLength={pageData.form.maxLengthName}
                  placeholder={pageData.form.placeholderName}
                />
              </Form.Item>
            </Row>
            <Row>
              <h4 className="shop-form-label">
                {pageData.form.promotionType}
                <span className="text-danger">*</span>
              </h4>
              <Form.Item
                name={['promotion', 'promotionTypeId']}
                rules={[
                  {
                    required: true,
                    message: pageData.form.pleaseSelectPromotionType
                  }
                ]}
                className="w-100"
              >
                <FnbSelectSingle
                  option={ListPromotionType?.map((item) => ({
                    id: item.key,
                    name: t(item.name)
                  }))}
                  onChange={(key) => onChangePromotionType(key)}
                />
              </Form.Item>
            </Row>
            {promotionTypeId === PromotionType.DiscountProduct && (
              renderSelectProducts()
            )}
            {promotionTypeId === PromotionType.DiscountProductCategory && (
              renderSelectCategorys()
            )}

            <Row gutter={[32, 16]}>
              <Col xs={24} lg={12}>
                <Input.Group size="large">
                  <h4 className="shop-form-label">{pageData.form.discountValue}</h4>
                  {isPercentDiscount
                    ? (
                    <Form.Item
                      name={['promotion', 'percentNumber']}
                      rules={[
                        { required: true, message: pageData.form.pleaseEnterPrecent },
                        {
                          min: 0,
                          max: 100,
                          type: 'integer',
                          message: pageData.form.pleaseEnterPrecent
                        }
                      ]}
                    >
                      <InputNumber
                        id="discountPercent"
                        className="shop-input-number w-100 discount-amount"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        min={1}
                        max={100}
                        addonAfter={
                          <Form.Item name={['promotion', 'isPercentDiscount']} style={{ display: 'contents' }}>
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
                          const checkStatus = checkOnKeyPressValidation(event, 'discountPercent', 1, 100, 0)
                          if (!checkStatus) event.preventDefault()
                        }}
                      />
                    </Form.Item>
                      )
                    : (
                    <Form.Item
                      name={['promotion', 'maximumDiscountAmount']}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.pleaseEnterMaxDiscount
                        },
                        {
                          min: 0,
                          type: 'integer',
                          max: pageData.form.maximum,
                          message: pageData.form.pleaseEnterMaxDiscount
                        }
                      ]}
                    >
                      <InputNumber
                        id="discountAmount"
                        className="w-100 shop-input-number discount-amount"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        precision={currencyCode === currency.vnd ? 0 : 2}
                        min={1}
                        addonAfter={
                          <Form.Item name={['promotion', 'isPercentDiscount']} style={{ display: 'contents' }}>
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
                            'discountAmount',
                            1,
                            pageData.form.maximum,
                            currencyCode === currency.vnd ? 0 : 2
                          )
                          if (!checkStatus) event.preventDefault()
                        }}
                      />
                    </Form.Item>
                      )}
                </Input.Group>
              </Col>
              {isPercentDiscount && (
                <Col xs={24} lg={12}>
                  <h4 className="shop-form-label">{pageData.form.maxDiscount}</h4>
                  <Form.Item
                    name={['promotion', 'maximumDiscountAmount']}
                    rules={[
                      {
                        min: 0,
                        type: 'integer',
                        max: pageData.form.maximum,
                        message: pageData.form.pleaseEnterMaxDiscount
                      }
                    ]}
                    className="w-100"
                  >
                    <InputNumber
                      id="maximumDiscountAmount"
                      addonAfter={currencyCode}
                      className="shop-input-number w-100"
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                      precision={currencyCode === currency.vnd ? 0 : 2}
                      onKeyPress={(event) => {
                        const checkStatus = checkOnKeyPressValidation(
                          event,
                          'maximumDiscountAmount',
                          0,
                          pageData.form.maximum,
                          currencyCode === currency.vnd ? 0 : 2
                        )
                        if (!checkStatus) event.preventDefault()
                      }}
                    />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Row gutter={[32, 16]}>
              <Col xs={24} lg={12}>
                <h4 className="shop-form-label">{pageData.form.startDate}</h4>
                <Form.Item
                  name={['promotion', 'startDate']}
                  rules={[
                    {
                      required: true,
                      message: pageData.form.PleaseStartDate
                    }
                  ]}
                >
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={pageData.selectDate}
                    className="shop-date-picker w-100"
                    disabledDate={disabledDate}
                    format={DateFormat.DD_MM_YYYY}
                    onChange={(date) => {
                      setStartDate(date)

                      // Clear end date after select start date if endate < startdate only
                      const formValues = form.getFieldsValue()
                      if (formValues.promotion?.endDate != null && formValues.promotion?.endDate < date) {
                        form.setFieldsValue({
                          ...formValues,
                          promotion: {
                            endDate: null
                          }
                        })
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <h4 className="shop-form-label">{pageData.form.endDate}</h4>
                <Form.Item name={['promotion', 'endDate']}>
                  <DatePicker
                    suffixIcon={<CalendarNewIconBold />}
                    placeholder={pageData.selectDate}
                    className="shop-date-picker w-100"
                    disabledDate={disabledDateByStartDate}
                    format={DateFormat.DD_MM_YYYY}
                    disabled={!startDate}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <h4 className="shop-form-label">{pageData.form.termsAndConditions}</h4>
              <Form.Item name={['promotion', 'termsAndCondition']} className="w-100">
                <FnbTextArea showCount maxLength={pageData.form.maxLengthTermsAndConditions} rows={4}></FnbTextArea>
              </Form.Item>
            </Row>
          </Card>
        </Row>
        <Row className="mt-3">
          <Card className="shop-card w-100">
            <Row>
              <h5 className="title-group">{pageData.form.condition.title}</h5>
            </Row>
            {promotionTypeId === PromotionType.DiscountTotal && (
              <>
                <Row className="mb-2">
                  <Checkbox
                    valuePropName="checked"
                    noStyle
                    onChange={(e) => setIsMinimumPurchaseAmount(e.target.checked)}
                  >
                    <Text>{pageData.form.condition.checkboxPurchaseAmount}</Text>
                  </Checkbox>
                </Row>
                {isMinimumPurchaseAmount && (
                  <Row>
                    <Form.Item
                      name={['promotion', 'minimumPurchaseAmount']}
                      rules={[
                        {
                          required: true,
                          message: pageData.form.condition.pleaseEnterMinimum
                        }
                      ]}
                      className="w-100"
                    >
                      <InputNumber
                        className="w-100 shop-input-number"
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        precision={currencyCode === currency.vnd ? 0 : 2}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                      />
                    </Form.Item>
                  </Row>
                )}
              </>
            )}
          </Card>
        </Row>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscard}
        onOk={onCancel}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
