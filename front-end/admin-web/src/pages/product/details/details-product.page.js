import { Button, Col, Form, Image, Row, Typography, message } from 'antd'
import { images } from 'constants/images.constants'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import PageTitle from 'components/page-title'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ProductStatus } from 'constants/product-status.constants'
import productDataService from "data-services/product/product-data.service";
import { useEffect, useState } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { formatCurrency, formatNumber, getCurrency } from 'utils/helpers'
import DeleteProductComponent from '../components/delete-product.component'
import FnbFroalaEditor from 'components/shop-froala-editor'
import './index.scss'
import { useTranslation } from 'react-i18next'
const { Text } = Typography

export default function ProductDetailPage (props) {
  const history = useHistory()
  const match = useRouteMatch()
  const [product, setProduct] = useState({})
  const [activate, setActivate] = useState(null)
  const [statusId,setStatusId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [titleModal, setTitleModal] = useState()
  const { t } = useTranslation()
  const pageData = {
    btnDelete: t('button.delete'),
    btnEdit: t('button.edit'),
    btnLeave: t('button.leave'),
    generalInformation: {
      title: t('product.titleInfo'),
      name: {
        label: t('product.labelName')
      },
      description: {
        label: t('product.labelDescription')
      }
    },
    pricing: {
      title: t('product.priceInfo'),
      price: t('product.labelPrice')
    },
    productCategory: {
      label: t('product.labelCategory')
    },
    content:{
      label:t('product.labelProductContent')
    },
    media: t('file.media'),
    confirmDelete: t('dialog.confirmDelete'),
    notificationTitle: t('dialog.notificationTitle'),
    productDeleteSuccess: t('product.productDeleteSuccess'),
    productDeleteFail: t('product.productDeleteFail'),
    productActivatedSuccess: t('product.productActivatedSuccess'),
    productDeactivatedSuccess: t('product.productDeactivatedSuccess'),
    active: t('common.active'),
    inactive: t('common.inactive'),
    activate: t('product.activate'),
    deactivate: t('product.deactivate'),
    productCategory: {
      label: t('product.labelCategory'),
      name:{
        label:t('productCategory.labelName')
      }
    }

  }

  useEffect(async () => {
    getInitData()
  }, [])

  const getInitData = async () => {
    let response = await productDataService.getProductByIdAsync(match?.params?.id);
    setProduct(response.product);
    setStatusId(response?.product?.status);
    if (response?.product?.statusId === ProductStatus.Activate) {
      setActivate(pageData.activate);
    } else {
      setActivate(pageData.deactivate);
    }
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

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onDeleteItem = async() => {
    const { id } = product
    // productDataService.getAllOrderNotCompletedByProductIdAsync(id).then((res) => {
    //   const { preventDeleteProduct } = res;

    //   setPreventDeleteProduct(preventDeleteProduct);
    //   if (!preventDeleteProduct?.isPreventDelete) {
    //     setTitleModal(pageData.confirmDelete);
    //   } else {
    //     setTitleModal(pageData.notificationTitle);
    //   }
    //   setIsModalVisible(true);
    // });
    setIsModalVisible(true)
    setTitleModal(pageData.confirmDelete)
  }
  const handleDeleteItem = async () => {
    const {id} = product
    var res = await productDataService.deleteProductByIdAsync(id);
    if (res) {
      message.success(pageData.productDeleteSuccess);
    } else {
      message.error(pageData.productDeleteFail);
    }
    setIsModalVisible(false);
    window.location.href = "/product";
  }

  const onEditItem = (id) => {
    history.push(`/product/edit/${id}`)
  }

  const items = [
    {
      label: (
        <a
          className={activate === pageData.deactivate ? 'action-activate' : 'action-deactivate'}
          onClick={() => onChangeStatus()}
        >
          {activate}
        </a>
      ),
      permission: PermissionKeys.EDIT_PRODUCT,
      key: '0'
    },
    {
      label: (
        <a
          className="action-delete"
          onClick={() => {
            onDeleteItem()
          }}
        >
          {pageData.btnDelete}
        </a>
      ),
      key: '1',
      permission: PermissionKeys.EDIT_PRODUCT
    }
  ]

  return (
    <>
      <Form layout="vertical" autoComplete="off" className="product-detail-form">
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} lg={12}>
            <Row>
              <p className="card-header">
                <PageTitle content={product?.name} />
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
          <Col xs={24} sm={24} lg={12} className="shop-form-item-btn">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <Button type="primary" onClick={() => onEditItem(product?.id)} className="button-edit">
                      {pageData.btnEdit}
                    </Button>
                  ),
                  permission: PermissionKeys.EDIT_PRODUCT
                },
                {
                  action: (
                    <a onClick={() => history.push('/product')} className="action-cancel">
                      {pageData.btnLeave}
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
                    <a
                      className="action-delete"
                      onClick={() => {
                        onDeleteItem()
                      }}
                    >
                      {pageData.btnDelete}
                    </a>
                  ),
                  permission: PermissionKeys.EDIT_PRODUCT
                }
              ]}
            />
          </Col>
        </Row>
        <Row className="product-container">
          <div className="product-form-left">
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.generalInformation.title}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.generalInformation.name.label}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{product?.name}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.generalInformation.description.label}</Text>
              </div>
              <div className="div-text">
                <Text className="text-name">{product?.description}</Text>
              </div>
            </div>
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.pricing.title}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.pricing.price}</Text>
              </div>
              <div className="product-detail-div">
                {product?.productPrices?.length > 1 && (
                  <div className="list-price" style={{ marginLeft: '18px' }}>
                    {product?.productPrices?.map((item, index) => {
                      const position = index + 1
                      return (
                        <Row key={index} className="price-item mb-4">
                          <Col span={24} className="col-title">
                            <div className="m-4 title-center position-text position-mobile">{position + '.'}</div>
                            <Row className="w-100">
                              <Col span={24}>
                                <Row className="box-product-price">
                                  <Col xs={24} sm={24} md={24} lg={10}>
                                    <Text className="text-name pr-4" style={{ marginLeft: '30px' }}>
                                      <li className="pr-5">{item?.priceName} </li>
                                    </Text>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={14}>
                                    <Row>
                                      <Col xs={12} sm={24} md={24} lg={12}>
                                        <Text className="text-name text-bold" style={{ marginLeft: '30px' }}>
                                          <li className="text-bold">{formatNumber(item?.priceValue)} </li>
                                        </Text>
                                      </Col>
                                      <Col xs={12} sm={24} md={24} lg={2}>
                                        <Text className="text-name" style={{ color: '#9F9F9F' }}>
                                          <li>{getCurrency()} </li>
                                        </Text>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      )
                    })}
                  </div>
                )}
                {product?.productPrices?.length === 1 && (
                  <Text className="text-name">{formatCurrency(product?.productPrices[0]?.priceValue)}</Text>
                )}
              </div>
            </div>
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.content.label}</Text>
              </div>
              <div className="div-text">
                <FnbFroalaEditor
                value={product?.content}
                />
              </div>
            </div>
          </div>
          <div className="product-form-right">
            <div className="form-image padding-t-l-b">
              <Text className="text-title media">{pageData.media}</Text>
              <div className="content-img">
                <Image width={176} src={product?.thumbnail ?? "error"} fallback={images.productDefault} />
              </div>
            </div>
            <div className="form-image padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.productCategory.label}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.productCategory.name.label}</Text>
              </div>
              <div className="div-text">
                {product?.productCategories.map(pc=>{
                  return <Text className="text-title">{pc.name}</Text>
                })}
              </div>
            </div>
          </div>
        </Row>
      </Form>
      <DeleteProductComponent
        isModalVisible={isModalVisible}
        titleModal={titleModal}
        handleCancel={() => handleCancel()}
        onDelete={handleDeleteItem}
      />
    </>
  )
}
