import { Card, Col, Row, message } from 'antd'
import ActionButtonGroup from 'components/action-button-group/action-button-group.component'
import { ShopAddNewButton } from 'components/shop-add-new-button/shop-add-new-button'
import PageTitle from 'components/page-title'
import { PermissionKeys } from 'constants/permission-key.constants'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import TableCustomer from './components/table-customer.component'

/**
 * Page Customer Management
 * description: page manage customer primary template
 */
export default function CustomerPage (props) {
  const [t] = useTranslation()
  const history = useHistory()
  const pageData = {
    customerManagement: t('customer.title'),
    btnCancel: t('button.cancel'),
    btnSave: t('button.save'),
    btnAddNew: t('button.addNew')
  }
  const createCustomerPage = '/customer/create'

  const gotoAddNewCustomerPage = () => {
    history.push(createCustomerPage)
  }

  return (
    <>
      <Row className="shop-row-page-header">
        <Col xs={24} sm={24} md={12} lg={12}>
          <PageTitle content={pageData.customerManagement} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} className="button-box product-filter-box customer-action-group-button">
          <ActionButtonGroup
            arrayButton={[
              {
                action: (
                  <ShopAddNewButton
                    permission={PermissionKeys.CREATE_CUSTOMER}
                    onClick={() => gotoAddNewCustomerPage(true)}
                    text={pageData.btnAddNew}
                  />
                ),
                permission: PermissionKeys.CREATE_CUSTOMER
              }
            ]}
          />
        </Col>
      </Row>
      <div className="clearfix"></div>
      <Card className="shop-card-full">
        <TableCustomer />
      </Card>
    </>
  )
}
