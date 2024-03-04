import CustomerPage from '.'
import { GroupFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'
import CreateCustomerPage from './create-customer/create-customer.page'
import EditCustomerPage from './edit-customer/edit-customer.page'
import DetailCustomerPage from './detail-customer/detail-customer.page'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.customer',
    position: 6,
    path: '/customer',
    icon: <GroupFill />,
    name: t('home:menuCustomer'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: CustomerPage,
    child: [
      {
        key: 'app.customer.create-customer',
        focus: 'app.customer',
        position: 3,
        path: '/customer/create',
        name: 'CustomerCreate',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.CREATE_CUSTOMER,
        component: CreateCustomerPage,
        child: []
      },
      {
        key: 'app.customer.edit-customer',
        focus: 'app.customer',
        position: 3,
        path: '/customer/edit/:customerId',
        name: 'CustomerEdit',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.EDIT_CUSTOMER,
        component: EditCustomerPage,
        child: []
      },
      {
        key: 'app.customer.detail-customer',
        focus: 'app.customer',
        position: 3,
        path: '/customer/detail/:customerId',
        name: 'CustomerDetail',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_CUSTOMER,
        component: DetailCustomerPage,
        child: []
      }
    ]
  }
]
export default route
