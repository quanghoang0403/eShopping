import i18n from 'utils/i18n';
import BlogCategory from './blog-category.page';
import { Blog } from 'constants/icons.constants';
import { PermissionKeys } from 'constants/permission-key.constants';
import CreateBlogCategory from './create-blog-category/create-blog-category.page';
import EditBlogCategory from './edit-blog-category/edit-blog-category.page';

const { t } = i18n
const route = [
  {
    key: 'app.blog-category',
    position: 6,
    path: '/blog-category',
    icon: <Blog />,
    name: t('home.menuBlogCategory'),
    isMenu: true,
    exact: true,
    auth: true,
    permission: 'public',
    component: BlogCategory,
    child: []
  },
  {
    key: 'app.blog.blog-category-create',
    focus: 'app.blog-category',
    position: 9,
    path: '/blog-category/create-blog-category',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.ADMIN,
    component: CreateBlogCategory,
    child: []
  },
  {
    key: 'app.blog.blog-category-edit',
    focus: 'app.blog-category',
    position: 10,
    path: '/blog-category/edit/:blogCategoryId',
    isMenu: false,
    exact: true,
    auth: true,
    permission: PermissionKeys.ADMIN,
    component: EditBlogCategory,
    child: []
  }
]
export default route
