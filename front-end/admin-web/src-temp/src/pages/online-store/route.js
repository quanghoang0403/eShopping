import { OnlineStoreIcon } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";
import { RouteKey } from "constants/route.constants";
import i18n from "utils/i18n";
import { BlogPageManagement } from "./blog/blog-management-list/blog-management-list.page";
import CreateBlogPage from "./blog/create-blog/create-blog.page";
import EditBlogPage from "./blog/edit-blog/edit-blog.page";
import CreateMenuPage from "./menu-management/create/create-menu.page";
import EditMenuPage from "./menu-management/edit/edit-menu.page";
import { MenuManagement } from "./menu-management/menu-management.page";
import OnlineStoreManagementPage from "./online-store-management/online-store-management.page";
import CreatePageManagement from "./page-management/create-page-management/create-page-management.page";
import EditPageManagement from "./page-management/edit-page-management/edit-page-management.page";
import { PageManagement } from "./page-management/page-management.page";

const { t } = i18n;
const versionSupport = "2.0";

const route = {
  key: RouteKey.ONLINE_STORE,
  position: 7,
  path: "#",
  icon: <OnlineStoreIcon />,
  name: t("onlineStore.title"),
  isMenu: true,
  exact: true,
  auth: true,
  child: [
    {
      key: "app.onlineStore.menu",
      position: 7,
      path: "/online-store/management",
      name: t("onlineStore.title"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_THEME_STORE,
      component: OnlineStoreManagementPage,
      child: [],
    },
    {
      key: "app.onlineStore.menu-management",
      focus: "app.onlineStore.menu-management",
      position: 7,
      path: "/online-store/menu-management",
      name: "Menus",
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_MENU_MANAGEMENT,
      component: MenuManagement,
      child: [],
    },
    {
      key: "app.onlineStore.create-menu",
      focus: "app.onlineStore.menu-management",
      position: 7,
      path: "/menu-management/create-new",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_MENU_MANAGEMENT,
      component: CreateMenuPage,
      child: [],
    },
    {
      key: "app.onlineStore.edit-menu",
      focus: "app.onlineStore.menu-management",
      position: 6,
      path: "/menu-management/edit/:menuId",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.EDIT_MENU_MANAGEMENT,
      component: EditMenuPage,
      child: [],
    },
    {
      key: "app.page",
      position: 7,
      path: "/online-store/page-management",
      name: t("onlineStore.pageManagement.pageMenu"),
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_PAGE,
      component: PageManagement,
      child: [],
    },
    {
      key: "app.page",
      position: 7,
      path: "/online-store/page-management/create-page-management",
      name: t("onlineStore.pageManagement.createPage"),
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_PAGE,
      component: CreatePageManagement,
      child: [],
    },
    {
      key: "app.page",
      position: 7,
      path: "/online-store/page-management/edit-page-management/:id",
      name: t("onlineStore.pageManagement.editPage"),
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.EDIT_PAGE,
      component: EditPageManagement,
      child: [],
    },
    {
      key: "app.page.BlogManagement",
      position: 8,
      path: "/online-store/blog-management",
      name: "Blogs",
      isMenu: true,
      exact: true,
      auth: true,
      permission: PermissionKeys.VIEW_BLOG,
      component: BlogPageManagement,
      child: [],
    },
    {
      key: "app.page.BlogCreate",
      position: 9,
      path: "/online-store/blog-management/create-blog",
      name: t("onlineStore.pageManagement.editPage"),
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_BLOG,
      component: CreateBlogPage,
      child: [],
    },
    {
      key: "app.onlineStore.blog-edit",
      focus: "app.page.BlogManagement",
      position: 9,
      path: "/online-store/blog-management/edit-blog/:id",
      isMenu: false,
      exact: true,
      auth: true,
      permission: PermissionKeys.CREATE_BLOG,
      component: EditBlogPage,
      child: [],
    },
  ],
};

export default route;
