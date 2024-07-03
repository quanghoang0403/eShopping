import { Button, Col, Form, Image, Row, Typography, message, Tooltip } from 'antd'
import { images } from 'constants/images.constants'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import PageTitle from 'components/page-title'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ProductStatus } from 'constants/product-status.constants'
import productDataService from 'data-services/product/product-data.service';
import { useEffect, useState } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { formatCurrency, formatNumber, getCurrency } from 'utils/helpers'
import DeleteProductComponent from '../components/delete-product.component'
import FnbFroalaEditor from 'components/shop-froala-editor'
import './index.scss'
import { useTranslation } from 'react-i18next';
import { ExclamationIcon } from 'constants/icons.constants';
import StockProductTable from '../components/stock-product.component'
import moment from 'moment'
import ShopActiveStatus from 'components/shop-active-status/shop-active-status.component'
const { Text } = Typography

export default function ProductDetailPage(props) {
  const history = useHistory()
  const match = useRouteMatch()
  const [product, setProduct] = useState()
  const [activate, setActivate] = useState(null)
  const [statusId, setStatusId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [titleModal, setTitleModal] = useState()
  const [productRootCategory,setProductRootCategory] = useState()
  const [productsizeCategory,setProductSizeCategory] = useState()
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const pageData = {
    noProductCategory: t('product.NoProductCategory'),
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
    SEOInformation: {
      title: t('form.SEOConfiguration'),
      keyword: {
        label: t('form.SEOKeywords'),
        tooltip: t('form.SEOKeywordsTooltip')
      },
      SEOtitle: {
        label: t('form.SEOTitle'),
        tooltip: t('form.SEOTitleTooltip')
      },
      description: {
        label: t('form.SEODescription'),
        tooltip: t('form.SEODescriptionTooltip')
      }
    },
    pricing: {
      title: t('product.priceInfo'),
      price: t('product.labelPrice'),
      addPrice: t('product.addPrice'),
      discountCheck: t('product.labelDiscountCheck'),
      noDiscount: t('product.noDiscountLabel'),
      priceOriginal: {
        label: t('product.labelPriceOriginal')
      },
      discount: {
        numeric: {
          label: t('product.labelPriceDiscount')
        },
        percentage: {
          label: t('product.labelPriceDiscountPercentage')
        }
      },
      quantity: {
        sold: {
          label: t('product.labelQuantitySold')
        },
        remaining: {
          label: t('product.labelQuantityLeft')
        }
      },
      priceDate: {
        discountDate: t('product.discountDate')
      }
    },
    productCategory: {
      label: t('product.labelCategory'),
      name: {
        label: t('productCategory.labelName')
      }
    },
    productRootCategory:{
      labelProductRootCategory: t('product.labelProductRootCategory'),
      name: t('productCategory.labelName')
    },
    productSizeCategory:{
      labelProductSizeCategory: t('product.labelProductSizeCategory'),
      name: t('productCategory.labelName')
    },
    content: {
      label: t('product.labelProductContent')
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
    deactivate: t('product.deactivate')
  }

  useEffect(async () => {
    getInitData()
  }, [])

  const getInitData = async () => {
    const productResponse = await productDataService.getProductByIdAsync(match?.params?.id);
    const productPreparedDataResponse =  await productDataService.getPreparedDataProductAsync()
    if(productResponse){
      const parsedData = {
        ...productResponse,
        productVariants: productResponse?.productVariants.map((productVariant, index) => ({
          ...productVariant,
          key: index + 1,
          startDate: productVariant.startDate ? moment(productVariant.startDate) : null,
          endDate: productVariant.endDate ? moment(productVariant.endDate) : null
        })),
        startDate: productResponse.startDate ? moment(productResponse.startDate) : null,
        endDate: productResponse.endDate ? moment(productResponse.endDate) : null
      };
      form.setFieldsValue(parsedData)
      setProduct(parsedData);
      setStatusId(productResponse?.status);
      if (productResponse?.status === ProductStatus.Activate) {
        setActivate(pageData.activate);
      } else {
        setActivate(pageData.deactivate);
      }
      if(productPreparedDataResponse){
        setProductRootCategory(productPreparedDataResponse?.productRootCategories.find(prc=>prc.id === productResponse?.productRootCategoryId))
        setProductSizeCategory(productPreparedDataResponse?.productSizeCategories.find(psc=>psc.id === productResponse?.productSizeCategoryId))
      }

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
  const onDeleteItem = async () => {
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
    const { id } = product
    var res = await productDataService.deleteProductByIdAsync(id);
    if (res) {
      message.success(pageData.productDeleteSuccess);
    } else {
      message.error(pageData.productDeleteFail);
    }
    setIsModalVisible(false);
    window.location.href = '/product';
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
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} lg={12} className='edit-title'>
          <Row>
            <p className="card-header">
              <PageTitle content={product?.name} />
            </p>
            <ShopActiveStatus status={product?.isActive}/>
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
      <Form layout="vertical" autoComplete="off" className="product-detail-form" form={form} disabled>
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

                <div className="list-price" style={{ marginLeft: '18px' }}>
                  <Row className="price-item mb-4">
                    <Col span={24} className="col-title">
                      <Row className="w-100">
                        <Col span={24}>
                          <Row className="box-product-price">
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <Text className="text-name pr-4" style={{ marginLeft: '30px' }}>
                                <li className="pr-5">{product?.priceName} </li>
                              </Text>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Row className='w-100'>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Row className='my-2'>
                          <Col xs={12} sm={24} md={24} lg={10}>
                            <Text className="text-name text-bold" style={{ marginLeft: '16px' }}>
                              <li className="text-bold">{pageData.pricing.priceOriginal.label} </li>
                            </Text>
                          </Col>
                          <Col xs={12} sm={24} md={24} lg={10}>
                            <Text className="text-name text-bold" style={{ marginLeft: '90px' }}>
                              <li className="text-bold">{formatNumber(product?.priceOriginal)} </li>
                            </Text>
                          </Col>
                          <Col xs={12} sm={24} md={24} lg={4}>
                            <Text className="text-name" style={{ color: '#9F9F9F' }}>
                              <li>{getCurrency()} </li>
                            </Text>
                          </Col>
                        </Row>
                        <Row className='my-2'>
                          <Col xs={12} sm={24} md={24} lg={10}>
                            <Text className="text-name text-bold" style={{ marginLeft: '16px' }}>
                              <li className="text-bold">{pageData.pricing.title} </li>
                            </Text>
                          </Col>
                          <Col xs={12} sm={24} md={24} lg={10}>
                            <Text className="text-name text-bold" style={{ marginLeft: '90px' }}>
                              <li className="text-bold">{formatNumber(product?.priceValue)} </li>
                            </Text>
                          </Col>
                          <Col xs={12} sm={24} md={24} lg={4}>
                            <Text className="text-name" style={{ color: '#9F9F9F' }}>
                              <li>{getCurrency()} </li>
                            </Text>
                          </Col>
                        </Row>

                      </Col>
                    </Row>
                    <Row className={`${product?.priceDiscount === 0 && product?.percentNumber === 0 ? 'd-none' : 'w-100'}`}>
                      <Col span={24}>
                        <Row className='mb-2 w-100'>
                          <Col xs={24} sm={24} md={24} lg={10} >
                            <Text className="text-name text-bold ml-3">{pageData.pricing.discount.numeric.label}</Text>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={10} className='pl-4'>
                            <Text className="text-name text-bold pl-5 ml-3">{formatNumber(product?.priceDiscount)}</Text>
                          </Col>
                          <Col xs={12} sm={24} md={24} lg={2}>
                            <Text className="text-name" style={{ color: '#9F9F9F' }}>
                              <li>{getCurrency()} </li>
                            </Text>
                          </Col>
                        </Row>
                        <Row className='my-2'>
                          <Col xs={24} sm={24} md={24} lg={12}>
                            <Text className="text-name text-bold ml-3">{pageData.pricing.discount.percentage.label}</Text>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={12}>
                            <Text className="text-name text-bold ml-5">{product?.percentNumber}%</Text>
                          </Col>
                        </Row>
                        <Row className='my-2'>
                          <Col xs={24} sm={24} md={24} lg={9} className='pl-3'>
                            <Text className="text-name text-bold">{pageData.pricing.priceDate.discountDate}</Text>
                          </Col>
                          <Col xs={11} sm={11} md={11} lg={7} className='pl-4'>
                            <Text className="text-name">{product?.startDate.format('DD-MM-YYYY') || ''}</Text>
                          </Col>
                          <Col span={1}>
                                  -
                          </Col>
                          <Col xs={11} sm={11} md={11} lg={7} className='pr-4'>
                            <Text className="text-name text-secondary ">{product?.endDate.format('DD-MM-YYYY') || ''}</Text>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Row>
                </div>
              </div>
            </div>
            <div className="card-genaral padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.SEOInformation.title}</Text>
              </div>
              <div className="product-detail-div d-flex">
                <Text className="text-item">{pageData.SEOInformation.SEOtitle.label}</Text>
                <Tooltip placement="topLeft" title={pageData.SEOInformation.SEOtitle.tooltip}>
                  <span className="ml-2 mt-1">
                    <ExclamationIcon />
                  </span>
                </Tooltip>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{product?.titleSEO}</Text>
              </div>
              <div className="product-detail-div d-flex">
                <Text className="text-item">{pageData.SEOInformation.description.label}</Text>
                <Tooltip placement="topLeft" title={pageData.SEOInformation.description.tooltip}>
                  <span className="ml-2 mt-1">
                    <ExclamationIcon />
                  </span>
                </Tooltip>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{product?.descriptionSEO}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{pageData.SEOInformation.keyword.label}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-name">{product?.keywordSEO}</Text>
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
                <Image width={176} src={product?.thumbnail ?? 'error'} fallback={images.productDefault} />
              </div>
            </div>
            <div className="form-image padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.productCategory.label}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{productRootCategory?.productCategories?.find(pc=>pc.id === product?.productCategoryId)?.name || pageData.noProductCategory}</Text>
              </div>
            </div>

            <div className="form-image padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.productRootCategory.labelProductRootCategory}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{productRootCategory?.name || pageData.noProductCategory}</Text>
              </div>
            </div>

            <div className="form-image padding-t-l-b">
              <div className="div-title">
                <Text className="text-title">{pageData.productSizeCategory.labelProductSizeCategory}</Text>
              </div>
              <div className="product-detail-div">
                <Text className="text-item">{productsizeCategory?.name || pageData.noProductCategory}</Text>
              </div>
            </div>
          </div>
        </Row>

        <DeleteProductComponent
          isModalVisible={isModalVisible}
          titleModal={titleModal}
          handleCancel={() => handleCancel()}
          onDelete={handleDeleteItem}
        />
        <StockProductTable form={form} productSizes={product?.productStocks} productData={product}/>
      </Form>
    </>
  )
}
