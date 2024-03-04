import React, { useState, useEffect } from 'react'
import { Card, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import PageTitle from 'components/page-title'
import TableProductCategory from './components/table-product-category.component'
import FormNewProductCategory from './components/form-new-product-category.component'
import { PermissionKeys } from 'constants/permission-key.constants'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import './index.scss'

export default function CategoryPage (props) {
  // const { productDataService, productCategoryDataService } = props
  const [showAddNewProductCategoryForm, setShowAddNewProductCategoryForm] = useState(false)
  const { t } = useTranslation()
  const pageData = {
    title: t('category:manageCategory'),
    button: {
      addNew: t('button:addNew')
    }
  }

  useEffect(() => {})

  return (
    <>
      {!showAddNewProductCategoryForm && (
        <>
          <Row className="shop-row-page-header">
            <Col className="category-title-box" xs={24} sm={12}>
              <PageTitle content={pageData.title} />
            </Col>
            <Col className="category-button-box" xs={24} sm={12}>
              <ShopAddNewButton
                className="float-right"
                permission={PermissionKeys.CREATE_PRODUCT_CATEGORY}
                onClick={() => setShowAddNewProductCategoryForm(true)}
                text={pageData.button.addNew}
              />
            </Col>
          </Row>
        </>
      )}

      <div className="clearfix"></div>
      {showAddNewProductCategoryForm
        ? (
        <>
          <FormNewProductCategory
            t={t}
            onCompleted={() => setShowAddNewProductCategoryForm(false)}
            // productCategoryDataService={productCategoryDataService}
            // productDataService={productDataService}
          />
        </>
          )
        : (
        <Card className="shop-card-full">
          <TableProductCategory />
        </Card>
          )}
    </>
  )
}
