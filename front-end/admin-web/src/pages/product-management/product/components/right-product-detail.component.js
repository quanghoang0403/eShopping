import { Card, Col, Form, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { FnbImageSelectComponent } from 'components/shop-image-select/shop-image-select.component';
import '../edit-product/edit-product.scss'
import { useTranslation } from 'react-i18next'
import { FnbSelectSingle } from 'components/shop-select-single/shop-select-single';
import { ProductGender, ProductGenderList } from 'constants/product-status.constants';
import ShopParagraph from 'components/shop-paragraph/shop-paragraph';
import productDataService from 'data-services/product/product-data.service';


export default function RightProductDetail({ form, productSizes, setProductSizes, productData }) {
  const { t } = useTranslation()
  const pageData = {
    productCategory: {
      label: t('product.labelCategory'),
      placeholder: t('product.placeholderCategory'),
      validateMessage: t('product.validateProductCategory')
    },
    productRootCategory: {
      label: t('product.labelProductRootCategory'),
      placeholder: t('product.placeholderProductRootCategory'),
      validateMessage: t('product.validateProductRootCategory')
    },
    gender: {
      label: t('product.labelGender'),
      placeholder: t('product.placeholderGender'),
      validateMessage: t('product.validateGender')
    },
    productSizeCategory: {
      label: t('product.labelProductSizeCategory'),
      placeholder: t('product.placeholderProductSizeCategory'),
      validateMessage: t('product.validateProductSizeCategory')
    },
    file: {
      title: t('file.title')
    },
    mediaNotExisted: t('product.validateImage')
  }
  const [productRootCategories, setProductRootCategories] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [preparedDataProduct, setPreparedDataProduct] = useState()

  const [activeProductGenderId, setActiveProductGenderId] = useState()
  const [activeProductRootCategoryId, setActiveProductRootCategoryId] = useState()

  const fetchPreparedDataProduct = async () => {
    const preparedDataProduct = await productDataService.getPreparedDataProductAsync()
    if (preparedDataProduct != null) {
      setPreparedDataProduct(preparedDataProduct);
      // Edit page
      if (productData) {
        const productRootCategory = preparedDataProduct?.productRootCategories?.find(x => x.id === productData.productRootCategoryId)
        setProductCategories(productRootCategory?.productCategories.filter(x => x.genderProduct == productData.genderProduct || x.genderProduct == ProductGender.All))
        setProductRootCategories(preparedDataProduct?.productRootCategories?.filter(x => x.genderProduct == productData.genderProduct || x.genderProduct == ProductGender.All))
      }
    }
  }

  useEffect(() => {
    fetchPreparedDataProduct()
  }, [])

  useEffect(() => {
    if (preparedDataProduct) {
      setProductRootCategories(preparedDataProduct?.productRootCategories?.filter(x => x.genderProduct == activeProductGenderId || x.genderProduct == ProductGender.All))
      setActiveProductRootCategoryId(null)
      form.setFieldValue('productRootCategoryId', null)
      form.setFieldValue('productCategoryId', null)
      setProductCategories([])
    }
  }, [activeProductGenderId])

  useEffect(() => {
    if (preparedDataProduct) {
      const productRootCategory = preparedDataProduct?.productRootCategories?.find(x => x.id === activeProductRootCategoryId)
      setProductCategories(productRootCategory?.productCategories.filter(x => x.genderProduct == activeProductGenderId || x.genderProduct == ProductGender.All))
      form.setFieldValue('productCategoryId', null)
    }
  }, [activeProductRootCategoryId])

  return (
    <Col className="right-create-product" xs={24} sm={24} md={24} lg={24}>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className="w-100 shop-card h-auto">
            <h4 className="title-group">{pageData.file.title}</h4>
            <Form.Item
              name={['thumbnail']}
              rules={[{
                required: true,
                message: pageData.mediaNotExisted
              }]}
            >
              <FnbImageSelectComponent
                customTextNonImageClass={'create-edit-product-text-non-image'}
                customNonImageClass={'create-edit-product-non-image'}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.gender.label}</h4>
            <Form.Item
              name={['genderProduct']}
              rules={[{
                required: true,
                message: pageData.gender.validateMessage
              }]}
            >
              <FnbSelectSingle
                onChange={(value) => setActiveProductGenderId(value)}
                noTranslateOptionName={true}
                option={ProductGenderList}
                placeholder={pageData.gender.placeholder}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <br />
          <Card className="w-100 mt-1 shop-card h-auto">
            <h4 className="title-group">{pageData.productRootCategory.label}</h4>
            <Form.Item
              name={['productRootCategoryId']}
              rules={[{
                required: true,
                message: pageData.productRootCategory.validateMessage
              }]}
            >
              <FnbSelectSingle
                onChange={(value) => setActiveProductRootCategoryId(value)}
                disabled={activeProductGenderId == null && !productData}
                placeholder={pageData.productRootCategory.placeholder}
                showSearch
                option={productRootCategories?.map((b) => ({
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
            <h4 className="title-group">{pageData.productCategory.label}</h4>
            <Form.Item
              name={['productCategoryId']}
              rules={[{
                required: true,
                message: pageData.productCategory.validateMessage
              }]}
            >
              <FnbSelectSingle
                disabled={!activeProductRootCategoryId && !productData}
                placeholder={pageData.productCategory.placeholder}
                showSearch
                option={productCategories?.map((b) => ({
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
            <h4 className="title-group">{pageData.productSizeCategory.label}</h4>
            <Form.Item
              name={['productSizeCategoryId']}
              rules={[{
                required: true,
                message: pageData.productSizeCategory.validateMessage
              }]}
            >
              <FnbSelectSingle
                onChange={(value) => setProductSizes(preparedDataProduct?.productSizeCategories?.find(x => x.id == value)?.productSizes)}
                placeholder={pageData.productCategory.placeholder}
                showSearch
                option={preparedDataProduct?.productSizeCategories?.map((b) => ({
                  id: b.id,
                  name: b.name
                }))}
              />
            </Form.Item>
            <ShopParagraph>{productSizes.map(_ => _.name).join(', ')}</ShopParagraph>
          </Card>
        </Col>
      </Row>
    </Col>
  );
}
