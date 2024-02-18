import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { ScrollHeaderType } from "../constants/enums";
import { store } from "../modules";
import { setPackageExpiredInfo } from "../modules/session/session.actions";
import PackageExpiredDialog from "../shared/components/package-expired-dialog/package-expired-dialog.component";
import DefaultLogo from "./assets/images/pho-viet-logo.png";
import MetaInfo from "./components/MetaInfo";
import { AddToCartToastMessage } from "./components/add-update-to-cart-toast-message/add-to-cart-toast-message.component";
import { UpdateToCartToastMessage } from "./components/add-update-to-cart-toast-message/update-to-cart-toast.component";
import { ThemeOriginalFooter } from "./components/footer/footer.component";
import { Theme2OriginalHeader } from "./components/header.component";
import NotificationContainer from "./components/notification-container/notification-container.component";
import ToastMessageContainer from "./components/toast-message-container/toast-message-container";
import { theme2ElementCustomize } from "./constants/store-web-page.constants";
import defaultConfig from "./default-store.config";
import "./index.scss";
import { getRouteMetaInfo, themeToken } from "./theme.data";

export default function Index(props) {
  const themeConfigReduxState = useSelector((state) => state?.session?.themeConfig);
  const themeConfigMenu = useSelector((state) => state.session?.themeConfigMenu);
  const {
    contentPage: ContentComponent,
    clickToFocusCustomize,
    isDefault,
    isCustomize,
    fontFamily = themeToken.fontFamily,
  } = props;
  const [_fontFamily, setFontFamily] = useState(fontFamily);
  const [currentPageConfig, setCurrentPageConfig] = useState(null);
  const [colorFooterGeneral, setColorFooterGeneral] = useState();
  const logoDefault = {
    url: DefaultLogo,
    alt: "Logo",
  };
  const defaultThemePageConfig = defaultConfig;

  useEffect(() => {
    getPageConfig();
  }, []);

  useEffect(() => {
    let config = themeConfigReduxState;

    let currentColor = config?.general?.color?.colorGroups?.find(
      (x) => x.id === config?.general?.footer?.generalCustomization?.colorGroupId,
    );
    setColorFooterGeneral(currentColor);
    getPageConfig();

    const fontCustomized = config?.general?.font?.name;
    if (Boolean(isCustomize) && Boolean(fontCustomized)) {
      setFontFamily(fontCustomized);
    }

    store?.dispatch(setPackageExpiredInfo(null));
  }, [themeConfigReduxState]);

  function handleScrollBackToTop() {
    const currentScrollPos = window.scrollY;
    let prevScroll = window.scrollY;
    if (prevScroll > currentScrollPos) {
      const backToTopButtonElement = document.querySelector("#back2Top");
      if (backToTopButtonElement) {
        backToTopButtonElement.classList.add("d-none");
      }
    } else {
      const backToTopButtonElement = document.querySelector("#back2Top");
      if (backToTopButtonElement) {
        backToTopButtonElement.classList.remove("d-none");
      }
    }
    if (currentScrollPos <= 150 || prevScroll <= 150) {
      const backToTopButtonElement = document.querySelector("#back2Top");
      if (backToTopButtonElement) {
        backToTopButtonElement.classList.add("d-none");
      }
    }
  }

  // Init scroll handler
  useEffect(() => {
    let prevScrollPos = 0;
    const handleScroll = () => {
      handleScrollBackToTop();

      // Handle scroll header & category product list theme2
      if (themeConfigReduxState?.general?.header?.scrollType === ScrollHeaderType.FIXED) return;
      const currentScrollPos = window.scrollY;
      const headerThemeElement = document.getElementById("header-theme2");
      const heighHeader = headerThemeElement?.offsetHeight ?? 0;
      const elementCategoryProductList = document.getElementById("nav-category-sticky");
      if (prevScrollPos > currentScrollPos) {
        // Scrolling up, show the header
        if (headerThemeElement) headerThemeElement.style.top = "0";
        if (elementCategoryProductList) {
          elementCategoryProductList.style.top = `${heighHeader}px`;
        }
      } else {
        // Scrolling down, hide the header
        if (headerThemeElement) headerThemeElement.style.top = "-100px";
        if (elementCategoryProductList) {
          elementCategoryProductList.style.top = "0";
        }
      }
      if (currentScrollPos <= 0 || prevScrollPos <= 0) {
        if (headerThemeElement) headerThemeElement.style.top = "0";
      }
      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getPageConfig = () => {
    const { pageId } = props;

    if (!themeConfigReduxState?.pages) return;

    let pageConfig = themeConfigReduxState?.pages.find((p) => p.id === pageId);
    if (pageConfig) {
      const generalConfig = themeConfigReduxState?.general;
      if (
        generalConfig &&
        generalConfig.color &&
        generalConfig.color.colorGroups &&
        generalConfig.color.colorGroups.length > 0 &&
        pageConfig.config.colorGroupId
      ) {
        const pageColorGroup = generalConfig.color.colorGroups.find((g) => g.id === pageConfig.config.colorGroupId);
        if (pageColorGroup) {
          pageConfig = {
            ...pageConfig,
            config: {
              ...pageConfig.config,
              colorGroup: pageColorGroup,
            },
          };
        }
      }

      pageConfig = {
        ...pageConfig,
        general: generalConfig,
      };
      setCurrentPageConfig(pageConfig);
    }
  };

  const isViewOnStoreApp = () => {
    let isViewOnStoreApp = window.isStoreAppWebView ?? false;
    return isViewOnStoreApp;
  };

  if (!currentPageConfig) return <></>;

  const seoSettings = getRouteMetaInfo(currentPageConfig.id);

  return (
    <div style={{ fontFamily: _fontFamily }}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: _fontFamily,
          },
        }}
      >
        <MetaInfo {...seoSettings} />
        <AddToCartToastMessage />
        <UpdateToCartToastMessage />
        <NotificationContainer />
        <ToastMessageContainer />
        {isViewOnStoreApp() === false && <PackageExpiredDialog />}
        {currentPageConfig && (
          <ThemeProvider theme={currentPageConfig}>
            <div id="main" className="main-session">
              {isViewOnStoreApp() === false ? (
                <div
                  id="header"
                  className="theme-2-header"
                  onClick={() => {
                    if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.Header);
                  }}
                >
                  <div id="themeHeader">
                    <Theme2OriginalHeader
                      logo={logoDefault}
                      menuItem={
                        isCustomize
                          ? themeConfigMenu?.find((x) => x?.id === themeConfigReduxState?.general?.header?.menuId)
                              ?.onlineStoreMenuItems
                          : themeConfigReduxState?.general?.header?.menuItems
                      }
                      colorGroups={themeConfigReduxState?.general?.color?.colorGroups}
                      config={themeConfigReduxState?.general?.header}
                      isCustomize={isCustomize}
                      isDefault={isDefault}
                      stateConfig={themeConfigReduxState}
                      fontFamily={fontFamily}
                    />
                  </div>
                </div>
              ) : null}

              <ContentComponent
                {...currentPageConfig}
                {...props}
                clickToFocusCustomize={clickToFocusCustomize}
                isDefault={isDefault}
              />
            </div>
            {isViewOnStoreApp() === false ? (
              <div
                id="themeFooter"
                onClick={() => {
                  if (clickToFocusCustomize) clickToFocusCustomize(theme2ElementCustomize.Footer);
                }}
              >
                <ThemeOriginalFooter
                  menuItem={
                    themeConfigReduxState?.general?.footer?.menu?.menuItems ??
                    defaultThemePageConfig?.general?.footer?.menu?.menuItems
                  }
                  menuItemPolicy={
                    isCustomize
                      ? themeConfigMenu?.find((x) => x.id === themeConfigReduxState?.general?.footer?.policy?.menuId)
                          ?.onlineStoreMultiLevelMenus
                      : themeConfigReduxState?.general?.footer?.policy?.menuItems
                  }
                  config={themeConfigReduxState?.general}
                  colorGeneral={colorFooterGeneral}
                />
              </div>
            ) : null}
          </ThemeProvider>
        )}
      </ConfigProvider>
    </div>
  );
}
