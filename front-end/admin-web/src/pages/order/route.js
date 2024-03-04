import OrderPage from './order.page'
import { Order } from 'constants/icons.constants'
import i18n from 'utils/i18n'
import { PermissionKeys } from 'constants/permission-key.constants'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.order',
    position: 3,
    path: '/order',
    icon: <Order />,
    name: t('home:menuOrder'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: OrderPage,
    child: [
      {
        key: 'app.order.detail',
        position: 5,
        path: '/order/detail/:id',
        name: 'OrderDetail',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_ORDER,
        component: OrderDetail,
        child: []
      }
    ]
  }
]
export default route
