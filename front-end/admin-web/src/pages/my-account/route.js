import MyAccountPage from './my-account-page'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.myAccount',
    position: 0,
    path: '/my-account',
    name: 'MyAccount',
    isMenu: false,
    exact: false,
    auth: true,
    permission: 'public',
    component: MyAccountPage,
    child: []
  }
]
export default route
