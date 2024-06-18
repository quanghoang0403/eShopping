import { GroupFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'
import DetailCustomerPage from './customer/detail-customer/detail-customer.page'
import EditCustomerPage from './customer/edit-customer/edit-customer.page'
import CreateCustomerPage from './customer/create-customer/create-customer.page'
import CustomerPage from './customer/customer.page'
import { EditStaff } from './staff/edit-staff/edit-staff.page'
import { CreateNewStaff } from './staff/create-new-staff/create-new-staff.page'
import StaffPage from './staff/staff.page'
const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.member-management',
    position: 4,
    path: '/staff',
    icon: <GroupFill />,
    name: t('home.menuMember'),
    isMenu: true,
    exact: true,
    auth: true,
    child: [
      {
        key: 'app.staff',
        position: 1,
        path: '/staff',
        name: t('home.menuStaff'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: 'public',
        component: StaffPage,
        child: [
        ]
      },
      {
        key: 'app.staff.create',
        focus: 'app.staff',
        position: 2,
        path: '/staff/create',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.ADMIN,
        component: CreateNewStaff,
        child: []
      },
      {
        key: 'app.staff.edit',
        focus: 'app.staff',
        position: 3,
        path: '/staff/edit/:id',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.ADMIN,
        component: EditStaff,
        child: []
      },
      {
        key: 'app.customer',
        position: 4,
        path: '/customer',
        name: t('home.menuCustomer'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: 'public',
        component: CustomerPage,
        child: []
      },
      {
        key: 'app.customer.create',
        focus: 'app.customer',
        position: 5,
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
        key: 'app.customer.edit',
        focus: 'app.customer',
        position: 6,
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
        key: 'app.customer.detail',
        focus: 'app.customer',
        position: 7,
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
