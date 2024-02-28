import PromotionPage from '.'
import { Promotion } from 'constants/icons.constants'

// Define the route
const route = [
  {
    key: 'app.prmotion',
    position: 4,
    path: '/promotion',
    icon: <Promotion />,
    name: 'Khuyến mãi',
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: PromotionPage,
    child: []
  }
]
export default route
