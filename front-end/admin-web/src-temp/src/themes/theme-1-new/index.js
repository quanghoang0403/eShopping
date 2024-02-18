import { ConfigProvider } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled, { ThemeProvider } from "styled-components";
import { store } from "../modules";
import { setPackageExpiredInfo } from "../modules/session/session.actions";
import PackageExpiredDialog from "../shared/components/package-expired-dialog/package-expired-dialog.component";
import { getPathByCurrentURL } from "../utils/helpers";
import { getStorage } from "../utils/localStorage.helpers";
import DefaultLogo from "./assets/images/coffee-mug-logo.png";
import MetaInfo from "./components/MetaInfo";
import { DeliveryAddressSelectorComponent } from "./components/delivery-address-selector/delivery-address-selector.component";
import { DiscountCodeCheckoutToastMessageComponent } from "./components/discount-code-checkout-toast-message/discount-code-checkout-toast-message.component";
import { ThemeOriginalFooter } from "./components/footer.component";
import { ThemeOriginalHeader } from "./components/header.component";
import MasterToastMessage from "./components/master-toast-message/master-toast-message.component";
import { MaxDiscountToastMessageComponent } from "./components/max-discount-toast-message/max-discount-toast-message.component";
import NotificationContainer from "./components/notification-container/notification-container.component";
import { backgroundTypeEnum, theme1ElementCustomize } from "./constants/store-web-page.constants";
import "./index.scss";
import { getRouteMetaInfo, themeToken } from "./theme.data";
import defaultConfig from "./default-store.config";

// Layout
function Index(props) {
  const {
    contentPage: ContentComponent,
    clickToFocusCustomize,
    pageDefaultData,
    isDefault,
    isCustomize,
    fontFamily = themeToken.fontFamily,
    pageId,
  } = props;

  const [_fontFamily, setFontFamily] = useState(fontFamily);
  const [configFooter, setConfigFooter] = useState({});
  const [themeConfigMenu, setThemeConfigMenu] = useState({});

  const [currentPageConfig, setCurrentPageConfig] = useState(null);
  const [colorFooterGeneral, setColorFooterGeneral] = useState();
  const configCustomize = JSON.parse(getStorage("config"));
  const path = getPathByCurrentURL();
  const logoDefault = {
    url: DefaultLogo,
    alt: "Logo",
  };

  // listen general config change
  const generalConfig = useSelector((state) => state?.session?.themeConfig?.general);
  const config = useSelector((state) => state?.session?.themeConfig);
  const themeConfigMenuState = useSelector((state) => state.session?.themeConfigMenu);
  const defaultThemePageConfig = defaultConfig;

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
  }, []);

  useEffect(() => {
    initials(config);
  }, [config]);

  const initials = useCallback(
    (config) => {
      let _themePageConfig = config.pages?.find((p) => p.id === pageId);
      if (Boolean(_themePageConfig)) {
        if (
          generalConfig &&
          generalConfig.color &&
          generalConfig.color.colorGroups &&
          generalConfig.color.colorGroups.length > 0 &&
          _themePageConfig.config.colorGroupId
        ) {
          const pageColorGroup = generalConfig.color.colorGroups.find(
            (g) => g.id === _themePageConfig.config.colorGroupId,
          );
          if (pageColorGroup) {
            _themePageConfig = {
              ..._themePageConfig,
              config: {
                ..._themePageConfig.config,
                colorGroup: pageColorGroup,
              },
            };
          }
        }

        _themePageConfig = {
          ..._themePageConfig,
          general: generalConfig,
        };

        setCurrentPageConfig(_themePageConfig);
      }

      // set footer config
      const _configFooter = generalConfig?.footer;
      if (Boolean(_configFooter)) {
        setConfigFooter(_configFooter);
      }

      // // set theme menu config
      const reduxState = store.getState();
      const _themeConfigMenu = reduxState?.session?.themeConfigMenu ?? themeConfigMenuState;
      setThemeConfigMenu(_themeConfigMenu);

      // set general config
      if (Boolean(generalConfig)) {
        const colorGroup = generalConfig.color?.colorGroups?.find(
          (x) => x.id === generalConfig.footer?.generalCustomization?.colorGroupId,
        );
        setColorFooterGeneral(colorGroup);

        // set custom font
        if (!Boolean(window.isStoreAppWebView)) {
          const fontCustomized = generalConfig?.font?.name;
          if (Boolean(fontCustomized)) setFontFamily(fontCustomized);
        }
      }
    },
    [config],
  );

  const StyledMain = styled.div`
    background: ${(props) =>
      props?.theme?.general?.generalBackground?.backgroundType == backgroundTypeEnum.Color &&
      props?.theme?.general?.generalBackground?.backgroundColor};
    background-image: url(${(props) =>
      props?.theme?.general?.generalBackground?.backgroundType == backgroundTypeEnum.Image &&
      props?.theme?.general?.generalBackground?.backgroundImage});
  `;

  const isViewOnStoreApp = () => {
    let isViewOnStoreApp = window.isStoreAppWebView ?? false;
    return isViewOnStoreApp;
  };

  if (!currentPageConfig) return <MaxDiscountToastMessageComponent />;

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
        <MasterToastMessage />
        <NotificationContainer />
        <DiscountCodeCheckoutToastMessageComponent />
        {isViewOnStoreApp() === false && <PackageExpiredDialog />}
        <ThemeProvider theme={currentPageConfig}>
          <div id="original-theme" className="theme-1">
            <div id="main">
              {isViewOnStoreApp() === false ? (
                <div
                  className="theme1-original-header"
                  onClick={() => isCustomize && clickToFocusCustomize(theme1ElementCustomize.Header)}
                >
                  <ThemeOriginalHeader
                    logo={logoDefault}
                    menuItem={
                      configCustomize?.customizeTheme
                        ? themeConfigMenu?.find((x) => x.id === generalConfig?.header?.menuId)?.onlineStoreMenuItems
                        : generalConfig?.header?.menuItems
                    }
                    path={path}
                    isDefault={isDefault}
                    isCustomize={isCustomize}
                    colorConfig={generalConfig?.color}
                    headerConfig={generalConfig?.header}
                  />
                </div>
              ) : null}

              {isViewOnStoreApp() === false && !configCustomize?.customizeTheme && (
                <DeliveryAddressSelectorComponent
                  config={generalConfig?.header}
                  colorGroup={generalConfig?.color?.colorGroups}
                />
              )}

              <StyledMain className={isViewOnStoreApp() === false && "content-component-wrapper"}>
                <ContentComponent
                  {...currentPageConfig}
                  {...props}
                  clickToFocusCustomize={isCustomize && clickToFocusCustomize}
                  pageDefaultData={pageDefaultData}
                  path={path}
                  isDefault={isDefault}
                  isCustomize={isCustomize}
                />
              </StyledMain>
            </div>
            <div id="themeFooter" onClick={() => isCustomize && clickToFocusCustomize(theme1ElementCustomize.Footer)}>
              {isViewOnStoreApp() === false ? (
                <ThemeOriginalFooter
                menuItem={
                  generalConfig?.footer?.menu?.menuItems ?? defaultThemePageConfig?.general?.footer?.menuItems
                }
                  configFooter={configFooter}
                  colorGeneral={colorFooterGeneral}
                  path={path}
                />
              ) : null}
            </div>
          </div>
        </ThemeProvider>
      </ConfigProvider>
    </div>
  );
}
export default Index;
