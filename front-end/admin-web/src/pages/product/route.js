import ProductPage from '.'
import { Clothing } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import CreateProductPage from './edit-product/create-product.page'
import EditProductPage from './edit-product/edit-product.page'
import ProductDetailPage from './details/details-product.page'
// Define the route
const route = [
  {
    key: 'app.product',
    position: 1,
    path: '/product',
    icon: <Clothing />,
    name: 'Sản phẩm',
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: ProductPage,
    child: []
  },
  {
    key: 'app.product.create',
    focus: 'app.product',
    position: 1,
    path: '/product/create-new',
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
    path: '/product/details/:id',
    name: 'Details',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.VIEW_PRODUCT,
    component: ProductDetailPage,
    child: []
  }
]
export default route
