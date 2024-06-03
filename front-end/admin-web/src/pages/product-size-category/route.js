import i18n from 'utils/i18n'
import ProductSizePage from './product-size-category.page'
import { Category } from 'constants/icons.constants'
const { t } = i18n
const route = [
  {
    key: 'app.product-size-category',
    position: 2,
    path: '/product-size-category',
    icon: <Category />,
    name: t('home.menuProductSize'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: ProductSizePage,
    child: []
  }

]

export default route