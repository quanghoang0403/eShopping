import { Category } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'
import CategoryPage from './product-category/category.page'
import EditProductCategoryPage from './product-category/edit-category/edit-category.page'
import RootCategory from './product-root-category/root-category.page'
import CreateRootCategory from './product-root-category/create-root-category/create-root-category.page'
import EditProductRootCategory from './product-root-category/edit-product-root-category/edit-product-root-category.page'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.product-category-management',
    position: 3,
    path: '#',
    icon: <Category />,
    name: t('home.menuCategory'),
    isMenu: true,
    exact: true,
    auth: true,
    child: [
      {
        key: 'app.product-root-category',
        position: 1,
        path: '/product-root-category',
        name: t('home.menuRootCategory'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_PRODUCT_CATEGORY,
        component: RootCategory,
        child: []
      },
      {
        key: 'app.product-root-category.create',
        focus: 'app.product-root-category',
        position: 2,
        path: '/product-root-category/create',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.CREATE_PRODUCT_CATEGORY,
        component: CreateRootCategory,
        child: []
      },
      {
        key: 'app.product-root-category.edit',
        focus: 'app.product-root-category',
        position: 3,
        path: '/product-root-category/edit/:productRootCategoryId',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.EDIT_PRODUCT_CATEGORY,
        component: EditProductRootCategory,
        child: []
      },
      {
        key: 'app.product-category',
        position: 4,
        path: '/product-category',
        name: t('home.menuProductCategory'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_PRODUCT_CATEGORY,
        component: CategoryPage,
        child: []
      },
      {
        key: 'app.product-category.edit',
        focus: 'app.product-category',
        position: 5,
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
  }
]
export default route
