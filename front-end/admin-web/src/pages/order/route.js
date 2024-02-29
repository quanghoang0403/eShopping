import OrderPage from '.'
import { Order } from 'constants/icons.constants'
import i18n from 'utils/i18n'

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
    child: []
  }
]
export default route
