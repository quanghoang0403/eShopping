import BlogPage from ".";
import { Blog } from "constants/icons.constants";

// Define the route
const route = [
  {
    key: "app.blog",
    position: 5,
    path: "/blog",
    icon: <Blog />,
    name: "Bài viết",
    isMenu: true,
    exact: true,
    auth: true,
    permission: "public",
    component: BlogPage,
    child: [],
  },
];
export default route;
