import StaffPage from '.'
import { GroupFill } from 'constants/icons.constants'
import { PermissionKeys } from 'constants/permission-key.constants'
import i18n from 'utils/i18n'
import { CreateNewStaff } from './create-new-staff/create-new-staff.page'
import { EditStaff } from './edit-staff/edit-staff.page'
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
    child: [
      {
        key: 'app.staff.create-new',
        focus: 'app.staff',
        position: 4,
        path: '/staff/create-new',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.ADMIN,
        component: CreateNewStaff,
        child: []
      },
      {
        key: 'app.staff.edit-staff',
        focus: 'app.staff',
        position: 4,
        path: '/staff/edit/:id',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.ADMIN,
        component: EditStaff,
        child: []
      }
    ]
  }
]
export default route
