import {
  BestSellingProductStoreWebIcon,
  BlogIcon,
  CategoryHomepageIcon,
  FlashSaleCustomize,
  ProductListStoreWebIcon,
  PromotionCustomizeIcon,
  StoreWebBannerIcon,
} from "../../assets/icons.constants";
import Theme1BestSellingProductCustomization from "../../components/best-selling-product.customize";
import CategoryHomepageCustomization from "../../components/category-homepage-customize/category-homepage-customize";
import { theme1ElementCustomize, theme1IdScrollView } from "../../constants/store-web-page.constants";
import BannerCustomizeComponent from "./components/banner/banner-detail.component";
import FlashSaleCustomizeComponent from "./customize-components/flash-sale-customize.component";
import { SignatureProductCustomize } from "./customize-components/signature-product-customize.component";
import PromotionCustomizeComponent from "./customize-components/promotion-customize.component";
import BlogCustomizeComponent from "./customize-components/blogs-customize.component";
export const HomeCustomizes = [
  {
    icon: <StoreWebBannerIcon />,
    title: "onlineStore.tags.theme1.slideBanner",
    isNormal: true,
    defaultActiveKey: null,
    iconRight: <></>,
    collapsible: false,
    isHasBackIcon: true,
    name: ["config", "banner"],
    isShowRightIconWhenHoverMouse: true,
    clickToScroll: theme1IdScrollView.Banner,
    customizeKey: theme1ElementCustomize.Banner,
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
    customizeKey: theme1ElementCustomize.FlashSale,
    clickToScroll: theme1IdScrollView.FlashSale,
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
    clickToScroll: theme1IdScrollView.PromotionSection,
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme1ElementCustomize.PromotionSection,
    content: (props) => {
      return <PromotionCustomizeComponent {...props} />;
    },
  },
  {
    icon: <CategoryHomepageIcon />,
    title: "storeWebPage.category",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "category"],
    clickToScroll: theme1IdScrollView.Categories,
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    customizeKey: theme1ElementCustomize.Categories,
    content: (props) => {
      return <CategoryHomepageCustomization {...props} />;
    },
  },
  {
    icon: <BestSellingProductStoreWebIcon />,
    title: "storeWebPage.bestSellingProductTitle",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    isHasBackIcon: true,
    name: ["config", "bestSellingProduct"],
    clickToScroll: theme1IdScrollView.BestSellingProduct,
    customizeKey: theme1ElementCustomize.BestSellingProduct,
    isShowRightIconWhenHoverMouse: true,
    content: (props) => {
      return (
        <>
          <Theme1BestSellingProductCustomization {...props} />
        </>
      );
    },
  },
  {
    icon: <ProductListStoreWebIcon />,
    title: "storeWebPage.signatureProduct",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "signatureProduct"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    clickToScroll: theme1IdScrollView.SignatureProduct,
    customizeKey: theme1ElementCustomize.SignatureProduct,
    content: (props) => {
      return <SignatureProductCustomize {...props} />;
    },
  },
  {
    icon: <BlogIcon />,
    title: "storeWebPage.blogs.title",
    isNormal: true,
    iconRight: <></>,
    collapsible: false,
    name: ["config", "blogs"],
    isHasBackIcon: true,
    isShowRightIconWhenHoverMouse: true,
    clickToScroll: theme1IdScrollView.Blogs,
    customizeKey: theme1ElementCustomize.Blogs,
    content: (props) => {
      return <BlogCustomizeComponent {...props} />;
    },
  },
];
