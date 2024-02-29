import HomePage from '.'
import { HomeFill } from 'constants/icons.constants'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.home',
    position: 0,
    path: '/',
    icon: <HomeFill />,
    name: t('home:menuHome'),
    isMenu: true,
    exact: true,
    // auth: true,
    permission: 'public',
    component: HomePage,
    child: []
  },
  {
    key: 'app.home.hide',
    focus: 'app.home',
    position: 0,
    path: '/home',
    icon: <HomeFill />,
    name: 'Home',
    isMenu: false,
    exact: true,
    auth: true,
    permission: 'public',
    component: HomePage,
    child: []
  }
]
export default route
