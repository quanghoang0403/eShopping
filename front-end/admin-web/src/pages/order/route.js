import OrderPage from '.'
import { Order } from 'constants/icons.constants'

// Define the route
const route = [
  {
    key: 'app.order',
    position: 3,
    path: '/order',
    icon: <Order />,
    name: 'Đơn hàng',
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: OrderPage,
    child: []
  }
]
export default route
