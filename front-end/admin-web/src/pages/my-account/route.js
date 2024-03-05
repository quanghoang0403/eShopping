import MyAccountPage from './my-account-page'
import i18n from 'utils/i18n'
import { SettingFill } from 'constants/icons.constants'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.myAccount',
    position: 8,
    path: '/my-account',
    icon: <SettingFill />,
    name: t('home.menuSetting'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: MyAccountPage,
    child: []
  }
]
export default route
