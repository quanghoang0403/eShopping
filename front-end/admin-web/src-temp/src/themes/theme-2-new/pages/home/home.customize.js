import {
  AdvertisementStoreWebIcon,
  FlashSaleCustomize,
  IntroductionCustomizationIcon,
  StoreWebBannerIcon,
  TodayMenuStoreWebIcon,
  PromotionCustomizeIcon,
  BlogsIcon,
} from "../../assets/icons.constants";
import AdvertisementCustomization from "../../components/advertisement/advertisement-customization.component";
import BannerCustomizeComponent from "../../components/banner/banner-customize.component";
import FlashSaleCustomizeComponent from "../../components/flash-sale-customize/flash-sale-customize.component";
import { IntroductionCustomization } from "../../components/introduction/introduction-customization.component";
import {
  theme2ElementCustomize,
  theme2ElementRightId,
  theme2IdScrollView,
  theme2PageConfigName,
} from "../../constants/store-web-page.constants";
import { TodayMenuCustomization } from "./customize-components/today-menu-customize.component";
import PromotionCustomizeComponent from "./customize-components/promotion-customize.component";
import BlogsCustomize from "./customize-components/blogs-customize.component";

export const HomeCustomizes = [
  {
    icon: <StoreWebBannerIcon />,
    title: "storeWebPage.banner.title",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "banner"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    clickToScroll: theme2IdScrollView.Banner,
    customizeKey: theme2ElementCustomize.Banner,
    pageConfigName: theme2PageConfigName.Banner,
    content: (props) => {
      return <BannerCustomizeComponent {...props} />;
    },
  },
  {
    icon: <FlashSaleCustomize />,
    title: "storeWebPage.flashSale.title",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "flashSale"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme2ElementCustomize.FlashSale,
    clickToScroll: theme2IdScrollView.FlashSale,
    pageConfigName: theme2PageConfigName.FlashSale,
    content: (props) => {
      return <FlashSaleCustomizeComponent {...props} />;
    },
  },
  {
    icon: <PromotionCustomizeIcon />,
    title: "storeWebPage.promotion.title",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "promotionSection"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme2ElementCustomize.PromotionSection,
    clickToScroll: theme2IdScrollView.PromotionSection,
    pageConfigName: theme2PageConfigName.PromotionSection,
    content: (props) => {
      return <PromotionCustomizeComponent {...props} />;
    },
  },
  {
    icon: <AdvertisementStoreWebIcon />,
    title: "storeWebPage.advertisement.title",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "advertisement"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme2ElementCustomize.Advertisement,
    clickToScroll: theme2IdScrollView.Advertisement,
    pageConfigName: theme2PageConfigName.Advertisement,
    content: (props) => {
      return <AdvertisementCustomization {...props} />;
    },
  },
  {
    icon: <IntroductionCustomizationIcon />,
    title: "storeWebPage.introduction",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "introduction"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme2ElementRightId.Introduction,
    pageConfigName: theme2PageConfigName.Introduction,
    content: (props) => {
      return <IntroductionCustomization {...props} />;
    },
  },
  {
    icon: <TodayMenuStoreWebIcon />,
    title: "storeWebPage.todayMenuTitle",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "todayMenu"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme2ElementCustomize.TodayMenu,

    content: (props) => {
      return <TodayMenuCustomization {...props} />;
    },
  },
  {
    icon: <BlogsIcon />,
    title: "storeWebPage.blogsTitleCustomize",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "blogs"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme2ElementCustomize.Blogs,
    clickToScroll: theme2IdScrollView.Blogs,
    pageConfigName: theme2PageConfigName.Blogs,

    content: (props) => {
      return <BlogsCustomize {...props} />;
    },
  },
];
