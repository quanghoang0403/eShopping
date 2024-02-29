import CustomerPage from '.'
import { GroupFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.customer',
    position: 6,
    path: '/customer',
    icon: <GroupFill />,
    name: t('home:menuCustomer'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: CustomerPage,
    child: []
  }
]
export default route
