import {
  AboutUsPageStoreWebIcon,
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
} from "constants/icons.constants";

export const listStoreWebPage = [
  {
    id: "726F7453-5765-6265-5061-676500000001",
    name: "storeWebPage.homePage",
    icon: HomePageStoreWebIcon,
  },
  {
    name: "storeWebPage.productList",
    icon: ProductListStoreWebIcon,
  },
  {
    name: "storeWebPage.productDetail",
    icon: ProductDetailStoreWebIcon,
  },
  {
    name: "storeWebPage.comboDetail",
    icon: ComboDetailStoreWebIcon,
  },
  {
    name: "storeWebPage.booking",
    icon: BookingStoreWebIcon,
  },
  {
    name: "storeWebPage.cartPage",
    icon: CartPageStoreWebIcon,
  },
  {
    name: "storeWebPage.checkoutPage",
    icon: CheckoutPageStoreWebIcon,
  },
  {
    name: "storeWebPage.registerPage",
    icon: RegisterPageStoreWebIcon,
  },
  {
    name: "storeWebPage.loginPage",
    icon: LoginPageStoreWebIcon,
  },
  {
    name: "storeWebPage.forgotPasswordPage",
    icon: ForgotPasswordPageStoreWebIcon,
  },
  {
    name: "storeWebPage.myProfilePage",
    icon: MyProfilePageStoreWebIcon,
  },
  {
    name: "storeWebPage.contactPage",
    icon: ContactPageStoreWebIcon,
  },
  {
    name: "storeWebPage.aboutUsPage",
    icon: AboutUsPageStoreWebIcon,
  },
];

export const customizationElementPageEnum = {
  Banner: 1,
  Advertisement: 2,
  Introduction: 3,
  ProductSlide: 4,
  Categories: 5,
  Testimonials: 6,
  Blogs: 7,
  Booking: 8,
  TodayMenu: 9,
  Checkout: 10,
  SlideShowTheme1: 11,
  CategoryTheme1: 12,
  BestSellingProductTheme1: 13,
  SignatureProductTheme1: 14,
  BookingTheme1: 15,
  BlogsTheme1: 16,
  BranchTheme1: 17,
};

export const backgroundTypeEnum = {
  Color: 1,
  Image: 2,
};

export const GeneralCustomizationEnum = {
  ColorGroup: 1,
  Image: 2,
  Color: 3,
};

export const amountMaximumOfBanner = 5;

export const theme2ElementRightId = {
  Header: "themeHeader",
  Footer: "themeFooter",
  Banner: "themeBanner",
  Advertisement: "element-right-advertisement-id",
  Introduction: "",
  ProductSlide: "",
  Categories: "",
  Testimonials: "",
  Blogs: "themeBlogs",
  Booking: "",
  TodayMenu: "themeTodayMenu",
  Checkout: "",
  HeaderProductList: "header-product-list",
  ProductProductList: "product-product-list",
};

export const theme1ElementRightId = {
  Header: "theme1Header",
  Footer: "theme1Footer",
  Banner: "",
  Advertisement: "",
  Introduction: "",
  ProductSlide: "",
  Categories: "",
  Testimonials: "",
  Blogs: "",
  Booking: "",
  TodayMenu: "",
  Checkout: "",
  BestSellingProduct: "theme1-best-selling-product-id",
  ProductDetail: "element-right-product-detail-id",
};

export const theme1ElementCustomize = {
  Banner: "customizeBanner",
  Advertisement: "",
  Introduction: "",
  ProductSlide: "",
  Categories: "customizeCategory",
  Testimonials: "",
  Blogs: "",
  HeaderBlogList: "customizeHeaderBlogList",
  BlogListBlog: "customizeBlogListBlog",
  Booking: "",
  TodayMenu: "",
  Checkout: "",
  BestSellingProduct: "customizeBestSellingProduct",
  ProductDetail: "customizeProductDetail",
  SignatureProduct: "customizeSignatureProduct",
  HeaderProductList: "customizeHeaderProductList",
  ProductProductList: "customizeProductProductList",
  HeaderCheckout: "customizeHeaderCheckout",
  CheckoutCheckout: "customizeCheckoutCheckout",
  RelatedProductsCheckout: "customizeRelatedProductCheckout",
  Header: "customizeHeader",
  Footer: "customizeFooter",
  HeaderReservation: "customizeHeaderReservation",
  ReservationReservation: "customizeReservationReservation",
};

export const changeChildComponentKey = {
  Theme1: {
    Banner: {
      BannerList: "Theme1_Banner_BannerList",
    },
  },
};
