import {
  HyperlinkAboutUsIcon,
  HyperlinkBlogDetailIcon,
  HyperlinkBlogIcon,
  HyperlinkCategoryIcon,
  HyperlinkContactIcon,
  HyperlinkHomePageIcon,
  HyperlinkMyPageIcon,
  HyperlinkProductDetailIcon,
  HyperlinkProductIcon,
  HyperlinkSubMenuIcon,
  HyperlinkUrlIcon,
} from "../assets/icons.constants";

export const Hyperlink = {
  HOME_PAGE: 1,
  PRODUCTS: 2,
  CONTACT: 3,
  ABOUT_US: 4,
  BLOGS: 5,
  URL: 6,
  CATEGORY: 7,
  PRODUCT_DETAIL: 8,
  MY_PAGES: 9,
  BLOG_DETAIL: 10,
  SUB_MENU: 11,
};

export const HYPERLINK_SELECT_OPTION = [
  {
    id: Hyperlink.HOME_PAGE,
    name: "menuManagement.menuItem.hyperlink.homePage",
    icon: <HyperlinkHomePageIcon />,
  },
  {
    id: Hyperlink.PRODUCTS,
    name: "menuManagement.menuItem.hyperlink.product",
    icon: <HyperlinkProductIcon />,
  },
  // {
  //   id: Hyperlink.CONTACT,
  //   name: "menuManagement.menuItem.hyperlink.contact",
  //   icon: <HyperlinkContactIcon />,
  // },
  // {
  //   id: Hyperlink.ABOUT_US,
  //   name: "menuManagement.menuItem.hyperlink.aboutUs",
  //   icon: <HyperlinkAboutUsIcon />,
  // },
  {
     id: Hyperlink.BLOGS,
     name: "menuManagement.menuItem.hyperlink.blogs",
     icon: <HyperlinkBlogIcon />,
  },
  {
    id: Hyperlink.URL,
    name: "menuManagement.menuItem.hyperlink.url",
    icon: <HyperlinkUrlIcon />,
  },
  {
    id: Hyperlink.CATEGORY,
    name: "menuManagement.menuItem.hyperlink.category",
    icon: <HyperlinkCategoryIcon />,
  },
  {
    id: Hyperlink.PRODUCT_DETAIL,
    name: "menuManagement.menuItem.hyperlink.productDetail",
    icon: <HyperlinkProductDetailIcon />,
  },
  // {
  //   id: Hyperlink.MY_PAGES,
  //   name: "menuManagement.menuItem.hyperlink.myPage",
  //   icon: <HyperlinkMyPageIcon />,
  // },
  // {
  //   id: Hyperlink.BLOG_DETAIL,
  //   name: "menuManagement.menuItem.hyperlink.blogDetail",
  //   icon: <HyperlinkBlogDetailIcon />,
  // },
  // {
  //   id: Hyperlink.SUB_MENU,
  //   name: "menuManagement.menuItem.hyperlink.subMenu",
  //   icon: <HyperlinkSubMenuIcon />,
  // },
];

export const CUSTOM_HYPERLINK = [
  Hyperlink.HOME_PAGE,
  Hyperlink.PRODUCTS,
  Hyperlink.CONTACT,
  Hyperlink.ABOUT_US,
  Hyperlink.BLOGS,
];

export const DYNAMIC_HYPERLINK = [
  Hyperlink.URL,
  Hyperlink.CATEGORY,
  Hyperlink.PRODUCT_DETAIL,
  Hyperlink.MY_PAGES,
  Hyperlink.BLOG_DETAIL,
  Hyperlink.SUB_MENU,
];

// The hyperlinkModel object is the standard model. It allows you to rely on it to prepare corresponding data variables for hyperlinks.
export const hyperlinkModel = {
  products: [],
  productCategories: [],
  subMenus: [],
  pages: [],
};
