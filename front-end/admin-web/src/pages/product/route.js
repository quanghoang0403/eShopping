import ProductPage from ".";
import { Clothing } from "constants/icons.constants";

// Define the route
const route = [
  {
    key: "app.product",
    position: 1,
    path: "/product",
    icon: <Clothing />,
    name: "Sản phẩm",
    isMenu: true,
    exact: true,
    auth: true,
    permission: "public",
    component: ProductPage,
    child: [],
  },
];
export default route;
