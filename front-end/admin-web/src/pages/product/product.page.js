import { Card, Col, Row, Space } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import PageTitle from 'components/page-title'
import { PermissionKeys } from 'constants/permission-key.constants'
import TableProduct from './components/table-product.component'
import './index.scss'
import { useTranslation } from 'react-i18next'

export default function ProductPage (props) {
  const { t } = useTranslation()
  return (
    <div>
      <Row className="fnb-row-page-header">
        <Col xs={24} sm={24} xl={12}>
          <Space className="page-title">
            <PageTitle content="Quản lý sản phẩm" />
          </Space>
        </Col>
        <Col xs={24} sm={24} xl={12} className="button-box product-filter-box page-action-group">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <ShopAddNewButton
                    permission={PermissionKeys.CREATE_PRODUCT}
                    onClick={() => props.history.push('/product/create-new')}
                    text="Thêm mới"
                  />
                ),
                permission: PermissionKeys.CREATE_PRODUCT
              }
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="fnb-card cart-with-no-border">
        <TableProduct />
      </Card>
    </div>
  )
}
