import StaffPage from ".";
import { GroupFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";

// Define the route
const route = [
  {
    key: "app.staff",
    position: 7,
    path: "/staff",
    icon: <GroupFill />,
    name: "Nhân viên",
    isMenu: true,
    exact: true,
    auth: true,
    permission: "public",
    component: StaffPage,
    child: [],
  },
];
export default route;
