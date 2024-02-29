import PromotionPage from '.'
import { Promotion } from 'constants/icons.constants'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.prmotion',
    position: 4,
    path: '/promotion',
    icon: <Promotion />,
    name: t('home:menuPromotion'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: PromotionPage,
    child: []
  }
]
export default route
