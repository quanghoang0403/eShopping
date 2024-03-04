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
  Typography
} from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbDeleteIcon } from 'components/shop-delete-icon/shop-delete-icon'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single'
import { FnbTextArea } from 'components/shop-text-area/shop-text-area.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, inputNumberRange1To999999999 } from 'constants/default.constants'
import { DragIcon, IconBtnAdd, TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ProductStatus } from 'constants/product-status.constants'
import { currency } from 'constants/string.constants'
// import productDataService from "data-services/product/product-data.service";
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
export default function EditProductPage (props) {
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
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 500)

  useEffect(() => {
    getInitData()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const pageData = {
    title: t('product:addProduct'),
    btnCancel: t('button:cancel'),
    btnSave: t('button:save'),
    btnAddNew: t('button:add'),
    btnDiscard: t('button:discard'),
    generalInformation: {
      title: t('product:titleInfo'),
      name: {
        label: t('product:labelName'),
        placeholder: t('product:placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('product:validateName')
      },
      description: {
        label: t('product:labelDescription'),
        placeholder: t('product:placeholderDescription'),
        required: false,
        maxLength: 255
      }
    },
    pricing: {
      title: t('product:priceInfo'),
      addPrice: t('product:addPrice'),
      price: {
        label: t('product:labelPrice'),
        placeholder: t('product:placeholderPrice'),
        required: true,
        max: 999999999,
        min: 0,
        format: '^[0-9]*$',
        validateMessage: t('product:validatePrice')
      },
      priceName: {
        label: t('product:labelPriceName'),
        placeholder: t('product:placeholderPriceName'),
        required: true,
        maxLength: 100,
        validateMessage: t('product:validatePriceName')
      }
    },
    productCategory: {
      label: t('product:labelCategory'),
      placeholder: t('product:placeholderCategory')
    },
    productNameExisted: t('product:productNameExisted'),
    productEditedSuccess: t('product:productEditedSuccess'),
    productDeleteSuccess: t('product:productDeleteSuccess'),
    productDeleteFail: t('product:productDeleteFail'),
    productActivatedSuccess: t('product:productActivatedSuccess'),
    productDeactivatedSuccess: t('product:productDeactivatedSuccess'),
    file: {
      uploadImage: t('file:uploadImage'),
      title: t('file:title'),
      textNonImage: t('file:textNonImage'),
      addFromUrl: t('file:addFromUrl'),
      bestDisplayImage: t('file:bestDisplayImage')
    },
    leaveDialog: {
      confirmLeaveTitle: t('dialog:confirmLeaveTitle'),
      confirmLeaveContent: t('dialog:confirmLeaveContent'),
      confirmLeave: t('dialog:confirmLeave'),
      confirmDelete: t('dialog:confirmDelete')
    },
    table: {
      name: t('table:name'),
      action: t('table:action')
    },
    active: t('common:active'),
    inactive: t('common:inactive'),
    activate: t('product:activate'),
    deactivate: t('product:deactivate')
  }

  const getInitData = async () => {
    // productDataService.getProductByIdAsync(match?.params?.id).then((data) => {
    //   setTitleName(data?.product?.name);
    //   setStatusId(data?.product?.statusId);
    //   if (data?.product?.statusId === ProductStatus.Activate) {
    //     setActivate(pageData.activate);
    //   } else {
    //     setActivate(pageData.deactivate);
    //   }
    //   setListAllProductCategory(data?.product?.allProductCategories);
    //   const pricesData = [];
    //   if (data?.product?.productPrices.length > 0) {
    //     data?.product?.productPrices.map((price, index) => {
    //       pricesData.push({
    //         position: index,
    //         id: price?.id,
    //         name: price?.priceName,
    //         price: price?.priceValue,
    //       });
    //     });
    //     setPrices(pricesData);
    //   }
    //   const initData = {
    //     product: {
    //       description: data?.product?.description,
    //       name: data?.product?.name,
    //       productCategoryId: data?.product?.productCategoryId,
    //       price: data?.product?.productPrices.length === 1 ? data?.product?.productPrices[0].priceValue : null,
    //       prices: pricesData,
    //     },
    //   };

    //   /// Update image
    //   if (shopImageSelectRef && shopImageSelectRef.current) {
    //     shopImageSelectRef.current.setImageUrl(data?.product?.thumbnail);
    //     setSelectedImage(data?.product?.thumbnail);
    //   }
    //   form.setFieldsValue(initData);
    // });
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
          image: imageUrl,
          productId: match?.params?.id
        }
        if (editProductRequestModel.prices > 0) {
          // try {
          //   productDataService
          //     .updateProductAsync(editProductRequestModel)
          //     .then((res) => {
          //       if (res) {
          //         message.success(pageData.productEditedSuccess);
          //         onCompleted();
          //       }
          //     })
          //     .catch((errs) => {
          //       form.setFields(getValidationMessagesWithParentField(errs, "product"));
          //     });
          // } catch (errors) {
          //   // build error message
          //   const errorData = getApiError(errors);
          //   // const errMessage = t(errorData?.message, {
          //   //   comboName: errorData?.comboName,
          //   //   productName: errorData?.productName,
          //   // });

          //   message.error(errorData);
          //   getInitData();
          // }
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
    // var res = await productDataService.changeStatusAsync(match?.params?.id);
    // if (res) {
    //   if (statusId === ProductStatus.Deactivate) {
    //     message.success(pageData.productActivatedSuccess);
    //   } else {
    //     message.success(pageData.productDeactivatedSuccess);
    //   }
    //   getInitData();
    // }
  }

  const onClickAddPrice = () => {
    const formValue = form.getFieldsValue()
    const { product } = formValue

    const newPrice = {
      position: prices.length || 0,
      id: randomGuid(),
      name: '',
      price: ''
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
    if (product.prices.length > 0) {
      product.prices.splice(index, 1)
      product.selectedMaterials?.priceName?.splice(index, 1)
      product.prices.forEach((item, index) => (item.position = index))
    }
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

    const singlePrice = (
      <>
        <Row>
          <Col span={24}>
            <h4 className="shop-form-label mt-24">{pageData.pricing.priceName.label}</h4>
            <Form.Item
              name={['product', 'price']}
              rules={[
                {
                  required: true,
                  message: pageData.pricing.price.validateMessage
                },
                {
                  pattern: new RegExp(inputNumberRange1To999999999.range),
                  message: pageData.pricing.price.validateMessage
                }
              ]}
            >
              <InputNumber
                className="w-100 shop-input-number"
                placeholder={pageData.pricing.price.placeholder}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                addonAfter={currency.vnd}
                precision={0}
                id="product-price"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <div className="ml-2">
              {addPriceButton}
            </div>
          </Col>
        </Row>
      </>
    )

    const multiplePrices = (
      <>
        <DragDropContext className="mt-4" onDragEnd={(result) => onDragEnd(result)}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="list-price">
                <div
                  id="dragDropPrices"
                  style={
                    prices.length >= 6
                      ? { height: 640, overflowY: 'scroll' }
                      : { minHeight: isMobileSize ? prices.length * 202 : prices.length * 127 }
                  }
                >
                  <div style={{ minHeight: prices.length * 127 }}>
                    {prices.map((price, index) => {
                      const position = (price.position || 0) + 1
                      return (
                        <Draggable key={price.id} draggableId={price.id} index={index}>
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
                                    <Row gutter={[16, 16]}>
                                      <Col xs={24} sm={24} md={24} lg={12}>
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
                                          name={['product', 'prices', price.position, 'isPriceBelongsCombo']}
                                          hidden={true}
                                        >
                                          <Input />
                                        </Form.Item>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'name']}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.priceName.validateMessage
                                            }
                                          ]}
                                        >
                                          <Input
                                            className="shop-input"
                                            placeholder={pageData.pricing.priceName.placeholder}
                                            maxLength={pageData.pricing.priceName.maxLength}
                                            id={`product-prices-${price.position}-name`}
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col xs={24} sm={24} md={24} lg={12}>
                                        <Form.Item
                                          name={['product', 'prices', price.position, 'price']}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.price.validateMessage
                                            },
                                            {
                                              pattern: new RegExp(inputNumberRange1To999999999.range),
                                              message: pageData.pricing.price.validateMessage
                                            }
                                          ]}
                                        >
                                          <InputNumber
                                            className="shop-input-number w-100"
                                            placeholder={pageData.pricing.price.placeholder}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                            addonAfter={currency.vnd}
                                            precision={0}
                                            onKeyPress={(event) => {
                                              if (!/[0-9]/.test(event.key)) {
                                                event.preventDefault()
                                              }
                                            }}
                                            id={`product-prices-${price.position}-price`}
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
        {prices.length === 1 && singlePrice}
        {prices.length > 1 && multiplePrices}
      </>
    )
  }

  const handleDeleteItem = async (productId, productName) => {
    // var res = await productDataService.deleteProductByIdAsync(productId);
    // if (res) {
    //   onCompleted();
    //   message.success(pageData.productDeleteSuccess);
    // } else {
    //   message.error(pageData.productDeleteFail);
    // }
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
                permission: PermissionKeys.ACTIVATE_PRODUCT
              },
              {
                action: (
                  <a onClick={() => handleOpenDeletePopup()} className="action-delete">
                    {pageData.btnDelete}
                  </a>
                ),
                permission: PermissionKeys.DELETE_PRODUCT
              }
            ]}
          />
        </Col>
      </Row>

      <Form
        form={form}
        name="basic"
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
                </Row>
              </Card>
              <br />
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
                  <br/>
                  <Card className={'w-100 mt-1 shop-card h-auto'}>
                    <h4 className="title-group">{pageData.productCategory.label}</h4>
                    <Form.Item name={['product', 'productCategoryId']}>
                      <FnbSelectSingle
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
