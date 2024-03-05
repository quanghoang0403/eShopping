import PromotionPage from './promotion.page'
import { Promotion } from 'constants/icons.constants'
import i18n from 'utils/i18n'
import { PermissionKeys } from 'constants/permission-key.constants'
import CreateNewPromotionManagement from './create-new-promotion/create-new-promotion.page'
import EditPromotionManagement from './edit-promotion/edit-promotion.page'
import DetailPromotionManagement from './detail-promotion/detail-promotion.page'
const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.promotion',
    position: 4,
    path: '/promotion',
    icon: <Promotion />,
    name: t('home.menuPromotion'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: PromotionPage,
    child: []
  },
  {
    key: 'app.promotion-create',
    focus: 'app.promotion',
    position: 4,
    path: '/promotion/create',
    name: 'Create New Promotion',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.CREATE_PROMOTION,
    component: CreateNewPromotionManagement,
    child: []
  },
  {
    key: 'app.promotion-edit',
    focus: 'app.promotion',
    position: 4,
    path: '/promotion/edit/:id',
    name: 'Edit Promotion',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.EDIT_PROMOTION,
    component: EditPromotionManagement,
    child: []
  },
  {
    key: 'app.promotion-detail',
    focus: 'app.promotion',
    position: 4,
    path: '/promotion/detail/:id',
    name: 'Detail Promotion',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.VIEW_PROMOTION,
    component: DetailPromotionManagement,
    child: []
  }
]
export default route
