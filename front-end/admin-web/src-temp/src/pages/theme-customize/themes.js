/**
 * Collect the list theme info in the project
 */
import {
  AboutUsPageStoreWebIcon,
  BlogDetailStoreWebIcon,
  BookingStoreWebIcon,
  CartPageStoreWebIcon,
  CheckoutPageStoreWebIcon,
  ComboDetailStoreWebIcon,
  ContactPageStoreWebIcon,
  ForgotPasswordPageStoreWebIcon,
  HomePageStoreWebIcon,
  LoginPageStoreWebIcon,
  MyProfilePageStoreWebIcon,
  ProductDetailStoreWebIcon,
  ProductListStoreWebIcon,
  RegisterPageStoreWebIcon,
  BlogListPageTheme2Icon,
  BlogDetailPageTheme2Icon,
  ReserveTableCustomizeIcon,
} from "constants/icons.constants";
import PageType from "./page-type.constants";
import { ComputerIcon } from "themes/theme-1-new/assets/icons.constants";

let _themes = [];
const context = require.context("../../themes/", true, /theme.data.js$/);
context.keys().forEach((path) => {
  let themeRoutes = context(`${path}`).default;
  if (themeRoutes && themeRoutes.length > 0) {
    themeRoutes.forEach((route) => {
      _themes.push(route);
    });
  } else {
    _themes.push(themeRoutes);
  }
});

_themes = [...new Set(_themes)];

// mapping page icon
const themes = _themes.map((t) => {
  let { themeData } = t;
  const _pages = themeData.pages.map((page) => {
    switch (page.id) {
      case PageType.HOME_PAGE:
        page = {
          ...page,
          icon: <HomePageStoreWebIcon />,
        };
        break;
      case PageType.PRODUCT_LIST:
        page = {
          ...page,
          icon: <ProductListStoreWebIcon />,
        };
        break;
      case PageType.PRODUCT_DETAIL:
        page = {
          ...page,
          icon: <ProductDetailStoreWebIcon />,
        };
        break;
      case PageType.COMBO_DETAIL:
        page = {
          ...page,
          icon: <ComboDetailStoreWebIcon />,
        };
        break;
      case PageType.BOOKING:
        page = {
          ...page,
          icon: <BookingStoreWebIcon />,
        };
        break;
      case PageType.CART_PAGE:
        page = {
          ...page,
          icon: <CartPageStoreWebIcon />,
        };
        break;
      case PageType.CHECKOUT_PAGE:
        page = {
          ...page,
          icon: <CheckoutPageStoreWebIcon />,
        };
        break;
      case PageType.REGISTER_PAGE:
        page = {
          ...page,
          icon: <RegisterPageStoreWebIcon />,
        };
        break;
      case PageType.LOGIN_PAGE:
        page = {
          ...page,
          icon: <LoginPageStoreWebIcon />,
        };
        break;
      case PageType.FORGOT_PASSWORD_PAGE:
        page = {
          ...page,
          icon: <ForgotPasswordPageStoreWebIcon />,
        };
        break;
      case PageType.MY_PROFILE_PAGE:
        page = {
          ...page,
          icon: <MyProfilePageStoreWebIcon />,
        };
        break;
      case PageType.CONTACT_PAGE:
        page = {
          ...page,
          icon: <ContactPageStoreWebIcon />,
        };
        break;
      case PageType.ABOUT_US_PAGE:
        page = {
          ...page,
          icon: <AboutUsPageStoreWebIcon />,
        };
        break;
      case PageType.BLOG_PAGE:
        page = {
          ...page,
          icon: <BlogListPageTheme2Icon />,
        };
        break;
      case PageType.BLOG_DETAIL_PAGE:
        page = {
          ...page,
          icon: <BlogDetailPageTheme2Icon />,
        };
        break;
      case PageType.BLOG_LIST_PAGE:
        page = {
          ...page,
          icon: <ComputerIcon />,
        };
        break;

      // eslint-disable-next-line no-duplicate-case
      case PageType.BLOG_DETAIL_PAGE:
      default:
        page = {
          ...page,
          icon: <BlogDetailStoreWebIcon />,
        };
        break;

      case PageType.RESERVE_TABLE_PAGE:
        page = {
          ...page,
          icon: <ReserveTableCustomizeIcon />,
        };
        break;
    }

    return page;
  });

  return {
    ...t,
    themeData: {
      ...t.themeData,
      pages: _pages,
    },
  };
});

export default themes;
