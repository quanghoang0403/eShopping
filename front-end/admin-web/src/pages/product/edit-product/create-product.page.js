import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Tooltip
} from 'antd';
import { ExclamationIcon } from 'constants/icons.constants';
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbDeleteIcon } from 'components/shop-delete-icon/shop-delete-icon'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import { FnbUploadImageComponent } from 'components/shop-upload-image/shop-upload-image.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { IconBtnAdd, TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import productDataService from 'data-services/product/product-data.service';
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router'
import { getValidationMessagesWithParentField } from 'utils/helpers'
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import productCategoryDataService from 'data-services/product-category/product-category-data.service'
import { FnbSelectMultiple } from 'components/shop-select-multiple/shop-select-multiple';
import FnbFroalaEditor from 'components/shop-froala-editor';
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button';
import { BadgeSEOKeyword, SEO_KEYWORD_COLOR_LENGTH } from 'components/badge-keyword-SEO/badge-keyword-SEO.component';
import StockProductTable from '../components/stock-product.component';
import moment from 'moment';

const { Text } = Typography

export default function CreateProductPage() {
  const history = useHistory()
  const [variants, setVariants] = useState([{
    position: 0,
    thumbnail: null,
    name: 'Product Variant 1',
    isUseBasePrice: true,
    priceOriginal: 200000.00,
    priceValue: 140000.00,
    priceDiscount: 130000.00,
    startDate: moment(),
    endDate: moment().add(7, 'days'),
    stocks: [
      { id: '1', name: 'S', quantity: 0 },
      { id: '2', name: 'M', quantity: 1 },
      { id: '3', name: 'L', quantity: 3 },
      { id: '4', name: 'XL', quantity: 4 },
      { id: '5', name: 'XXL', quantity: 5 }
    ]
  },
  {
    position: 1,
    thumbnail: 'https://eshoppingblob.blob.core.windows.net/uploaddev/29052024112449.jpg',
    name: 'Product Variant 2',
    isUseBasePrice: false,
    priceOriginal: 180000.00,
    priceValue: 140000.00,
    priceDiscount: 130000.00,
    startDate: moment(),
    endDate: moment().add(6, 'days'),
    stocks: [
      { id: '1', name: 'S', quantity: 4 },
      { id: '2', name: 'M', quantity: 1 },
      { id: '3', name: 'L', quantity: 3 },
      { id: '4', name: 'XL', quantity: 4 },
      { id: '5', name: 'XXL', quantity: 5 }
    ]
  },
  {
    position: 2,
    thumbnail: null,
    name: 'Product Variant 3',
    isUseBasePrice: true,
    priceOriginal: 160000.00,
    priceValue: 140000.00,
    priceDiscount: 130000.00,
    startDate: moment(),
    endDate: moment().add(4, 'days'),
    stocks: [
      { id: '1', name: 'S', quantity: 10 },
      { id: '2', name: 'M', quantity: 1 },
      { id: '3', name: 'L', quantity: 3 },
      { id: '4', name: 'XL', quantity: 4 },
      { id: '5', name: 'XXL', quantity: 5 }
    ]
  }])
  const sizes = [
    { id: '1', name: 'S' },
    { id: '2', name: 'M' },
    { id: '3', name: 'L' },
    { id: '4', name: 'XL' },
    { id: '5', name: 'XXL' }
  ]
  const [image, setImage] = useState(null)
  const [thumbnailVariants, setThumbnailVariants] = useState([]);
  const [listAllProductCategory, setListAllProductCategory] = useState([])
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false);
  const [discountChecked, isDisCountChecked] = useState([false]);
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 500);
  const [productContent, setProductContent] = useState('');
  const [keywordSEOs, setKeywordSEOList] = useState([]);
  const [keywordSEO, setKeywordSEO] = useState({})
  const [isKeywordSEOChange, setIsKewwordSEOChange] = useState(false)
  const [form] = Form.useForm()
  useEffect(() => {
    getInitData()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    handleChangeThumbnail()
  }, [variants])

  const handleChangeThumbnail = () => {
    const variants = form.getFieldValue(['product', 'variants'])
    setThumbnailVariants(variants.map(variant => variant.thumbnail));
  }

  const { t } = useTranslation()
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
      }
    },
    variant: {
      title: t('product.variantInfo'),
      addVariant: t('product.addVariant'),
      label: t('product.labelVariant'),
      placeholder: t('product.placeholderVariant'),
      validateVariant: t('product.validateVariant')
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
      bestDisplayImage: t('file.bestDisplayImage')
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
    console.log(form.getFieldsValue().product)
    // form
    //   .validateFields()
    //   .then(async (values) => {
    //     const createProductRequestModel = {
    //       ...values.product,
    //       imagePaths: [],
    //       productVariants: values.product.variants,
    //       thumbnail: values.product.media.url,
    //       content: productContent,
    //       keywordSEO: keywordSEOs.map(kw => kw.value)?.join(',') || null
    //     }
    //     console.log(createProductRequestModel)
    //     productDataService
    //       .createProductAsync(createProductRequestModel)
    //       .then((res) => {
    //         if (res) {
    //           message.success(pageData.productAddedSuccess);
    //           setIsChangeForm(false);
    //           history.push("/product");
    //         }
    //       })
    //       .catch((errs) => {
    //         form.setFields(getValidationMessagesWithParentField(errs, "product"));
    //         console.error(errs)
    //       })

    //   })
    //   .catch((errors) => {
    //     if (errors?.errorFields?.length > 0) {
    //       const elementId = `basic_${errors?.errorFields[0]?.name.join('_')}_help`
    //       scrollToElement(elementId)
    //     }
    //   })
  }

  const onDeleteVariant = (index) => {
    const formValue = form.getFieldsValue()
    const { product } = formValue
    if (product.variants.length > 0) {
      product.variants.splice(index, 1)
      product.variants.forEach((item, index) => (item.position = index))
    }
    setVariants(product.variants)
    if (product.variants.length === 1) {
      //product.price = product.variants[0].price
      product.variants[0].position = 0
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
    const listVariant = reorder(product.variants, result.source.index, result.destination.index)

    setVariants(listVariant)
    product.variants = listVariant
    form.setFieldsValue(formValue)
  }

  const onClickAddVariant = () => {
    const formValue = form.getFieldsValue()
    const { product } = formValue
    const newVariant = {
      position: variants.length,
      isUseBasePrice: true,
      thumbnail: '',
      name: '',
      priceValue: 0,
      priceOriginal: 0,
      priceDiscount: 0,
      percentNumber: 0,
      startDate: moment(),
      endDate: null
    }
    const listVariant = [...(product.variants ?? variants), newVariant]
    product.variants = listVariant
    setVariants(listVariant)
    form.setFieldsValue(formValue)
    setTimeout(() => {
      const dragDropVariants = document.getElementById('dragDropVariants')
      dragDropVariants.scrollTop = dragDropVariants.scrollHeight
    }, 100)
    const discountCheckList = [...discountChecked, false]
    isDisCountChecked(discountCheckList);
  }

  const renderVariants = () => {
    return (
      <>
        <DragDropContext className="mt-4" onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="list-price">
                <div
                  id="dragDropVariants"
                  style={variants.length > 3 ? { height: 700, overflowY: 'scroll' } : { minHeight: variants.length * 64 }}
                >
                  <div style={{ minHeight: variants.length * 64 }}>
                    {variants.map((variant, index) => {
                      const position = (variant.position || 0) + 1
                      const thumbnail = thumbnailVariants[variant.position]
                      return (
                        <Draggable key={variant.id} draggableId={position.toString()} index={index}>
                          {(provided) => (
                            <Row
                              className={'mb-4 pointer price-item'}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Col className="col-title">
                                <Row className="m-3 mr-4">
                                  <Col>
                                    <h3>{position + '.'} {pageData.variant.label}</h3>
                                  </Col>
                                  <Col className="w-100">
                                    <Form.Item
                                      name={['product', 'variants', variant.position, 'position']}
                                      hidden={true}
                                    >
                                      <Input />
                                    </Form.Item>
                                    <Form.Item name={['product', 'variants', variant.position, 'id']} hidden={true}>
                                      <Input />
                                    </Form.Item>
                                    <Form.Item
                                      name={['product', 'variants', variant.position, 'name']}
                                      rules={[
                                        {
                                          required: true,
                                          message: pageData.variant.validateVariant
                                        }
                                      ]}
                                      value={variant.name}
                                    >
                                      <Input
                                        className="shop-input"
                                        placeholder={pageData.variant.placeholder}
                                        id={`product-variants-${variant.position}-name`}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col className={`variant-thumnail non-image ${thumbnail != null ? 'have-image' : ''}`}>
                                    <Row span={24} className={`image-product ${thumbnail != null ? 'justify-left' : ''}`}>
                                      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                        <Form.Item
                                          name={['product', 'variants', variant.position, 'thumbnail']}
                                        >
                                          <FnbUploadImageComponent
                                            buttonText={pageData.file.uploadImage}
                                            onChange={handleChangeThumbnail}
                                          />
                                        </Form.Item>
                                      </div>
                                    </Row>
                                  </Col>
                                </Row>
                                <Row span={2} className="icon-delete-price">
                                  <a
                                    className="m-4"
                                    onClick={() => onDeleteVariant(variant.position)}
                                  >
                                    <FnbDeleteIcon />
                                  </a>
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
            <Button
              type="primary"
              icon={<IconBtnAdd className="icon-btn-add-price" />}
              className="btn-add-price"
              onClick={onClickAddVariant}
            >
              {pageData.variant.addVariant}
            </Button>
          </div>
        </Col>
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
            // variants: {
            //   [0]: {
            //     position: 0,
            //     name: 'Default',
            //     quantitySold: 0,
            //     priceValue: 0,
            //     priceOriginal: 0,
            //     priceDiscount: 0,
            //     percentNumber: 0,
            //     startDate: moment(),
            //     endDate: moment().add(7, "days")
            //   }
            // }
            variants: variants
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
                      onChange={(value) => {
                        if (value !== '' && value !== '<div></div>') setIsChangeForm(true);
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
            </Col>

            {/* right-side of form */}

            <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Card className="w-100 shop-card h-auto">
                    <h4 className="title-group">{pageData.file.title}</h4>
                    <Row className={`non-image ${image != null ? 'have-image' : ''}`}>
                      <Col span={24} className={`image-product ${image != null ? 'justify-left' : ''}`}>
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
                              onChange={(file) => setImage(file)}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col
                        span={24}
                        className="create-edit-product-text-non-image"
                        hidden={image != null}
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
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br />
                  <Card className="w-100 mt-1 shop-card h-auto">
                    <h4 className="title-group">{pageData.variant.title}</h4>
                    {renderVariants()}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <br />
          <Row>
            <Card className="w-100 mt-1 shop-card h-auto">
              <StockProductTable sizes={sizes} form={form} variants={variants} />
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
