import StaffPage from '.'
import { GroupFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.staff',
    position: 7,
    path: '/staff',
    icon: <GroupFill />,
    name: t('home:menuStaff'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: StaffPage,
    child: []
  }
]
export default route
