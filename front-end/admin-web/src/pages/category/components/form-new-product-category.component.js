import { Card, Col, Form, Image, Input, InputNumber, message, Row, Tooltip } from 'antd'
import { arrayMoveImmutable } from 'array-move'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import DeleteConfirmComponent from 'components/delete-confirm/delete-confirm.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import { FnbSelectMultipleProduct } from 'components/shop-select-multiple-product/shop-select-multiple-product'
import PageTitle from 'components/page-title'
import { DELAYED_TIME } from 'constants/default.constants'
import { ExclamationIcon, PolygonIcon, TrashFill } from 'constants/icons.constants'
import { images } from 'constants/images.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useEffect, useState } from 'react'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { getValidationMessages } from 'utils/helpers'
import '../index.scss'

export default function FormNewProductCategory (props) {
  const { t, onCompleted, productCategoryDataService, productDataService } = props
  const [products, setProducts] = useState([])
  const [dataSelectedProducts, setDataSelectedProducts] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [isChangeForm, setIsChangeForm] = useState(false)
  const [form] = Form.useForm()

  const pageData = {
    title: t('category:addProductCategory'),
    btnCancel: t('button:cancel'),
    btnSave: t('button:save'),
    btnAddNew: t('button:addNew'),
    btnDiscard: t('button:discard'),
    generalInformation: {
      title: t('category:titleInfo'),
      name: {
        label: t('category:labelName'),
        placeholder: t('category:placeholderName'),
        required: true,
        maxLength: 100,
        validateMessage: t('category:validateName')
      }
    },
    product: {
      title: t('category:titleProduct'),
      placeholder: t('category:placeholderProduct')
    },
    priority: {
      title: t('category:titlePriority'),
      placeholder: t('category:placeholderPriority'),
      validateMessage: t('category:validatePriority'),
      tooltip: t('category:tooltipPriority')
    },
    productCategoryNameExisted: t('category:productNameExisted'),
    productCategoryAddedSuccess: t('category:productCategoryAddedSuccess'),
    leaveDialog: {
      confirmLeave: t('dialog:confirmLeave'),
      confirmLeaveTitle: t('dialog:confirmLeaveTitle'),
      confirmLeaveContent: t('dialog:confirmLeaveContent')
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    const res = await productDataService.getAllProductsAsync()
    if (res) {
      setProducts(res.products)
    }
  }

  const onSelectProduct = (ids) => {
    const productIds = ids
    const productList = []
    productIds.forEach((productId, index) => {
      const product = products.find((p) => p.id === productId)
      if (product) {
        const newProduct = { ...product, position: index + 1 }
        productList.push(newProduct)
      }
    })
    setDataSelectedProducts(productList)
  }

  const onDeleteSelectedProduct = (productId) => {
    let restProducts = dataSelectedProducts.filter((o) => o.id !== productId)
    restProducts = restProducts.map((product, index) => ({
      ...product,
      position: index + 1
    }))
    setDataSelectedProducts(restProducts)

    /// Set form value
    const formValues = form.getFieldsValue()
    let { productIds } = formValues
    productIds = productIds.filter((pid) => pid !== productId)
    form.setFieldsValue({ ...formValues, productIds })
  }

  const renderSelectProduct = () => {
    return (
      <>
        <Col span={24}>
          <h3 className="shop-form-label mt-16">{pageData.product.title}</h3>
          <Form.Item name="productIds">
            <FnbSelectMultipleProduct
              showSearch
              allowClear
              placeholder={pageData.product.placeholder}
              onChange={(value) => onSelectProduct(value)}
              className="w-100"
              listHeight={480}
              option={products?.map((item) => ({
                id: item?.id,
                name: item?.name,
                thumbnail: item?.thumbnail
              }))}
            ></FnbSelectMultipleProduct>
          </Form.Item>
        </Col>
      </>
    )
  }

  // #region Handle drag drop
  const DragHandle = sortableHandle(({ component }) => {
    return (
      <Row gutter={[16, 16]} className="all-scroll">
        <Col span={1}>
          <div className="drag-handle">
            <PolygonIcon />
          </div>
        </Col>
        <Col span={23}>{component()}</Col>
      </Row>
    )
  })

  const renderProductInfo = (product) => {
    return (
      <div className="product-info">
        <div className="product-position">
          <span>{product?.position}</span>
        </div>
        <div className="image-box">
          <Image src={product?.thumbnail || images.imgDefault} preview={false} />
        </div>
        <div className="product-name">
          <span>{product?.name}</span>
        </div>
      </div>
    )
  }

  const SortableItem = sortableElement(({ product }) => {
    return (
      <>
        <div className="selected-product-card mt-3">
          <Row>
            <Col span={22}>
              <DragHandle component={() => renderProductInfo(product)}></DragHandle>
            </Col>
            <Col span={2}>
              <div className="delete-icon">
                <TrashFill onClick={() => onDeleteSelectedProduct(product?.id)} />
              </div>
            </Col>
          </Row>
        </div>
      </>
    )
  })

  const onSortEnd = ({ oldIndex, newIndex }) => {
    let arraySorted = arrayMoveImmutable(dataSelectedProducts, oldIndex, newIndex)
    arraySorted = arraySorted.map((product, index) => ({
      ...product,
      position: index + 1
    }))
    setDataSelectedProducts(arraySorted)
  }

  const SortableList = sortableContainer(({ items }) => {
    return (
      <div className="selected-product-width mt-16">
        {items.map((value, index) => (
          <SortableItem key={value.id} index={index} product={value} />
        ))}
      </div>
    )
  })

  const renderSelectedProduct = () => {
    return <SortableList items={dataSelectedProducts} onSortEnd={onSortEnd} useDragHandle />
  }
  // #endregion

  const onSubmitForm = () => {
    form.validateFields().then(async (values) => {
      const createProductCategoryRequestModel = {
        name: values.name,
        products: dataSelectedProducts,
        priority: values.priority
      }
      productCategoryDataService
        .createProductCategoryAsync(createProductCategoryRequestModel)
        .then((res) => {
          if (res) {
            message.success(pageData.productCategoryAddedSuccess)
            onCompleted()
          }
        })
        .catch((errs) => {
          form.setFields(getValidationMessages(errs))
        })
    })
  }

  const onDiscard = () => {
    setShowConfirm(false)
  }

  const onCancel = () => {
    if (isChangeForm) {
      setShowConfirm(true)
    } else {
      setShowConfirm(false)
      onCompleted()
    }
  }

  const handleCompleted = () => {
    setIsChangeForm(false)
    setTimeout(() => {
      onCompleted()
    }, DELAYED_TIME)
  }

  return (
    <>
      <Form form={form} layout="vertical" autoComplete="off" onFieldsChange={() => setIsChangeForm(true)}>
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <p className="card-header">
              <PageTitle content={pageData.title} />
            </p>
          </Col>
          <Col xs={24} sm={24} lg={12}>
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <ShopAddNewButton
                      onClick={() => onSubmitForm()}
                      className="float-right"
                      type="primary"
                      text={pageData.btnAddNew}
                    ></ShopAddNewButton>
                  ),
                  permission: PermissionKeys.CREATE_PRODUCT_CATEGORY
                },
                {
                  action: (
                    <button className="action-cancel" onClick={() => onCancel()}>
                      {pageData.btnCancel}
                    </button>
                  ),
                  permission: null
                }
              ]}
            />
          </Col>
        </Row>
        <Row>
          <div className="w-100">
            <Card className="shop-card">
              <h2 className="label-information mt-16">{pageData.generalInformation.title}</h2>
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <h3 className="shop-form-label mt-16">
                    {pageData.generalInformation.name.label}
                    <span className="text-danger">*</span>
                  </h3>
                  <Form.Item
                    name={['name']}
                    className="item-name"
                    rules={[
                      {
                        required: pageData.generalInformation.name.required,
                        message: pageData.generalInformation.name.validateMessage
                      }
                    ]}
                  >
                    <Input
                      className="shop-input-with-count"
                      showCount
                      placeholder={pageData.generalInformation.name.placeholder}
                      maxLength={pageData.generalInformation.name.maxLength}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={24} lg={12} span={12}>
                  <div className="d-flex">
                    <h3 className="shop-form-label mt-16">
                      {pageData.priority.title}
                      <span className="text-danger">*</span>
                    </h3>
                    <Tooltip placement="topLeft" title={pageData.priority.tooltip}>
                      <span className="ml-12 mt-16">
                        <ExclamationIcon />
                      </span>
                    </Tooltip>
                  </div>
                  <Form.Item
                    name={['priority']}
                    rules={[
                      {
                        required: true,
                        message: pageData.priority.validateMessage
                      }
                    ]}
                  >
                    <InputNumber
                      placeholder={pageData.priority.placeholder}
                      className="shop-input-number w-100"
                      min={1}
                      max={1000000}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>{renderSelectProduct()}</Row>
              <Row>{renderSelectedProduct()}</Row>
            </Card>
          </div>
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
        onOk={handleCompleted}
        isChangeForm={isChangeForm}
      />
    </>
  )
}
