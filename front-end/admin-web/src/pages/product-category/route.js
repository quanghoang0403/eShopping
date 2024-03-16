import CategoryPage from '.'
import { Category } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'
import EditProductCategoryPage from './edit-category/edit-category.page'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.product-category',
    position: 2,
    path: '/product-category',
    icon: <Category />,
    name: t('home.menuCategory'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: CategoryPage,
    child: []
  },
  {
    key: 'app.product-category.edit',
    focus: 'app.category',
    position: 1,
    path: '/product-category/edit/:productCategoryId',
    name: 'Category',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.EDIT_PRODUCT_CATEGORY,
    component: EditProductCategoryPage,
    child: []
  }
]
export default route