import Home from ".";
// import { HomeFill } from "constants/icons.constants";
// Define the route
const route = [
  {
    key: "app.home",
    position: 0,
    path: "/",
    // icon: <HomeFill />,
    name: "Trang chủ",
    isMenu: true,
    exact: true,
    auth: true,
    permission: "public",
    component: Home,
    child: [],
  },
  {
    key: "app.home.hide",
    focus: "app.home",
    position: 0,
    path: "/home",
    // icon: <HomeFill />,
    name: "Home",
    isMenu: false,
    exact: true,
    auth: true,
    permission: "public",
    component: Home,
    child: [],
  },
];
export default route;
