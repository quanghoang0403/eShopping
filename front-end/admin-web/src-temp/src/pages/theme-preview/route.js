import { ThemePreviewPage } from "./theme-preview.page";

const route = [
  {
    key: "app.onlineStore.theme-preview",
    position: 1,
    path: "/theme-preview/:themeId/:path",
    name: "Theme preview",
    isMenu: false,
    exact: false,
    auth: false,
    component: ThemePreviewPage,
    child: [],
  },
];

export default route;
