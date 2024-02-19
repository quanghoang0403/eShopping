import CustomerPage from ".";
import { GroupFill } from "constants/icons.constants";
import { PermissionKeys } from "constants/permission-key.constants";

// Define the route
const route = [
  {
    key: "app.customer",
    position: 6,
    path: "/customer",
    icon: <GroupFill />,
    name: "Khách hàng",
    isMenu: true,
    exact: true,
    auth: true,
    permission: "public",
    component: CustomerPage,
    child: [],
  },
];
export default route;
