import { NavItemType } from "@/shared/Navigation/NavigationItem";
import { ncNanoId } from "@/utils/string.helper";

export const NAVIGATION_DEMO: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/collection",
    name: "Nam",
  },
  {
    id: ncNanoId(),
    href: "/collection",
    name: "Nữ",
  },
  {
    id: ncNanoId(),
    href: "/search",
    name: "Danh mục",
  },
  {
    id: ncNanoId(),
    name: "Khác",
    type: "dropdown",
    children: [
      {
        id: ncNanoId(),
        href: "/blog",
        name: "Bài viết",
      },
      {
        id: ncNanoId(),
        href: "/about",
        name: "Về chúng tôi",
      },
      {
        id: ncNanoId(),
        href: "/contact",
        name: "Liên hệ",
      },
    ],
  },
];
