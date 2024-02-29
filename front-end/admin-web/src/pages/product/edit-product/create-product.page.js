import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Typography
} from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { FnbDeleteIcon } from 'components/fnb-delete-icon/fnb-delete-icon'
import { FnbSelectSingle } from 'components/fnb-select-single/fnb-select-single'
import { FnbTextArea } from 'components/fnb-text-area/fnb-text-area.component'
import { FnbUploadImageComponent } from 'components/fnb-upload-image/fnb-upload-image.component'
import PageTitle from 'components/page-title'
import { DELAYED_TIME, inputNumberRange1To999999999, tableSettings } from 'constants/default.constants'
import { DragIcon, IconBtnAdd, TrashFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { currency } from 'constants/string.constants'
// import productDataService from "data-services/product/product-data.service";
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useHistory } from 'react-router'
import { getValidationMessagesWithParentField, randomGuid } from 'utils/helpers'
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
const { Text } = Typography

export default function CreateProductPage () {
  const history = useHistory()

  const [blockNavigation, setBlockNavigation] = useState(false)
  const [image, setImage] = useState(null)
  const [prices, setPrices] = useState([{}])
  const [listAllProductCategory, setListAllProductCategory] = useState([])
  const [disableCreateButton, setDisableCreateButton] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 500)

  useEffect(() => {
    getInitData()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const pageData = {
    title: 'Thêm Sản Phẩm',
    btnCancel: 'Hủy',
    btnSave: 'Lưu',
    btnAddNew: 'Thêm mới',
    discardBtn: 'Từ chối',
    confirmLeaveBtn: 'Xác nhận rời',
    generalInformation: {
      title: 'Thông tin chung',
      name: {
        label: 'Tên',
        placeholder: 'Nhập tên sản phẩm',
        required: true,
        maxLength: 100,
        validateMessage: 'Vui lòng nhập tên sản phẩm'
      },
      description: {
        label: 'Mô tả',
        placeholder: 'Vui lòng nhập mô tả sản phẩm',
        required: false,
        maxLength: 255
      },
      uploadImage: 'Thêm ảnh'
    },
    pricing: {
      title: 'Giá',
      addPrice: 'Thêm giá',
      price: {
        label: 'Giá',
        placeholder: 'Nhập giá',
        required: true,
        max: 999999999,
        min: 0,
        format: '^[0-9]*$',
        validateMessage: 'Giá trị cho phép từ 0 đến 999.999.999'
      },
      priceName: {
        label: 'Tên giá',
        placeholder: 'Nhập tên giá',
        required: true,
        maxLength: 100,
        validateMessage: 'Vui lòng nhập tên giá'
      }
    },
    productCategory: {
      label: 'Danh mục sản phẩm',
      placeholder: 'Chọn danh mục sản phẩm'
    },
    productNameExisted: 'Tên sản phẩm đã tồn tại',
    fileSizeLimit: 'Kích thước tệp tải lên phải nhỏ hơn 5MB',
    productAddedSuccess: 'Sản phẩm đã được thêm thành công',
    media: {
      title: 'Thư viện ảnh',
      textNonImage: 'Chấp nhận: JPG, PNG, JPG2000, GIF,... .'
    },
    upload: {
      adFromUrl: 'Add from URL'
    },
    leaveDialog: {
      confirmation: 'Xác nhận',
      content: 'Bạn có muốn tiếp tục?<br/>Tất cả dữ liệu chưa được lưu sẽ bị mất!'
    },
    table: {
      name: 'TÊN',
      action: 'THAO TÁC'
    },
    bestDisplayImage: 'Hiển thị tốt nhất: 176px X 176px'
  }

  const getInitData = async () => {
    // const resDataInitialCreateProduct = await productDataService.getInitialDataCreateProduct();
    // if (resDataInitialCreateProduct) {
    //   const allProductCategories = resDataInitialCreateProduct?.allProductCategories;
    //   if (allProductCategories) {
    //     setListAllProductCategory(allProductCategories);
    //   }
    // }
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
    form
      .validateFields()
      .then(async (values) => {
        const createProductRequestModel = {
          ...values.product,
          image: image?.url
        }

        if (createProductRequestModel.prices > 0) {
          // productDataService
          //   .createProductAsync(createProductRequestModel)
          //   .then((res) => {
          //     if (res) {
          //       message.success(pageData.productAddedSuccess);
          //       setIsChangeForm(false);
          //       history.push("/product");
          //     }
          //   })
          //   .catch((errs) => {
          //     form.setFields(getValidationMessagesWithParentField(errs, "product"));
          //   });
        }
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
      const price = {
        position: 0,
        id: randomGuid(),
        name: '',
        price: product.price || ''
      }
      prices[0] = price
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

    const singlePrice = (
      <>
        <Row>
          <Col span={24}>
            <h4 className="fnb-form-label">{pageData.pricing.price.label}</h4>
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
                className="w-100 fnb-input-number"
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
            <div className="mt-2">
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
                  style={prices.length >= 6 ? { height: 640, overflowY: 'scroll' } : { minHeight: prices.length * 127 }}
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
                                          name={['product', 'prices', price.position, 'name']}
                                          rules={[
                                            {
                                              required: true,
                                              message: pageData.pricing.priceName.validateMessage
                                            }
                                          ]}
                                        >
                                          <Input
                                            className="fnb-input"
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
                                            className="fnb-input-number w-100"
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

  return (
    <>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} lg={12}>
          <p className="card-header">
            <PageTitle content={pageData.title} />
          </p>
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="fnb-form-item-btn">
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
        onFieldsChange={(e) => changeForm(e)}
        autoComplete="off"
        onChange={() => {
          if (!blockNavigation) setBlockNavigation(true)
        }}
      >
        <div className="col-input-full-width create-product-page">
          <Row className="grid-container-create-product">
            <Col className="left-create-product" xs={24} sm={24} md={24} lg={24}>
              <Card className="w-100 fnb-card h-auto">
                <Row>
                  <Col span={24}>
                    <h4 className="title-group">{pageData.generalInformation.title}</h4>

                    <h4 className="fnb-form-label">
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
                        className="fnb-input-with-count"
                        placeholder={pageData.generalInformation.name.placeholder}
                        maxLength={pageData.generalInformation.name.maxLength}
                        id="product-name"
                      />
                    </Form.Item>

                    <h4 className="fnb-form-label">{pageData.generalInformation.description.label}</h4>
                    <Form.Item name={['product', 'description']} rules={[]}>
                      <FnbTextArea
                        showCount
                        maxLength={pageData.generalInformation.description.maxLength}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        id="product-description"
                      ></FnbTextArea>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <br />

              <Card className="w-100 mt-1 fnb-card h-auto">
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
                  <Card className="w-100 fnb-card h-auto">
                    <h4 className="title-group">{pageData.media.title}</h4>
                    <Row className={`non-image ${image !== null ? 'have-image' : ''}`}>
                      <Col span={24} className={`image-product ${image !== null ? 'justify-left' : ''}`}>
                        <div style={{ display: 'flex' }}>
                          <Form.Item name={['product', 'media']}>
                            <FnbUploadImageComponent
                              buttonText={pageData.generalInformation.uploadImage}
                              onChange={onChangeImage}
                            />
                          </Form.Item>
                          <a className="upload-image-url" hidden={image !== null}>
                            {pageData.upload.addFromUrl}
                          </a>
                        </div>
                      </Col>
                      <Col
                        span={24}
                        className="create-edit-product-text-non-image"
                        hidden={image !== null}
                      >
                        <Text disabled>
                          {pageData.media.textNonImage}
                          <br />
                          {pageData.bestDisplayImage}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <br/>
                  <Card className="w-100 mt-1 fnb-card h-auto">
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
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Form>
      <DeleteConfirmComponent
        title={pageData.leaveDialog.confirmation}
        content={pageData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={pageData.discardBtn}
        okText={pageData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
