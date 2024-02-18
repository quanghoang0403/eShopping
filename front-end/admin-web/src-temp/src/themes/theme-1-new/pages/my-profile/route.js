import MyProfilePage from "./my-profile.page";
const route = [
  {
    key: "app.my-profile",
    position: 1,
    path: "/my-profile",
    name: "My Profile",
    isMenu: false,
    exact: true,
    auth: false,
    component: MyProfilePage,
    child: [],
  },
];
export default route;
