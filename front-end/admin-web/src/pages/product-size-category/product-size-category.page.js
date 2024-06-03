import { Card, Col, Row, Space } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import PageTitle from 'components/page-title'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useTranslation } from 'react-i18next'
import TableProductSizeCategory from './components/product-size-category-table.component'
import { createContext, useContext, useState } from 'react'
import CreateProductSizeCategoryForm from './components/create-product-size-category.component'
import EditProductSizeCategoryModal from './components/edit-product-size-category.component'
const CurrentProductSizeCategoryContext = createContext()
export const useCurrentProductSizeCategoryContext = ()=> useContext(CurrentProductSizeCategoryContext)
export default function ProductSizePage() {
  const { t } = useTranslation()
  const [isChangeData,setIsChangeData] = useState(true)
  const [modalCreateSizeCategoryForm,setOpenCreateSizeCategoryForm] = useState(false)
  const [openEditModal,setOpenEditModal] = useState(false)
  const [currentProductSizeCategory,setCurrentProductSizeCategory] = useState(null)
  return (
    <CurrentProductSizeCategoryContext.Provider value={currentProductSizeCategory}>
      <div>
        <Row className="shop-row-page-header">
          <Col xs={24} sm={24} xl={12}>
            <Space className="page-title">
              <PageTitle content={t('home.menuProductSize')} />
            </Space>
          </Col>
          <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
            <ActionButtonGroup
              arrayButton={[
                {
                  action: (
                    <ShopAddNewButton
                      permission={PermissionKeys.CREATE_PRODUCT}
                      onClick={() => setOpenCreateSizeCategoryForm(true)}
                      text={t('button.add')}
                    />
                  ),
                  permission: PermissionKeys.CREATE_PRODUCT
                }
              ]}
            />
          </Col>
        </Row>
        <Card className="shop-card">
          <TableProductSizeCategory
            isChangeData={isChangeData}
            setIsChangeData={setIsChangeData}
            setCurrentProductSizeCategory={setCurrentProductSizeCategory}
            setOpenEditModal={setOpenEditModal}
          />
        </Card>
      </div>
      <CreateProductSizeCategoryForm
        visible={modalCreateSizeCategoryForm}
        openModal={setOpenCreateSizeCategoryForm}
        setIsChangeData={setIsChangeData}
      />
      <EditProductSizeCategoryModal
        visible={openEditModal}
        openModal={setOpenEditModal}
        setIsChangeData={setIsChangeData}
      />
    </CurrentProductSizeCategoryContext.Provider>
  );
}
