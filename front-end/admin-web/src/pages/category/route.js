import CategoryPage from '.'
import { Category } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.category',
    position: 2,
    path: '/category',
    icon: <Category />,
    name: t('home:menuCategory'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: CategoryPage,
    child: []
  }
]
export default route
