import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Typography,
  Tooltip,
  Checkbox,
  DatePicker,
  Divider,
  Space
} from 'antd';
import { ExclamationIcon } from 'constants/icons.constants';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbDeleteIcon } from 'components/shop-delete-icon/shop-delete-icon'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import { FnbUploadImageComponent } from 'components/shop-upload-image/shop-upload-image.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, inputNumberRangeOneTo999999999, inputNumberRange0To100, inputNumberRange1To999999999, tableSettings } from 'constants/default.constants'
import { DragIcon, IconBtnAdd, TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { currency } from 'constants/string.constants'
import productDataService from "data-services/product/product-data.service";
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router'
import { getValidationMessagesWithParentField, randomGuid, roundNumber } from 'utils/helpers'
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import productCategoryDataService from 'data-services/product-category/product-category-data.service'
import product from '..';
import productCategory from 'pages/product-category';
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple';
import { CalendarNewIconBold } from 'constants/icons.constants';
import { DateFormat } from "constants/string.constants";
import FnbFroalaEditor from "components/shop-froala-editor";
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { BadgeSEOKeyword, SEO_KEYWORD_COLOR_LENGTH } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';
import StockProductTable from '../components/stock-product.component';
import moment from 'moment';

const { Text } = Typography

export default function CreateProductPage() {
  const history = useHistory()

  const [image, setImage] = useState(null)
  const [prices, setPrices] = useState([{
    position: 0,
    priceName: 'Default',
    priceValue: 0,
    priceOriginal: 0,
    priceDiscount: 0,
    quantitySold: 0,
    quantityLeft: 0,
    percentNumber: 0,
    startDate: moment(),
    endDate: moment().add(7, "days")
  }])
  const basePrice = {
    priceOriginal: 150000.00,
    priceValue: 140000.00,
    priceDiscount: 130000.00,
    percentNumber: 0,
    startDate: moment(),
    endDate: moment().add(7, "days"),
  }
  const [listAllProductCategory, setListAllProductCategory] = useState([])
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);
  const [discountChecked, isDisCountChecked] = useState([false]);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 500);
  const [productContent, setProductContent] = useState("");
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)
  useEffect(() => {
    getInitData()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const pageData = {
    title: t('product.addProduct'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.add'),
    btnDiscard: t('button.discard'),
    content: {
      label: t('product.labelProductContent'),
      placeholder: t('product.placeholderProductContent')
    },
    generalInformation: {
      title: t('product.titleInfo'),
      name: {
        label: t('product.labelName'),
        placeholder: t('product.placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('product.validateName')
      },
      description: {
        label: t('product.labelDescription'),
        placeholder: t('product.placeholderDescription'),
        required: false,
        maxLength: 255
      }
    },
    SEOInformation: {
      title: t('form.SEOConfiguration'),
      keyword: {
        label: t('form.SEOKeywords'),
        placeholder: t('form.SEOKeywordsPlaceholder'),
        tooltip: t('form.SEOKeywordsTooltip'),
        btnAdd: t('form.AddSEOKeywords')
      },
      SEOtitle: {
        label: t('form.SEOTitle'),
        placeholder: t('form.SEOTitlePlaceholder'),
        tooltip: t('form.SEOTitleTooltip'),
        validateMessage: t('form.messageMatchSuggestSEOTitle'),
        minlength: 50,
        maxLength: 100
      },
      description: {
        label: t('form.SEODescription'),
        placeholder: t('form.SEODescriptionPlaceholder'),
        validateMessage: t('form.messageMatchSuggestSEODescription'),
        minlength: 150,
        maxLength: 200,
        tooltip: t('form.SEODescriptionTooltip')
      },
    },
    pricing: {
      title: t('product.priceInfo'),
      discountCheck: t('product.labelDiscountCheck'),
      addPrice: t('product.addPrice'),
      price: {
        label: t('product.labelPrice'),
        placeholder: t('product.placeholderPrice'),
        required: true,
        max: 999999999,
        min: 0,
        format: '^[1-9]*$',
        validateMessage: t('product.validatePriceNegative'),
        validateMessageValue: t('product.validateOriginalOverPrice'),
        validateMessageDiscount: t('product.validateDiscountOverPrice')
      },
      priceOriginal: {
        label: t('product.labelPriceOriginal'),
        placeholder: t('product.placeholderPriceOriginal'),
        required: true,
        max: 999999999,
        min: 0,
        format: '^[0-9]*$',
        validateMessage: t('product.validatePriceNegative'),
        validateMessageValue: t('product.validateOriginalOverPrice')
      },
      discount: {
        numeric: {
          label: t('product.labelPriceDiscount'),
          placeholder: t('product.placeholderPriceDiscount'),
          validateMessage: t('product.validateDiscountOverPrice')
        },
        percentage: {
          label: t('product.labelPriceDiscountPercentage'),
          placeholder: t('product.placeholderPriceDiscountPercentage'),
          max: 100,
          min: 0,
          format: '^[0-9]*$',
          validateMessage: t('product.validateDiscountPercentage')
        }
      },
      priceName: {
        label: t('product.labelPriceName'),
        placeholder: t('product.placeholderPriceName'),
        required: true,
        maxLength: 100,
        validateMessage: t('product.validatePriceName')
      },
      quantity: {
        sold: {
          label: t('product.labelQuantitySold'),
          placeholder: t('product.placeholderQuantitySold'),
        },
        remaining: {
          label: t('product.labelQuantityLeft'),
          placeholder: t('product.placeholderQuantityLeft'),
          validateMessage: t('product.validateQuantity')
        }
      },
      priceDate: {
        startDate: {
          label: t('product.startDate'),
          placeholder: t('product.placeholderStartDate'),
          validateMessage: t('product.validateStartDate')
        },
        endDate: {
          label: t('product.endDate'),
          placeholder: t('product.placeholderEndDate'),
          validateMessage: t('product.validateEndDate')
        }
      }
    },
    productCategory: {
      label: t('product.labelCategory'),
      placeholder: t('product.placeholderCategory'),
      validateMessage: t('product.validateProductCategory')
    },
    productNameExisted: t('product.productNameExisted'),
    productAddedSuccess: t('product.productAddedSuccess'),
    mediaNotExisted: t('product.validateImage'),
    file: {
      uploadImage: t('file.uploadImage'),
      title: t('file.title'),
      textNonImage: t('file.textNonImage'),
      // addFromUrl: t('file.addFromUrl'),
      bestDisplayImage: t('file.bestDisplayImage'),
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave')
    },
    table: {
      name: t('table.name'),
      action: t('table.action')
    }
  }

  const getInitData = async () => {
    const resDataInitialCreateProduct = await productCategoryDataService.getAllProductCategoriesAsync();
    if (resDataInitialCreateProduct) {
      const allProductCategories = resDataInitialCreateProduct;
      if (allProductCategories) {
        setListAllProductCategory(allProductCategories);
      }
    }
  }
  // when discount checkbox is unchecked set price discount and percent number to 0
  useEffect(() => {
    discountChecked.forEach((c, index) => {
      if (!c) {
        form.setFieldValue(['product', 'prices', index, 'priceDiscount'], 0);
        form.setFieldValue(['product', 'prices', index, 'percentNumber'], 0);
        setPrices(prevPrices => {
          const updatedPrices = [...prevPrices];
          updatedPrices[index] = {
            ...updatedPrices[index],
            priceDiscount: 0,
            percentNumber: 0
          };
          return updatedPrices;
        });
      }
    })
  }, [discountChecked])
  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const disabledDateByStartDate = (current, price) => {
    // Can not select days before today and today
    return current && current < price.startDate;
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const onSubmitForm = () => {
    form
      .validateFields()
      .then(async (values) => {
        const createProductRequestModel = {
          ...values.product,
          imagePaths: [],
          productPrices: values.product.prices,
          thumbnail: values.product.media.url,
          content: productContent,
          keywordSEO: keywordSEOs.map(kw => kw.value)?.join(',') || null
        }
        console.log(createProductRequestModel)
        productDataService
          .createProductAsync(createProductRequestModel)
          .then((res) => {
            if (res) {
              message.success(pageData.productAddedSuccess);
              setIsChangeForm(false);
              history.push("/product");
            }
          })
          .catch((errs) => {
            form.setFields(getValidationMessagesWithParentField(errs, "product"));
            console.error(errs)
          })

      })
      .catch((errors) => {
        if (errors?.errorFields?.length > 0) {
          const elementId = `basic_${errors?.errorFields[0]?.name.join('_')}_help`
          scrollToElement(elementId)
        }
      })
  }

  const onChangeImage = (file) => {
    setImage(file)
  }

  const onDeletePrice = (index) => {
    const formValue = form.getFieldsValue()
    const { product } = formValue
    if (product.prices.length > 0) {
      product.prices.splice(index, 1)
      product.prices.forEach((item, index) => (item.position = index))
    }
    setPrices(product.prices)
    if (product.prices.length === 1) {
      product.price = product.prices[0].price
      product.prices[0].position = 0
    }
    form.setFieldsValue(formValue)
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    result.forEach((item, index) => (item.position = index))
    return result
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const formValue = form.getFieldsValue()
    const { product } = formValue
    const listPrice = reorder(product.prices, result.source.index, result.destination.index)

    setPrices(listPrice)
    product.prices = listPrice
    form.setFieldsValue(formValue)
  }
  const onClickAddPrice = () => {
    const formValue = form.getFieldsValue()
    const { product } = formValue
    const newPrice = {
      position: prices.length,
      isUseBasePrice: true,
      thumbnail: '',
      priceName: '',
      priceValue: 0,
      priceOriginal: 0,
      priceDiscount: 0,
      percentNumber: 0,
      startDate: moment(),
      endDate: null
    }
    const listPrice = [...(product.prices ?? prices), newPrice]
    product.prices = listPrice
    setPrices(listPrice)
    form.setFieldsValue(formValue)
    setTimeout(() => {
      const dragDropPrices = document.getElementById('dragDropPrices')
      dragDropPrices.scrollTop = dragDropPrices.scrollHeight
    }, 100)
    const discountCheckList = [...discountChecked, false]
    isDisCountChecked(discountCheckList);
  }

  const renderPrices = () => {
    const addPriceButton = (
      <Button
        type="primary"
        icon={<IconBtnAdd className="icon-btn-add-price" />}
        className="btn-add-price"
        onClick={onClickAddPrice}
      >
        {pageData.pricing.addPrice}
      </Button>
    )
    const multiplePrices = (
      <>
        <DragDropContext className="mt-4" onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="list-price">
                <div
                  id="dragDropPrices"
                  style={prices.length >= 3 ? { height: 640, overflowY: 'scroll' } : { minHeight: prices.length * 127 }}
                >
                  <div style={{ minHeight: prices.length * 127 }}>
                    {prices.map((price, index) => {
                      const position = (price.position || 0) + 1
                      return (
                        <Draggable key={price.id} draggableId={position.toString()} index={index}>
                          {(provided) => (
                            <Row
                              className={'mb-4 pointer price-item'}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Col span={24} className="col-title">
                                <DragIcon className="title-center drag-icon" width={38} height={38} />
                                <div className="m-4 title-center position-text">{position + '.'}</div>
                                <Row className="mt-14 w-100">
                                  <Col span={isMobileSize ? 19 : 22}>
                                    <Row gutter={[0, 16]}>
                                      <Col span={8}>
                                        <h3>{pageData.pricing.priceName.label}</h3>
                                      </Col>
                                      <Col span={8}>
                                        <h3>Hình ảnh</h3>
                                      </Col>
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'position']}
                                          hidden={true}
                                        >
                                          <Input />
                                        </Form.Item>
                                        <Form.Item name={['product', 'prices', price.position, 'id']} hidden={true}>
                                          <Input />
                                        </Form.Item>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'priceName']}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.priceName.validateMessage
                                            }
                                          ]}
                                          value={price.priceName}
                                        >
                                          <Input
                                            className="shop-input"
                                            placeholder={pageData.pricing.priceName.placeholder}
                                            maxLength={pageData.pricing.priceName.maxLength}
                                            id={`product-prices-${price.position}-name`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Row className={`non-image ${image !== null ? 'have-image' : ''}`}>
                                          <Col span={24} className={`image-product ${image !== null ? 'justify-left' : ''}`}>
                                            <div style={{ display: 'flex' }}>
                                              <Form.Item
                                                name={['product', 'prices', price.position, 'thumbnail']}
                                                rules={[{
                                                  required: true,
                                                  message: pageData.mediaNotExisted
                                                }]}
                                              >
                                                <FnbUploadImageComponent
                                                  buttonText={pageData.file.uploadImage}
                                                  onChange={onChangeImage}
                                                />
                                              </Form.Item>
                                            </div>
                                          </Col>
                                          <Col
                                            span={24}
                                            className="create-edit-product-text-non-image"
                                            hidden={image !== null}
                                          >
                                            <Text disabled>
                                              {pageData.file.textNonImage}
                                              <br />
                                              {pageData.file.bestDisplayImage}
                                            </Text>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col span={isMobileSize ? 5 : 2} className="icon-delete-price">
                                    <a
                                      className="m-2"
                                      onClick={() => onDeletePrice(price.position)}
                                    >
                                      <FnbDeleteIcon />
                                    </a>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          )}
                        </Draggable>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Col span={24}>
          <div className="mt-2">
            {addPriceButton}
          </div>
        </Col>
      </>
    )

    return (
      <>
        {multiplePrices}
      </>
    )
  }

  const changeForm = (e) => {
    setIsChangeForm(true)
    setDisableCreateButton(false)
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
      return history.push('/product')
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/product')
    }, DELAYED_TIME)
  }

  const updateDimensions = () => {
    setIsMobileSize(window.innerWidth < 500)
  }
  const addSEOKeywords = (e) => {
    e.preventDefault();
    setKeywordSEOList(list => !list.find(kw => kw.id === keywordSEO.id) && keywordSEO.value !== '' ? [...list, keywordSEO] : [...list]);
    setKeywordSEO({ id: '', value: '' });
    setIsKewwordSEOChange(false)
  }
  const removeSEOKeyword = (keyword) => {
    setKeywordSEOList(list => list.filter(kw => kw.id !== keyword.id));
  }
  return (
    <>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="shop-form-item-btn">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={disableCreateButton}
                    icon={<IconBtnAdd className="icon-btn-add-product" />}
                    className="btn-add-product"
                    onClick={onSubmitForm}
                  >
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.CREATE_PRODUCT
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null
              }
            ]}
          />
        </Col>
      </Row>
      <Form
        form={form}
        name="basic"
        initialValues={{
          product: {
            prices: {
              [0]: {
                priceName: 'Default',
                quantitySold: 0,
                position: 0,
                priceValue: 0,
                priceOriginal: 0,
                priceDiscount: 0,
                percentNumber: 0,
                startDate: moment(),
                endDate: moment().add(7, "days")
              }
            }
          }
        }}
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
      >
        <div className="col-input-full-width create-product-page">
          <Row className="grid-container-create-product">
            <Col className="left-create-product" xs={24} sm={24} md={24} lg={24}>
              <Card className="w-100 shop-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.generalInformation.title}</h4>

                    <h4 className="shop-form-label">
                      {pageData.generalInformation.name.label}
                      <span className="text-danger">*</span>
                    </h4>
                    <Form.Item
                      name={['product', 'name']}
                      rules={[
                        {
                          required: pageData.generalInformation.name.required,
                          message: pageData.generalInformation.name.validateMessage
                        }
                      ]}
                      validateFirst={true}
                    >
                      <Input
                        showCount
                        className="shop-input-with-count"
                        placeholder={pageData.generalInformation.name.placeholder}
                        maxLength={pageData.generalInformation.name.maxLength}
                        id="product-name"
                      />
                    </Form.Item>

                    <h4 className="shop-form-label">{pageData.generalInformation.description.label}</h4>
                    <Form.Item name={['product', 'description']} rules={[]}>
                      <FnbTextArea
                        showCount
                        maxLength={pageData.generalInformation.description.maxLength}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        id="product-description"
                      />
                    </Form.Item>

                    <h4 className="shop-form-label">{pageData.content.label}</h4>
                    <FnbFroalaEditor
                      //value={productContent}
                      onChange={(value) => {
                        if (value !== "" && value !== "<div></div>") setIsChangeForm(true);
                        setProductContent(value);
                      }}
                      placeholder={pageData.content.placeholder}
                      charCounterMax={-1}
                    />
                  </Col>
                </Row>
              </Card>
              <br />
              <Card className="w-100 mt-1 shop-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.SEOInformation.title}</h4>
                    <div className='d-flex'>
                      <h4 className="shop-form-label mt-16">{pageData.SEOInformation.SEOtitle.label}</h4>
                      <Tooltip placement="topLeft" title={pageData.SEOInformation.SEOtitle.tooltip}>
                        <span className="ml-12 mt-16">
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </div>
                    <Form.Item
                      name={['product', 'titleSEO']}
                      className="item-name"
                      rules={[
                        {
                          min: pageData.SEOInformation.SEOtitle.minlength,
                          message: pageData.SEOInformation.SEOtitle.validateMessage
                        }
                      ]}
                    >
                      <Input
                        className="shop-input-with-count"
                        showCount
                        placeholder={pageData.SEOInformation.SEOtitle.placeholder}
                        minLength={pageData.SEOInformation.SEOtitle.minlength}
                        maxLength={pageData.SEOInformation.SEOtitle.maxLength}
                      />
                    </Form.Item>

                    <div className='d-flex'>
                      <h3 className="shop-form-label mt-16">
                        {pageData.SEOInformation.description.label}
                      </h3>
                      <Tooltip placement="topLeft" title={pageData.SEOInformation.description.tooltip}>
                        <span className="ml-12 mt-16">
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </div>
                    <Form.Item
                      name={['product', 'descriptionSEO']}
                      className="item-name"
                      rules={[
                        {
                          min: pageData.SEOInformation.description.minlength,
                          message: pageData.SEOInformation.description.validateMessage
                        }
                      ]}
                    >
                      <FnbTextArea
                        showCount
                        maxLength={pageData.SEOInformation.description.maxLength}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        id="product-category-SEO-description"
                        placeholder={pageData.SEOInformation.description.placeholder}
                      ></FnbTextArea>
                    </Form.Item>

                    <div className='d-flex'>
                      <h3 className="shop-form-label mt-16">
                        {pageData.SEOInformation.keyword.label}
                      </h3>
                      <Tooltip placement="topLeft" title={pageData.SEOInformation.keyword.tooltip}>
                        <span className="ml-12 mt-16">
                          <ExclamationIcon />
                        </span>
                      </Tooltip>
                    </div>

                    <div>
                      {
                        keywordSEOs.length > 0 ? <BadgeSEOKeyword onClose={removeSEOKeyword} keywords={keywordSEOs} /> : ''
                      }

                      <div className='d-flex mt-3'>
                        <Input
                          className="shop-input-with-count"
                          showCount
                          value={keywordSEO?.value || ''}
                          placeholder={pageData.SEOInformation.keyword.placeholder}
                          onChange={e => {
                            if (e.target.value !== '') {
                              setKeywordSEO({
                                id: e.target.value,
                                value: e.target.value,
                                colorIndex: Math.floor(Math.random() * SEO_KEYWORD_COLOR_LENGTH)
                              })
                              setIsKewwordSEOChange(true)
                            }
                          }}
                        />
                        <ShopAddNewButton
                          permission={PermissionKeys.CREATE_PRODUCT_CATEGORY}
                          disabled={!isKeywordSEOChange}
                          text={pageData.SEOInformation.keyword.btnAdd}
                          className={'mx-4'}
                          onClick={addSEOKeywords}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
              <br />
              <Card className="w-100 mt-1 shop-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.pricing.title}</h4>
                    {renderPrices()}
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* right-side of form */}

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 shop-card h-auto">
                    <h4 className="title-group">{pageData.file.title}</h4>
                    <Row className={`non-image ${image !== null ? 'have-image' : ''}`}>
                      <Col span={24} className={`image-product ${image !== null ? 'justify-left' : ''}`}>
                        <div style={{ display: 'flex' }}>
                          <Form.Item
                            name={['product', 'media']}
                            rules={[{
                              required: true,
                              message: pageData.mediaNotExisted
                            }]}
                          >
                            <FnbUploadImageComponent
                              buttonText={pageData.file.uploadImage}
                              onChange={onChangeImage}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col
                        span={24}
                        className="create-edit-product-text-non-image"
                        hidden={image !== null}
                      >
                        <Text disabled>
                          {pageData.file.textNonImage}
                          <br />
                          {pageData.file.bestDisplayImage}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br />
                  <Card className="w-100 mt-1 shop-card h-auto">
                    <h4 className="title-group">{pageData.productCategory.label}</h4>
                    <Form.Item
                      name={['product', 'productCategoryIds']}
                      rules={[{
                        required: true,
                        message: pageData.productCategory.validateMessage
                      }]}
                    >
                      <FnbSelectMultiple
                        placeholder={pageData.productCategory.placeholder}

                        showSearch
                        option={listAllProductCategory?.map((b) => ({
                          id: b.id,
                          name: b.name
                        }))}
                      />

                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <br />
          <Row>
            <Card className="w-100 mt-1 shop-card h-auto">
              <StockProductTable basePrice={basePrice} changeForm={changeForm} />
            </Card>
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.confirmLeave}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
