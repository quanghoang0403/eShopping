import BlogPage from './blog.page'
import { Blog } from 'constants/icons.constants'
import i18n from 'utils/i18n'
import EditBlogPage from './edit-blog/edit-blog.page'
import CreateBlogPage from './create-blog/create-blog.page'
import { PermissionKeys } from 'constants/permission-key.constants'
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
  },
  {
    key: 'app.blog.blog-create',
    focus: 'app.blog',
    position: 9,
    path: '/blog/create',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.CREATE_BLOG,
    component: CreateBlogPage,
    child: []
  },
  {
    key: 'app.blog.blog-edit',
    focus: 'app.blog',
    position: 9,
    path: '/blog/edit/:id',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.CREATE_BLOG,
    component: EditBlogPage,
    child: []
  }

]
export default route
