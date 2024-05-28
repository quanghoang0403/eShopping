import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Tabs,
  Typography,
  Tooltip,
  DatePicker,
  Checkbox,
  Select,
  Divider,
  Space
} from 'antd'
import { CalendarNewIconBold } from 'constants/icons.constants';
import FnbFroalaEditor from 'components/shop-froala-editor';
import { DateFormat } from "constants/string.constants";
import { ExclamationIcon } from 'constants/icons.constants';
import { roundNumber } from 'utils/helpers';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbDeleteIcon } from 'components/shop-delete-icon/shop-delete-icon'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, inputNumberRange1To999999999, inputNumberRangeOneTo999999999, inputNumberRange0To100 } from 'constants/default.constants'
import { DragIcon, IconBtnAdd, TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ProductStatus } from 'constants/product-status.constants'
import { currency } from 'constants/string.constants'
import productDataService from "data-services/product/product-data.service";
import cloneDeep from 'lodash/cloneDeep'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory, useRouteMatch } from 'react-router-dom'
import {
  getApiError,
  getValidationMessagesWithParentField,
  randomGuid
} from 'utils/helpers'
import DeleteProductComponent from '../components/delete-product.component'
import './edit-product.scss'
import { useTranslation } from 'react-i18next'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple'
import moment from 'moment';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { BadgeSEOKeyword, SEO_KEYWORD_COLOR_LENGTH } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';
export default function EditProductPage(props) {
  const history = useHistory()
  const match = useRouteMatch()
  const shopImageSelectRef = React.useRef()
  const { t } = useTranslation()
  const [prices, setPrices] = useState([{}])
  const [listAllProductCategory, setListAllProductCategory] = useState([])
  const [titleName, setTitleName] = useState('')
  const [form] = Form.useForm()
  const [activate, setActivate] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [titleModal, setTitleModal] = useState('')
  const [preventDeleteProduct, setPreventDeleteProduct] = useState({})
  const [statusId, setStatusId] = useState(null)
  const [discountChecked, isDisCountChecked] = useState([false]);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 500)
  const [productContent, setProductContent] = useState('')
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)
  useEffect(() => {
    getInitData()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const pageData = {
    title: t('product:addProduct'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.add'),
    btnDiscard: t('button.discard'),
    btnDelete: t('button.delete'),
    upload: {
      title: t('common.uploadTitle')
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
        maxLength: 200
      }
    },
    content: {
      label: t('product.labelProductContent'),
      placeholder: t('product.placeholderProductContent')
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
      }
    },
    pricing: {
      title: t('product.priceInfo'),
      addPrice: t('product.addPrice'),
      discountCheck: t('product.labelDiscountCheck'),
      price: {
        label: t('product.labelPrice'),
        placeholder: t('product.placeholderPrice'),
        required: true,
        max: 999999999,
        min: 1,
        format: '^[1-9]*$',
        validateMessage: t('product.validatePriceNegative'),
        validateMessageValue: t('product.validateOriginalOverPrice')
      },
      priceOriginal: {
        label: t('product.labelPriceOriginal'),
        placeholder: t('product.placeholderPriceOriginal'),
        required: true,
        max: 999999999,
        min: 1,
        format: '^[1-9]*$',
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
      quantity: {
        sold: {
          label: t('product.labelQuantitySold'),
          placeholder: t('product.placeholderQuantitySold')
        },
        remaining: {
          label: t('product.labelQuantityLeft'),
          placeholder: t('product.placeholderQuantityLeft'),
          validateMessage: t('product.validateQuantity')
        }
      },
      priceName: {
        label: t('product.labelPriceName'),
        placeholder: t('product.placeholderPriceName'),
        required: true,
        maxLength: 100,
        validateMessage: t('product.validatePriceName')
      },
      priceDate: {
        startDate: {
          label: t('product.startDate'),
          placeholder: t('t.product.placeholderStartDate'),
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
    productEditedSuccess: t('product.productEditedSuccess'),
    productDeleteSuccess: t('product.productDeleteSuccess'),
    productDeleteFail: t('product.productDeleteFail'),
    productActivatedSuccess: t('product.productActivatedSuccess'),
    productDeactivatedSuccess: t('product.productDeactivatedSuccess'),
    mediaNotExisted: t('product.validateImage'),
    file: {
      uploadImage: t('file.uploadImage'),
      title: t('file.title'),
      textNonImage: t('file.textNonImage'),
      // addFromUrl: t('file.addFromUrl'),
      bestDisplayImage: t('file.bestDisplayImage')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog.confirmLeaveTitle'),
      confirmLeaveContent: t('dialog.confirmLeaveContent'),
      confirmLeave: t('dialog.confirmLeave'),
      confirmDelete: t('dialog.confirmDelete')
    },
    table: {
      name: t('table.name'),
      action: t('table.action')
    },
    active: t('common.active'),
    inactive: t('common.inactive'),
    activate: t('product.activate'),
    deactivate: t('product.deactivate')
  }
  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  const disabledDateByStartDate = (current, price) => {
    // Can not select days before today and today
    return current && current < price.startDate;
  };
  const getInitData = async () => {
    productDataService.getProductByIdAsync(match?.params?.id).then((data) => {
      setTitleName(data?.name);
      setStatusId(data?.status);
      setProductContent(data?.content)
      if (data?.status === ProductStatus.Activate) {
        setActivate(pageData.deactivate);
      } else {
        setActivate(pageData.activate);
      }
      setListAllProductCategory(data?.productCategories);
      const pricesData = [];
      if (data?.productPrices.length > 0) {
        let discountBoxCheck = Array.from({ length: data?.product?.productPrices.length }, value => false)
        data?.productPrices.map((price, index) => {
          pricesData.push({
            position: index,
            id: price?.id,
            priceName: price?.priceName,
            priceValue: price?.priceValue,
            priceOriginal: price?.priceOriginal,
            priceDiscount: price.priceDiscount ?? 0,
            percentNumber: price?.percentNumber ?? 0,
            quantityLeft: price?.quantityLeft,
            quantitySold: price?.quantitySold,
            startDate: moment(price?.startDate) || moment(),
            endDate: moment(price?.endDate) || null
          });
          discountBoxCheck[index] = (price?.priceDiscount || price?.percentNumber) ? true : false

        });
        isDisCountChecked(discountBoxCheck)
        setPrices(pricesData);
      }
      setKeywordSEOList(list => data?.keywordSEO?.split(',').reduce((acc, curr) => acc.concat({ id: curr, value: curr, colorIndex: Math.floor(Math.random() * SEO_KEYWORD_COLOR_LENGTH) }), []) || [])
      const initData = {
        product: {
          description: data?.description,
          name: data?.name,
          productCategoryIds: data?.productCategories.map(pc => pc.id),
          price: data?.productPrices.length === 1 ? data?.productPrices[0].priceValue : null,
          prices: pricesData,
          titleSEO: data?.titleSEO,
          descriptionSEO: data?.descriptionSEO

        }
      };

      /// Update image
      if (shopImageSelectRef && shopImageSelectRef.current) {
        shopImageSelectRef.current.setImageUrl(data?.thumbnail);
        setSelectedImage(data?.thumbnail);
      }
      form.setFieldsValue(initData);
    });
  }

  const editProduct = () => {
    if (shopImageSelectRef && shopImageSelectRef.current) {
      var imageUrl = shopImageSelectRef.current.getImageUrl()
    }
    form
      .validateFields()
      .then(async (values) => {
        const editProductRequestModel = {
          ...values.product,
          images: [],
          productPrices: values.product.prices,
          Id: match?.params?.id,
          thumbnail: imageUrl,
          status: statusId,
          content: productContent,
          keywordSEO: keywordSEOs.map(kw => kw.value)?.join(',') || null
        }
        console.log(editProductRequestModel)
        if (editProductRequestModel.thumbnail !== '') {
          try {
            productDataService
              .updateProductAsync(editProductRequestModel)
              .then((res) => {
                if (res) {
                  message.success(pageData.productEditedSuccess);
                  onCompleted();
                }
              })
              .catch((errs) => {
                form.setFields(getValidationMessagesWithParentField(errs, "product"));
              });
          } catch (errors) {
            // build error message
            const errorData = getApiError(errors);
            // const errMessage = t(errorData?.message, {
            //   comboName: errorData?.comboName,
            //   productName: errorData?.productName,
            // });

            message.error(errorData);
            getInitData();
          }
        }
        else {
          message.error(pageData.mediaNotExisted)
        }
      })
      .catch((errors) => {
        if (errors?.errorFields?.length > 0) {
          const nameInputFirst = errors?.errorFields[0]?.name.join('-')
          const input = document.getElementById(`${nameInputFirst}`)
          input.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start'
          })
        }
      })
  }

  const onChangeStatus = async () => {
    var res = await productDataService.changeStatusAsync(match?.params?.id);
    if (res) {
      if (statusId === ProductStatus.Deactivate) {
        message.success(pageData.productActivatedSuccess);
      } else {
        message.success(pageData.productDeactivatedSuccess);
      }
      setStatusId(statusId === ProductStatus.Deactivate ? ProductStatus.Activate : ProductStatus.Deactivate)
      setActivate(!(statusId === ProductStatus.Deactivate) ? pageData.activate : pageData.deactivate)
    }
  }

  const onClickAddPrice = () => {
    const formValue = form.getFieldsValue()
    const { product } = formValue

    const newPrice = {
      position: prices.length || 0,
      priceName: '',
      priceValue: 0,
      priceOriginal: 0,
      priceDiscount: 0,
      percentNumber: 0,
      quantityLeft: 0,
      quantitySold: 0,
      startDate: moment(),
      endDate: moment().add(7, 'days')
    }
    if (prices.length === 1) {
      prices[0].price = product.price || 0
    }
    const listPrice = [...(product.prices ?? prices), newPrice]
    product.prices = listPrice
    setPrices(listPrice)

    form.setFieldsValue(formValue)
    setTimeout(() => {
      const dragDropPrices = document.getElementById('dragDropPrices')
      dragDropPrices.scrollTop = dragDropPrices.scrollHeight
    }, 100)
  }

  const onDeletePrice = (index) => {
    const formValue = form.getFieldsValue()
    const { product } = formValue
    const discount = discountChecked
    if (product.prices.length > 0) {
      product.prices.splice(index, 1)
      product.selectedMaterials?.priceName?.splice(index, 1)
      product.prices.forEach((item, index) => (item.position = index))
      discount.splice(index, 1)
    }
    isDisCountChecked(discount)
    setPrices(product.prices)
    if (product.prices.length === 1) {
      product.price = product.prices[0].price
      product.prices[0].position = 0
    }
    form.setFieldsValue(formValue)
  }

  const onCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      return history.push('/product')
    }, DELAYED_TIME)
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
  const pricetoPercentage = (num, index) => {
    return 100 - roundNumber(prices[index].priceValue === 0 ? 0 : num * 100 / prices[index].priceValue)
  }
  const percentageToPrice = (num, index) => {
    return prices[index].priceValue - roundNumber(prices[index].priceValue * num / 100)
  }
  const onDiscountChange = (numeric = 0, percentage = 0, index) => {
    if (numeric !== 0) {
      const percent = pricetoPercentage(numeric, index)
      form.setFieldValue(['product', 'prices', index, 'percentNumber'], percent)
    }
    else if (percentage !== 0) {
      const num = percentageToPrice(percentage, index)
      form.setFieldValue(['product', 'prices', index, 'priceDiscount'], num)
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

  const renderPrices = () => {
    const addPriceButton = (
      <Button
        type="primary"
        icon={<IconBtnAdd className="icon-btn-add-price" />}
        className="btn-add-price"
        onClick={onClickAddPrice}
        htmlType="button"
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
                                        <h3>{pageData.pricing.quantity.remaining.label}</h3>
                                      </Col>
                                      <Col span={8}>
                                        <h3>{pageData.pricing.quantity.sold.label}</h3>
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
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'quantityLeft']}
                                          rules={[
                                            {
                                              pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                              message: pageData.pricing.quantity.remaining.validateMessage
                                            }
                                          ]}
                                        >
                                          <InputNumber
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.quantity.remaining.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            // addonAfter={currency.vnd}
                                            // precision={0}
                                            onKeyDown={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-quantity-left`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'quantitySold']}
                                          rules={[
                                            {
                                              pattern: new RegExp(inputNumberRange1To999999999.range),
                                              message: pageData.pricing.price.validateMessage
                                            }
                                          ]}
                                        >
                                          <InputNumber
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.quantity.sold.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            onKeyDown={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-quantity-sold`}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                    <Row className='mt-3' gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <h3>
                                          {pageData.pricing.priceOriginal.label}
                                        </h3>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <h3>
                                          {pageData.pricing.price.label}
                                        </h3>
                                      </Col>
                                    </Row>
                                    <Row gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'priceOriginal']}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.price.validateMessage
                                            },
                                            {
                                              pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                              message: pageData.pricing.price.validateMessage
                                            },
                                            ({ getFieldValue }) => ({
                                              validator(_, value) {
                                                if (value > getFieldValue(['product', 'prices', price.position, 'priceValue'])) {
                                                  return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                                                }
                                                return Promise.resolve()
                                              }
                                            })
                                          ]}
                                        >
                                          <InputNumber
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.priceOriginal.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            addonAfter={currency.vnd}
                                            precision={0}
                                            onKeyDown={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-price-original`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'priceValue']}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.price.validateMessage
                                            },
                                            {
                                              pattern: new RegExp(inputNumberRangeOneTo999999999.range),
                                              message: pageData.pricing.price.validateMessage
                                            },
                                            ({ getFieldValue }) => ({
                                              validator(_, value) {
                                                if (value < getFieldValue(['product', 'prices', price.position, 'priceOriginal'])) {
                                                  return Promise.reject(new Error(pageData.pricing.priceOriginal.validateMessageValue))
                                                }
                                                return Promise.resolve()
                                              }
                                            }),
                                            ({ getFieldValue }) => (
                                              {
                                                validator(_, value) {
                                                  if (value > getFieldValue(['product', 'prices', price.position, 'priceValue'])) {
                                                    return Promise.reject(new Error(pageData.pricing.discount.numeric.validateMessage))
                                                  }
                                                  return Promise.resolve();
                                                }
                                              }
                                            )
                                          ]}
                                        >
                                          <InputNumber
                                            onChange={value => setPrices(p => p.map((pr, i) => i == index ? { ...pr, priceValue: value } : pr))}
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.price.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            addonAfter={currency.vnd}
                                            precision={0}
                                            onKeyDown={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-price`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Checkbox className='mx-auto my-3'
                                        checked={discountChecked[index]}
                                        onChange={e => isDisCountChecked(clist => [...clist.slice(0, index), e.target.checked, ...clist.slice(index + 1)])}>
                                        {pageData.pricing.discountCheck}
                                      </Checkbox>
                                    </Row>
                                    <Row className={`mt-3 ${discountChecked[index] ? "" : "d-none"}`} gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <h3>{pageData.pricing.discount.numeric.label}</h3>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={12}>
                                        <h3>{pageData.pricing.discount.percentage.label}</h3>
                                      </Col>
                                    </Row>
                                    <Row className={`${discountChecked[index] ? "" : "d-none"}`} gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'priceDiscount']}
                                          rules={[
                                            {
                                              pattern: new RegExp(inputNumberRange1To999999999.range),
                                              message: pageData.pricing.price.validateMessage
                                            },
                                            ({ getFieldValue }) => (
                                              {
                                                validator(_, value) {
                                                  if (value > getFieldValue(['product', 'prices', price.position, 'priceValue'])) {
                                                    return Promise.reject(new Error(pageData.pricing.discount.numeric.validateMessage))
                                                  }
                                                  return Promise.resolve();
                                                }
                                              }
                                            )
                                          ]}
                                        >
                                          <InputNumber
                                            onChange={value => onDiscountChange(value, 0, index)}
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.discount.numeric.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            // addonAfter={currency.vnd}
                                            // precision={0}
                                            onKeyDown={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-price-discount-numeric`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'percentNumber']}
                                          rules={[
                                            {
                                              pattern: new RegExp(inputNumberRange1To999999999.range),
                                              message: pageData.pricing.discount.percentage.validateMessage
                                            }
                                          ]}
                                        >
                                          <InputNumber
                                            onChange={value => onDiscountChange(0, value, index)}
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.discount.percentage.placeholder}
                                            formatter={(value) => `${value}%`}
                                            parser={(value) => value?.replace('%', '')}
                                            min={0}
                                            max={100}
                                            onKeyDown={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-price-discount-percentage`}
                                          />
                                        </Form.Item>
                                      </Col>
                                    </Row>
                                    <Row className={`${discountChecked[index] ? "" : "d-none"}`} gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <h3>
                                          {pageData.pricing.priceDate.startDate.label}
                                        </h3>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <h3>
                                          {pageData.pricing.priceDate.endDate.label}
                                        </h3>
                                      </Col>
                                    </Row>
                                    <Row className={`${discountChecked[index] ? "" : "d-none"}`} gutter={[8, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', "prices", price.position, "startDate"]}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.priceDate.startDate.validateMessage
                                            }
                                          ]}
                                        >
                                          <DatePicker
                                            suffixIcon={<CalendarNewIconBold />}
                                            placeholder={pageData.pricing.priceDate.startDate.placeholder}
                                            className="shop-date-picker w-100"
                                            format={DateFormat.DD_MM_YYYY}
                                            disabledDate={disabledDate}
                                            onChange={(date) => {
                                              price.startDate = date
                                              // Clear end date after select start date if endate < startdate only
                                              const formValues = form.getFieldsValue();
                                              const { product } = formValues
                                              product.prices[index].startDate = date
                                              if (product.prices[index]?.endDate != null && product.prices[index]?.endDate.isBefore(date)) {
                                                product.prices[index].endDate = null
                                                product.prices[index].endTime = null

                                              }
                                              form.setFieldsValue(formValues);
                                              console.log(product)
                                            }}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={8}>
                                        <Form.Item
                                          name={['product', "prices", price.position, "endDate"]}
                                          rules={[]}
                                        >
                                          <DatePicker
                                            suffixIcon={<CalendarNewIconBold />}
                                            placeholder={pageData.pricing.priceDate.endDate.placeholder}
                                            className="shop-date-picker w-100"
                                            disabledDate={e => disabledDateByStartDate(e, price)}
                                            format={DateFormat.DD_MM_YYYY}
                                            disabled={price.startDate ? false : true}
                                            onChange={(date) => {
                                              const formValues = form.getFieldsValue();
                                              const { product } = formValues
                                              product.prices[index].endDate = date
                                              form.setFieldsValue(formValues)
                                            }}
                                          />
                                        </Form.Item>
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

  const handleDeleteItem = async (productId, productName) => {
    var res = await productDataService.deleteProductByIdAsync(productId);
    if (res) {
      onCompleted();
      message.success(pageData.productDeleteSuccess);
    } else {
      message.error(pageData.productDeleteFail);
    }
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
    }
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const handleOpenDeletePopup = () => {
    setTitleModal(pageData.leaveDialog.confirmDelete)
    setIsModalVisible(true)
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
          <Row>
            <p className="card-header">
              <PageTitle content={titleName} />
            </p>
            {statusId === ProductStatus.Activate && (
              <span className="badge-status active ml-3">
                <span> {pageData.active}</span>
              </span>
            )}
            {statusId === ProductStatus.Deactivate && (
              <span className="badge-status default ml-3">
                <span> {pageData.inactive}</span>
              </span>
            )}
          </Row>
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
                    icon={<PlusOutlined className="icon-btn-add-option" />}
                    className="btn-create-form"
                    onClick={editProduct}
                  >
                    {pageData.btnSave}
                  </Button>
                ),
                permission: PermissionKeys.EDIT_PRODUCT
              },
              {
                action: (
                  <a onClick={() => onCancel()} className="action-cancel">
                    {pageData.btnCancel}
                  </a>
                ),
                permission: null
              },
              {
                action: (
                  <a
                    className={activate === pageData.deactivate ? 'action-activate' : 'action-deactivate'}
                    onClick={() => onChangeStatus()}
                  >
                    {activate}
                  </a>
                ),
                permission: PermissionKeys.EDIT_PRODUCT
              },
              {
                action: (
                  <a onClick={() => handleOpenDeletePopup()} className="action-delete">
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.EDIT_PRODUCT
              }
            ]}
          />
        </Col>
      </Row>

      <Form
        form={form}
        name="basic"
        scrollToFirstError
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
      >
        <div className="col-input-full-width">
          <Row className="grid-container-edit-product">
            <Col span={24} className="left-create-product">
              <Card className="w-100 shop-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.generalInformation.title}</h4>

                    <h4 className="shop-form-label mt-20">
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
                    >
                      <Input
                        showCount
                        className="shop-input-with-count"
                        placeholder={pageData.generalInformation.name.placeholder}
                        maxLength={pageData.generalInformation.name.maxLength}
                        id="product-name"
                      />
                    </Form.Item>

                    <h4 className="shop-form-label mt-32">{pageData.generalInformation.description.label}</h4>
                    <Form.Item name={['product', 'description']} rules={[]}>
                      <FnbTextArea
                        showCount
                        maxLength={pageData.generalInformation.description.maxLength}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                      ></FnbTextArea>
                    </Form.Item>
                  </Col>
                  <h4 className="shop-form-label">{pageData.content.label}</h4>
                  <FnbFroalaEditor
                    value={productContent}
                    onChange={(value) => {
                      if (value !== "" && value !== "<div></div>") setIsChangeForm(true);
                      setProductContent(value);
                    }}
                    placeholder={pageData.content.placeholder}
                    charCounterMax={-1}
                  />
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
                          max: pageData.SEOInformation.SEOtitle.maxLength,
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
            </Col>

            <Col span={24} className="price-product">
              <Card className="w-100 mt-1 shop-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.pricing.title}</h4>
                    {renderPrices()}
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 shop-card h-auto">
                    <h4 className="title-group">{pageData.upload.title}</h4>
                    <FnbImageSelectComponent
                      ref={shopImageSelectRef}
                      customTextNonImageClass={'create-edit-product-text-non-image'}
                      customNonImageClass={'create-edit-product-non-image'}
                    />
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br />
                  <Card className={'w-100 mt-1 shop-card h-auto'}>
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
                    <br />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Form>
      <DeleteProductComponent
        isModalVisible={isModalVisible}
        preventDeleteProduct={preventDeleteProduct}
        titleModal={titleModal}
        handleCancel={() => setIsModalVisible(false)}
        onDelete={handleDeleteItem}
      />
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmLeaveTitle}
        content={pageData.leaveDialog.confirmLeaveContent}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.btnDiscard}
        okText={pageData.leaveDialog.confirmLeave}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
