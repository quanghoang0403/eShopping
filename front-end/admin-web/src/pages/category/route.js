import CategoryPage from '.'
import { Category } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'

// Define the route
const route = [
  {
    key: 'app.category',
    position: 2,
    path: '/category',
    icon: <Category />,
    name: 'Danh mục',
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: CategoryPage,
    child: []
  }
]
export default route
