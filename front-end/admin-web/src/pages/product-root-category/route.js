import { Category } from "constants/icons.constants"
import RootCategory from "./root-category.page"
import i18n from "utils/i18n"
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
]
export default route