import BlogPage from './blog.page'
import { Blog } from 'constants/icons.constants'
import i18n from 'utils/i18n'

const { t } = i18n
// Define the route
const route = [
  {
    key: 'app.blog',
    position: 5,
    path: '/blog',
    icon: <Blog />,
    name: t('home:menuBlog'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: BlogPage,
    child: []
  }
]
export default route
