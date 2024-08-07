import ProductPage from './product/product.page'
import { Category, Clothing } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'
import CreateProductPage from './product/edit-product/create-product.page'
import EditProductPage from './product/edit-product/edit-product.page'
import ProductDetailPage from './product/details/details-product.page'
import ProductSizePage from './product-size/product-size-category.page'

const { t } = i18n
const route = [
  {
    key: 'app.product-management',
    position: 2,
    path: '#',
    icon: <Clothing />,
    name: t('home.menuProduct'),
    isMenu: true,
    exact: true,
    auth: true,
    child: [
      {
        key: 'app.product',
        position: 1,
        path: '/product',
        name: t('home.menuProduct'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_PRODUCT,
        component: ProductPage,
        child: []
      },
      {
        key: 'app.product.create',
        focus: 'app.product',
        position: 1,
        path: '/product/create',
        name: 'edit',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.CREATE_PRODUCT,
        component: CreateProductPage,
        child: []
      },
      {
        key: 'app.product.edit',
        focus: 'app.product',
        position: 1,
        path: '/product/edit/:id',
        name: 'edit',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.EDIT_PRODUCT,
        component: EditProductPage,
        child: []
      },
      {
        key: 'app.product.details',
        focus: 'app.product',
        position: 1,
        path: '/product/detail/:id',
        name: 'Details',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_PRODUCT,
        component: ProductDetailPage,
        child: []
      },
      {
        key: 'app.product-size',
        position: 2,
        path: '/product-size',
        icon: <Category />,
        name: t('home.menuProductSize'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: PermissionKeys.VIEW_PRODUCT,
        component: ProductSizePage,
        child: []
      }
    ]
  }
]
export default route
