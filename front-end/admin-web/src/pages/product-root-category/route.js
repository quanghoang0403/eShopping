import { Category } from "constants/icons.constants"
import RootCategory from "./root-category.page"
import i18n from "utils/i18n"
import { PermissionKeys } from "constants/permission-key.constants"
import createRootCategory from "./create-root-category"

const { t } = i18n
const route = [
    {
        key: 'app.product-root-category',
        position: 2,
        path: '/product-root-category',
        icon: <Category />,
        name: t('home.menuRootCategory'),
        isMenu: true,
        exact: true,
        auth: true,
        permission: 'public',
        component: RootCategory,
        child: []
    },
    {
        key: 'app.product-root-category.create',
        position: 3,
        path: '/product-root-category/create',
        isMenu: false,
        exact: true,
        auth: true,
        permission: PermissionKeys.CREATE_PRODUCT_CATEGORY,
        component: createRootCategory,
        child: []
    },
]
export default route