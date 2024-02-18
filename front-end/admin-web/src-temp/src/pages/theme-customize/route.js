import { ThemeCustomizePage } from "./theme-customize.page";

const route = {
  key: "app.onlineStore.store-web",
  position: 1,
  path: "/online-store/theme-customize/:storeThemeId",
  name: "Store web 2",
  isMenu: false,
  exact: false,
  auth: false,
  component: ThemeCustomizePage,
  child: [],
};

export default route;
