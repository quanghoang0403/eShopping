import { Blog } from 'constants/icons.constants'
import i18n from 'utils/i18n'
import { PermissionKeys } from 'constants/permission-key.constants'
import BlogCategory from './blog-category/blog-category.page'
import CreateBlogCategory from './blog-category/create-blog-category/create-blog-category.page'
import EditBlogCategory from './blog-category/edit-blog-category/edit-blog-category.page'
import BlogPage from './blog/blog.page'
import CreateBlogPage from './blog/create-blog/create-blog.page'
import EditBlogPage from './blog/edit-blog/edit-blog.page'

const { t } = i18n
const route = [
  {
    key: 'app.blog-management',
    position: 5,
    path: '#',
    icon: <Blog />,
    name: t('home.menuBlog'),
    isMenu: true,
    exact: true,
    auth: true,
    child: [
      {
        key: 'app.blog',
        position: 1,
        path: '/blog',
        name: t('home.menuBlog'),
        isMenu: true,
        exact: true,
        auth: true,
        component: BlogPage,
        child: []
      },
      {
        key: 'app.blog.create',
        focus: 'app.blog',
        position: 2,
        path: '/blog/create',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.CREATE_BLOG,
        component: CreateBlogPage,
        child: []
      },
      {
        key: 'app.blog.edit',
        focus: 'app.blog',
        position: 3,
        path: '/blog/edit/:id',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.EDIT_BLOG,
        component: EditBlogPage,
        child: []
      },
      {
        key: 'app.blog-category',
        position: 4,
        path: '/blog-category',
        name: t('home.menuBlogCategory'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: 'public',
        component: BlogCategory,
        child: []
      },
      {
        key: 'app.blog-category.create',
        focus: 'app.blog-category',
        position: 5,
        path: '/blog-category/create-blog-category',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.CREATE_BLOG,
        component: CreateBlogCategory,
        child: []
      },
      {
        key: 'app.blog-category.edit',
        focus: 'app.blog-category',
        position: 6,
        path: '/blog-category/edit/:blogCategoryId',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.EDIT_BLOG,
        component: EditBlogCategory,
        child: []
      }
    ]
  }
]
export default route
