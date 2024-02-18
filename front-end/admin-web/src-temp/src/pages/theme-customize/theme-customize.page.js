import { Button, Form, Input, message, Select, Tabs } from "antd";
import { hyperlinkModel } from "constants/hyperlink.constants";
import {
  AppLogoStoreWebIcon,
  ArrowDown,
  ArrowMenuCustomizeIcon,
  CheckedIcon,
  CustomizeStoreWebIcon,
  DesktopStoreWebIcon,
  EyeFilledIcon,
  FaviconStoreWebIcon,
  FooterIcon,
  GeneralBackgroundStoreWebIcon,
  GeneralStoreWebIcon,
  LeaveStoreWebIcon,
  MobileStoreWebIcon,
  OnlineStoreHeaderTitleIcon,
  PaintPalette,
} from "constants/icons.constants";
import { DefaultActiveKeyBlockCollapse } from "constants/store-web-key-collapse.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import onlineStoreDataService from "data-services/online-store/online-store-data.service";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomizationCollapseBlock from "./components/customization-block-component/customization-block.page";
import GeneralColor from "./components/general-color.component";
import themes from "./themes";

import DeleteConfirmComponent from "components/delete-confirm/delete-confirm.component";
import LoadingBg from "components/LoadingBg";
import { StoreWebPageId } from "constants/store-web-page-id.constants";
import { backgroundTypeEnum } from "constants/store-web-page.constants";
import { ThemeKeys } from "constants/theme.constants";
import { env } from "env";
import { useHistory } from "react-router";
import { getUserInfo } from "services/auth.service";
import {
  dispatchThemeConfig2Redux,
  dispatchThemeHeaderMenuOptions2Redux,
  mergeThemeConfig,
} from "services/theme.service";
import { store } from "store";
import {
  setPrepareDataForBanner,
  setThemeCustomizeConfig,
  setThemeCustomizeConfigDefault,
  setThemeCustomizeMenu,
  setThemeFont,
} from "store/modules/session/session.actions";
import productDataService from "themes/data-services/product-data.service";
import { LockMultipleCalls } from "themes/services/promotion.services";
import { theme1ElementCustomize } from "themes/theme-1-new/constants/store-web-page.constants";
import { theme2ElementCustomize, theme2ElementRightId } from "themes/theme-2-new/constants/store-web-page.constants";
import { validateThemePage } from "themes/utils/helpers";
import { CompareTwoObjs } from "utils/helpers";
import { getStorage, localStorageKeys, setStorage } from "utils/localStorage.helpers";
import PageType from "../../../src/pages/theme-customize/page-type.constants";
import AppLogoCustomization from "./components/app-logo-customization/app-logo-customization.page";
import ElementCustomizationCollapseBlock from "./components/customization-block-component/element-customization-block.component";
import FaviconCustomization from "./components/favicon-customization/favicon-customization.page";
import FooterTheme1Customization from "./components/footer-customization/footer-customization-theme-1";
import FooterTheme2Customization from "./components/footer-customization/footer-customization.page";
import HeaderTheme1Customization from "./components/header-customization/header-customization-theme-1";
import HeaderTheme2Customization from "./components/header-customization/header-customization-theme-2";
import SelectBackgroundComponent from "./components/select-background-component/select-background.component";
import { fonts } from "./components/SelectFontFamily/fontConfig";
import ThemeCustomizeWrapper from "./components/ThemeCustomizeWrapper";
import "./theme-customize.page.scss";

const { TabPane } = Tabs;
const { Option } = Select;

const tab = {
  GENERAL: "GENERAL",
  CUSTOMIZE: "CUSTOMIZE",
};

const responsiveOption = {
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
};

const dimensions = [
  {
    key: responsiveOption.DESKTOP,
    icon: <DesktopStoreWebIcon />,
  },
  {
    key: responsiveOption.MOBILE,
    icon: <MobileStoreWebIcon />,
  },
];

export function ThemeCustomizePage(props) {
  const dispatch = useDispatch();
  // DO NOT DELETE: listen re-render this page after add more color group
  const reduxThemeConfig = useSelector((state) => state.session.requestRenderThemeCustomize);
  const history = useHistory();
  const [t] = useTranslation();
  const param = useParams();
  const allThemes = themes;
  const [form] = Form.useForm();
  const DELAYED_TIME = 500;
  const DELAYED_TIME_FOCUS = 800;

  //new
  const [isReadyCustomize, setIsReadyCustomize] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [currentTab, setCurrentTab] = useState(tab.GENERAL); // tab customize
  const [currentPage, setCurrentPage] = useState(null);
  const [__themeConfig, setThemeConfig] = useState(null);
  const [isVisibleBlockContent, setIsVisibleBlockContent] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [themeId, setThemeId] = useState("");
  const [prepareDataForHyperlink, setPrepareDataForHyperlink] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [colorGroups, setColorGroups] = useState([]);
  const [colorGroupDefault, setColorGroupDefault] = useState(null);
  const [defaultConfigTheme, setDefaultConfigTheme] = useState(null);
  const [pageDefaultData, setPageDefaultData] = useState(null);
  const [productDefaultData, setProductDefaultData] = useState(null);
  const [isActiveTheme, setIsActiveTheme] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [selectPageId, setSelectPageId] = useState(null);
  const [isActionBack, setIsActionBack] = useState(false);
  const onlineStoreUrl = "/online-store/management";

  const [appStoreLink, setAppStoreLink] = useState("");
  const [googlePlayLink, setGooglePlayLink] = useState("");
  const [isCheckProductSell, setIsCheckProductSell] = useState("");
  // end new

  const translateData = {
    preview: t("onlineStore.preview", "Preview"),
    save: t("button.save", "Save"),
    publish: t("button.publish", "Publish"),
    footer: {
      title: t("storeWebPage.footerThemeConfiguration.footer"),
    },
    header: {
      title: t("storeWebPage.header.title"),
    },
    color: {
      title: t("storeWebPage.color.title"),
    },
    banner: {
      title: t("storeWebPage.banner.title"),
    },
    productListPage: {
      title: t("storeWebPage.productList"),
    },
    updateSuccess: t("messages.updateSuccess"),
    updateFail: t("messages.updateFailed"),
    todayMenu: t("storeWebPage.todayMenu"),
    general: t("", "General"),
    favicon: t("", "Favicon"),
    appLogo: t("", "App logo"),
    discardBtn: t("leaveDialog.ignore"),
    confirmLeaveBtn: t("leaveDialog.confirmLeave"),
    leaveDialog: {
      confirmation: t("leaveDialog.confirmation"),
      content: t("messages.leaveForm"),
    },
  };

  useEffect(() => {
    setIsPageLoading(true);
    createStoreWebApi();
    fetchData();
  }, []);

  useEffect(() => {
    window.onbeforeunload = (event) => {
      ReloadChangedValue(event);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      ReloadChangedValue(event);
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, [currentPage]);

  const createStoreWebApi = () => {
    const userInfo = getUserInfo();
    const storeId = userInfo?.storeId;
    let token = getStorage(localStorageKeys.TOKEN);
    const mockupConfig = {
      apiUrl: env.REACT_APP_POS_API,
      token: token,
      storeId: storeId,
      customizeTheme: true,
    };
    const jsonConfig = JSON.stringify(mockupConfig);
    setStorage("config", jsonConfig);
    setIsPageLoading(false);
  };

  const fetchData = async () => {
    const pThemeConfig = onlineStoreDataService.getThemeIdByStoreThemeId(param?.storeThemeId);
    const pStoreThemeConfiguration = onlineStoreDataService.getStoreThemeConfiguration(param?.storeThemeId);
    const pPrepareData = menuManagementDataService.getCreateMenuPrepareDataAsync();
    const pFirstProductResponse = productDataService.getTheFirstProductAsync();
    const pStoreThemes = onlineStoreDataService.getStoreThemesAsync();
    const [themeConfig, storeThemeConfiguration, prepareData, firstProductResponse, storeThemes] = await Promise.all([
      pThemeConfig,
      pStoreThemeConfiguration,
      pPrepareData,
      pFirstProductResponse,
      pStoreThemes,
    ]);
    const defaultPage = loadThemeAndConfig(themeConfig, storeThemeConfiguration);

    if (storeThemes) {
      setAppStoreLink(storeThemes?.appStoreLink);
      setGooglePlayLink(storeThemes?.googlePlayLink);
      setIsCheckProductSell(storeThemes?.isCheckProductSell);
    }

    fillPageConfigToForm(defaultPage);
    setCurrentPage(defaultPage);
    getThemeInfo(storeThemes);
    getPrepareDataForBanner(prepareData);
    getTheFirstProduct(firstProductResponse);

    setIsReadyCustomize(true);
  };

  const loadThemeAndConfig = (loadThemeAndConfig, config) => {
    const { themeId, menuManagements, numberOfBranches } = loadThemeAndConfig;
    let configObj = JSON.parse(config);
    const themeInfo = allThemes.find((theme) => theme.themeData.id.toLowerCase() === themeId.toLowerCase());

    const { themeData, defaultConfig } = themeInfo;
    if (configObj?.general?.footer?.storeInformation?.numberOfBranches >= 0) {
      configObj.general.footer.storeInformation.numberOfBranches = numberOfBranches;
    }
    const defaultMenu = menuManagements.find((menu) => menu.isDefault) || {};
    // show default menu name for footer
    if (configObj?.general?.footer?.menu?.menuId === null) {
      configObj.general.footer.menu.menuId = defaultMenu?.id;
    }
    // show default menu name for header
    if (configObj?.general?.header?.menuId === null) {
      configObj.general.header.menuId = defaultMenu?.id;
    }

    setThemeId(themeId);
    setCurrentTheme(themeData);

    // update new node into object
    configObj = putNewNode(configObj, defaultConfig);
    setThemeConfig(configObj);
    setColorGroups(configObj?.general?.color?.colorGroups);
    setColorGroupDefault(defaultConfig?.general?.color?.colorGroups[0]);
    setDefaultConfigTheme(defaultConfig);

    const fontName = configObj["general"]["font"]["name"];
    dispatch(setThemeFont(fontName));

    // save to redux
    dispatch(setThemeCustomizeConfig(configObj));
    dispatch(setThemeCustomizeConfigDefault(configObj));

    // save to redux List Menu Management
    dispatch(setThemeCustomizeMenu(menuManagements));

    ///#region  REFACTOR PROCESS
    dispatchThemeConfig2Redux(configObj); // storage theme json config on initial state
    dispatchThemeHeaderMenuOptions2Redux(menuManagements); // storage theme header menu option to redux => header menu customize selector component will listen and render
    //#endregion

    return themeData?.pages[0];
  };

  const putNewNode = (oldObj, defaultData) => {
    if (!Boolean(oldObj?.general?.font?.path)) {
      Object.assign(oldObj.general, {
        font: {
          name: defaultData?.general?.font?.name,
          path: defaultData?.general?.font?.path,
        },
      });
    }

    return oldObj;
  };

  const getThemeInfo = (res) => {
    if (res) {
      const { storeThemes } = res;
      var result = storeThemes?.find((item) => {
        return item.id === param?.storeThemeId;
      });
      if (result?.isPublished) {
        setIsActiveTheme(true);
      }
    }
  };

  const fillPageConfigToForm = (currentPage) => {
    const pageConfig = getPageConfig(currentPage);

    if (StoreWebPageId.HOME_PAGE === pageConfig?.pageId) {
      let bestSellingProductIdsNew = [];
      pageConfig?.config?.bestSellingProduct?.bestSellingProductIds?.map((id) => {
        let checkProductIdExist = store.getState()?.session?.prepareDataBanner?.products.find((o) => o.id === id);
        if (checkProductIdExist) {
          bestSellingProductIdsNew.push(checkProductIdExist.id);
        }
      });
      const newPageConfig = {
        ...pageConfig,
        config: {
          ...pageConfig?.config,
          bestSellingProduct: {
            ...pageConfig?.config?.bestSellingProduct,
            bestSellingProductIds: bestSellingProductIdsNew,
          },
        },
      };
      LockMultipleCalls(
        () => {
          const fontName = newPageConfig["general"]["font"]["name"];
          dispatch(setThemeFont(fontName));
          form.setFieldsValue(newPageConfig);
        },
        "SET_FROM_THEME_CONFIG",
        200,
      );
    } else {
      LockMultipleCalls(
        () => {
          const fontName = pageConfig["general"]["font"]["name"];
          dispatch(setThemeFont(fontName));
          form.setFieldsValue(pageConfig);
        },
        "SET_FROM_THEME_CONFIG",
        200,
      );
    }
  };

  const onClickPreviewTheme = () => {
    //GOTO:
  };

  const onClickSaveTheme = () => {
    updateStoreThemeConfiguration();
  };

  const onClickPublishTheme = async () => {
    updateStoreThemeConfiguration();
    localStorage.setItem(localStorageKeys.PUBLISH_CURRENT_THEME_ID, param?.storeThemeId);
    history.push("/online-store/management");
  };

  const updateStoreThemeConfiguration = async () => {
    const state = store.getState();
    const configs = state?.session?.themeConfig;

    const menuList = state?.session?.themeConfigMenu;
    let menuFooterItems = menuList?.find((x) => x?.id === configs?.general?.footer?.menu?.menuId);
    const reserveTable = configs?.pages?.find((x) => x?.id === PageType.RESERVE_TABLE_PAGE);
    if (reserveTable) {
      if (reserveTable?.config?.header?.title === "") {
        message.error(translateData.updateFail);
        return;
      }
    }

    if (currentTab === tab.GENERAL) {
      const generalBackground = configs?.general?.generalBackground;
      if (
        generalBackground?.backgroundType === backgroundTypeEnum.Image &&
        !Boolean(generalBackground?.backgroundImage)
      ) {
        message.error(translateData.updateFail);
        return;
      }
    }

    const emptyName = (element) => element.name === null || element.name === "";
    if (configs?.general?.color?.colorGroups?.some(emptyName)) {
      message.error(translateData.updateFail);
      return;
    }

    const appStoreLink = configs?.general?.footer?.downloadApp?.appStoreLink;
    const googlePlayLink = configs?.general?.footer?.downloadApp?.googlePlayLink;

    let newConfigs = { ...configs };
    configs["general"]["footer"]["menu"]["menuItems"] = menuFooterItems?.onlineStoreMultiLevelMenus;
    configs["isCheckProductSell"] = isCheckProductSell;

    //<REFACTOR>
    const _themeConfig = store.getState()?.themeConfig?.data;
    const menuId = _themeConfig["general"]["header"]["menuId"];
    configs["general"]["header"]["menuId"] = menuId;

    const _menuItems = _themeConfig["general"]["header"]["menuItems"];
    const _menuItemsDefault = menuList?.find((x) => x?.id === menuId);
    configs["general"]["header"]["menuItems"] = _menuItemsDefault?.onlineStoreMultiLevelMenus ?? _menuItems;
    //</REFACTOR>

    //Check validate data
    if (!validateThemePage(newConfigs, currentPage.id)) {
      form.validateFields();
      message.error(translateData.updateFail);
      if (
        newConfigs?.general?.footer?.downloadApp?.qrCode &&
        newConfigs?.general?.footer?.downloadApp?.qrCodeImage == null
      ) {
        let element = document.getElementsByClassName("#sDownloadApp");
        setTimeout(() => {
          element[0].scrollIntoView({ behavior: "smooth" });
        }, DELAYED_TIME);
      }
      return;
    }

    const newThemeConfig = {
      ...newConfigs,
      storeThemeId: param?.storeThemeId,
    };
    const merged = mergeThemeConfig(defaultConfigTheme, newThemeConfig);
    setThemeConfig(merged);
    setColorGroups(newThemeConfig?.general?.color?.colorGroups);
    const data = {
      storeThemeConfiguration: JSON.stringify(merged),
      storeThemeId: param?.storeThemeId,
      appStoreLink: appStoreLink,
      googlePlayLink: googlePlayLink,
    };
    const response = await onlineStoreDataService.updateStoreThemeConfiguration(data);
    if (response) {
      message.success(translateData.updateSuccess);
      dispatch(setThemeCustomizeConfigDefault(configs));
    } else {
      message.error(translateData.updateFail);
    }
  };

  const onChangeThemePageCustomize = async (pageId) => {
    const invalidValue = await ReloadChangedValue();
    if (!invalidValue) {
      setSelectPageId(pageId);
      setShowConfirm(true);
    } else {
      changePageConfig(pageId);
    }
  };

  const changePageConfig = (pageId) => {
    setIsPageLoading(true);
    const pageInfo = currentTheme?.pages?.find((page) => page?.id?.toLowerCase() === pageId?.toLowerCase());
    setCurrentPage(pageInfo);
    changePageDefaultData(pageId);
    setIsVisibleBlockContent(false);

    fillPageConfigToForm(pageInfo);

    setIsPageLoading(false);
  };

  const changePageDefaultData = async (pageId) => {
    setPageDefaultData("");
    switch (pageId) {
      case StoreWebPageId.PRODUCT_DETAIL:
        setPageDefaultData(productDefaultData);
        break;
      default:
        break;
    }
  };

  const getPageConfig = (currentPage) => {
    const state = store.getState();
    const configs = state?.session?.themeConfig;
    const configPages = state?.session?.themeConfig?.pages;
    if (!configs || !configs?.pages || !currentPage) {
      return {};
    }
    const { id } = currentPage;
    const pageConfig = configPages?.find((c) => c?.id === id);
    const config = {
      general: configs?.general, // general config
      config: pageConfig?.config, // config for only page
      pageId: id,
    };
    return config;
  };

  const onChangeThemeConfigForm = (allValues) => {
    const formFields = form.getFieldsValue()?.general;
    const formFieldsConfig = form.getFieldsValue()?.config;
    const { general, config } = allValues;

    // merge page configs
    const pageConfig = {
      ...config,
      ...formFieldsConfig,
    };

    let pages = [];
    if (config) {
      const { id } = currentPage;
      pages = __themeConfig?.pages?.filter((c) => c.id !== id);
      pages.push({
        id: currentPage?.id,
        config: {
          ...pageConfig,
          banner: formFieldsConfig?.banner,
        },
      });
    }
    let fontName = "";
    const fontPath = form.getFieldsValue()?.general?.font?.path;
    if (Boolean(fontPath)) {
      const font = fonts.find((f) => f.path === fontPath);
      if (font) {
        fontName = font.name;

        // dispatch font selected to redux
        dispatch(setThemeFont(fontName));
      }
    }

    const updatedGeneral = {
      ...general,
      font: {
        name: fontName,
        path: fontPath,
      },
      header: {
        ...general.header,
        menuItems: formFields?.header?.menuItems,
      },
      footer: {
        ...general.footer,
        menu: {
          ...general.footer.menu,
          menuItems: formFields?.footer?.menu?.menuItems,
        },
        policy: {
          ...general.footer.policy,
          menuItems: formFields?.footer?.policy?.menuItems,
        },
      },
    };

    const updatedThemeConfig = {
      ...__themeConfig,
      general: {
        ...__themeConfig.general,
        ...updatedGeneral,
      },
      pages: pages,
    };

    dispatch(setThemeCustomizeConfig(updatedThemeConfig));
  };

  const onChangeChildComponent = (changedValue) => {
    if (changedValue.value !== undefined) form.setFieldValue(changedValue.key, changedValue.value);
  };

  const updateReduxStorage = (newThemeConfig) => {
    dispatch(setThemeCustomizeConfig(newThemeConfig));
    setThemeConfig(newThemeConfig);
  };

  const clickToFocusCustomize = (customizeKey, indexItemFocus, themeKey) => {
    let element = document.getElementsByClassName(customizeKey);
    let checkElementActive = element[0]
      .closest(".fnb-collapse.collapse-sub")
      .classList.contains("ant-collapse-item-active");
    if (themeKey) {
      if (themeKey === ThemeKeys.PhoViet) {
        switch (customizeKey) {
          case theme2ElementCustomize.FlashSale:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.flashSale.title")) {
              onBackMenuCustomizeHomePage();
              element[0].click();
            }
            break;
          case theme2ElementCustomize.Banner:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (element?.length > 0) {
              onBackMenuCustomizeHomePage();
              element[0].click();
              element[0].scrollIntoView({ behavior: "smooth" });
            }
            break;
          case theme2ElementCustomize.PromotionSection:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.promotionSection.title")) {
              onBackMenuCustomizeHomePage();
              if (element?.length > 0) {
                element[0].click();
                element[0].scrollIntoView({ behavior: "smooth" });
              }
            }
            break;
          case theme2ElementCustomize.Blogs:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.blogs.title")) {
              onBackMenuCustomizeHomePage();
              if (element?.length > 0) {
                element[0].click();
                element[0].scrollIntoView({ behavior: "smooth" });
              }
            }
            break;
          default:
            break;
        }
      } else if (themeKey === ThemeKeys.TropicalFruit) {
        switch (customizeKey) {
          case theme1ElementCustomize.FlashSale:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.flashSale.title")) {
              onBackMenuCustomizeHomePage();
              element[0].click();
            }
            break;
          case theme1ElementCustomize.PromotionSection:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.promotionSection.title")) {
              onBackMenuCustomizeHomePage();
              element[0].click();
            }
            break;
          case theme1ElementCustomize.Blogs:
            if (currentTab !== tab.CUSTOMIZE) {
              setCurrentTab(tab.CUSTOMIZE);
            }
            if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.blogs.title")) {
              onBackMenuCustomizeHomePage();
              element[0].click();
            }
            break;
          default:
            break;
        }
      } else {
        console.log(themeKey + ": themeKey does not exist.");
      }
    } else {
      switch (customizeKey) {
        case theme1ElementCustomize.Categories:
          setCurrentTab(tab.CUSTOMIZE);
          onBackMenuCustomizeHomePage();
          element[0].click();
          break;
        case theme1ElementCustomize.BestSellingProduct:
          setCurrentTab(tab.CUSTOMIZE);
          onBackMenuCustomizeHomePage();
          element[0].click();
          setTimeout(() => {
            const elementRightSide = document.getElementById("themeBestSellingProduct");
            if (elementRightSide) {
              // set border element on focused
              elementRightSide.className = "tc-on-focus";
              elementRightSide.scrollIntoView({ block: "start" });
            }
          }, 100);

          break;
        case theme1ElementCustomize.PromotionSection:
          setCurrentTab(tab.CUSTOMIZE);
          onBackMenuCustomizeHomePage();
          element[0].click();
          setTimeout(() => {
            const elementRightSide = document.getElementById("themePromotionSection");
            if (elementRightSide) {
              // set border element on focused
              elementRightSide.className = "tc-on-focus";
              elementRightSide.scrollIntoView({ block: "start" });
            }
          }, 100);

          break;
        case theme1ElementCustomize.Blogs:
          setCurrentTab(tab.CUSTOMIZE);
          onBackMenuCustomizeHomePage();
          element[0].click();
          setTimeout(() => {
            const elementRightSide = document.getElementById("themeBlog");
            if (elementRightSide) {
              // set border element on focused
              elementRightSide.className = "tc-on-focus";
              elementRightSide.scrollIntoView({ block: "start" });
            }
          }, 100);

        case theme1ElementCustomize.Banner:
          setCurrentTab(tab.CUSTOMIZE);
          if (!isVisibleBlockContent || currentTitle !== t("onlineStore.tags.theme1.slideBanner")) {
            onBackMenuCustomizeHomePage();
            element[0].click();
          }

          if (indexItemFocus !== undefined && indexItemFocus !== "") {
            setTimeout(() => {
              let elementFocus = document.getElementsByClassName(
                theme1ElementCustomize.Banner + "-item-" + indexItemFocus,
              );
              let checkElementFocusActive = elementFocus[1]
                .closest(".fnb-collapse.collapse-sub")
                .classList.contains("ant-collapse-item-active");
              if (!checkElementFocusActive) {
                setTimeout(() => {
                  elementFocus[1].click();
                }, DELAYED_TIME);
              }
              setTimeout(() => {
                elementFocus[1].scrollIntoView({ behavior: "smooth" });
              }, DELAYED_TIME_FOCUS);
            }, DELAYED_TIME);
          }
          break;
        case theme1ElementCustomize.HeaderProductList:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.ProductProductList:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.HeaderCheckout:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.CheckoutCheckout:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.HeaderBlogList:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0]?.scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.BlogListBlog:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.HeaderBlogDetail:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0]?.scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.ArticleBlogDetail:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.RelatedProductsCheckout:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.Header:
          setCurrentTab(tab.GENERAL);
          if (!checkElementActive) {
            element[0].click();
          }
          setTimeout(() => {
            element[0].closest(".fnb-collapse.collapse-sub").scrollIntoView({ behavior: "smooth" });
          }, DELAYED_TIME);
          break;
        case theme1ElementCustomize.Footer:
          setCurrentTab(tab.GENERAL);
          if (!checkElementActive) {
            element[0].click();
          }
          setTimeout(() => {
            element[0].closest(".fnb-collapse.collapse-sub").scrollIntoView({ behavior: "smooth" });
          }, DELAYED_TIME);
          break;
        case theme1ElementCustomize.ProductDetail:
          if (currentTab != tab.CUSTOMIZE) {
            setCurrentTab(tab.CUSTOMIZE);
          }
          break;
        case theme1ElementCustomize.HeaderReservation:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0]?.scrollIntoView({ behavior: "smooth" });
          break;
        case theme1ElementCustomize.ReservationReservation:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0]?.scrollIntoView({ behavior: "smooth" });
          break;
        case theme2ElementCustomize.LoginPage:
          setCurrentTab(tab.CUSTOMIZE);
          onBackMenuCustomizeHomePage();
          element[0].click();
          break;
        case theme2ElementCustomize.Advertisement:
          if (currentTab !== tab.CUSTOMIZE) {
            setCurrentTab(tab.CUSTOMIZE);
          }
          if (!isVisibleBlockContent || currentTitle !== t("storeWebPage.advertisement.title")) {
            onBackMenuCustomizeHomePage();
            element[0].click();
          }
          break;
        case theme2ElementCustomize.TodayMenu:
          setCurrentTab(tab.CUSTOMIZE);
          onBackMenuCustomizeHomePage();
          element[0].click();

          setTimeout(() => {
            const elementRightSide = document.getElementById(theme2ElementRightId.TodayMenu);
            if (elementRightSide) {
              // set border element on focused
              elementRightSide.className = "tc-on-focus";
              elementRightSide.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);

          break;
        case theme2ElementCustomize.HeaderProductDetail:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme2ElementCustomize.MainProductDetail:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;
        case theme2ElementCustomize.RelatedProductDetail:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;

        case theme2ElementCustomize.Blogs:
          setCurrentTab(tab.CUSTOMIZE);
          if (!checkElementActive) {
            element[0].click();
          }
          element[0].scrollIntoView({ behavior: "smooth" });
          break;

        case theme2ElementCustomize.HeaderReservation:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0]?.scrollIntoView({ behavior: "smooth" });
          break;
        case theme2ElementCustomize.ReservationReservation:
          setCurrentTab(tab.CUSTOMIZE);
          element[0].click();
          element[0]?.scrollIntoView({ behavior: "smooth" });
          break;

        default:
          break;
      }
    }
  };

  const onBackMenuCustomizeHomePage = () => {
    setIsVisibleBlockContent(false);
    setCurrentContent(null);
    setCurrentTitle("");
  };

  const onChangeTab = async (e) => {
    setIsActionBack(false);
    const invalidValue = await ReloadChangedValue();
    if (!invalidValue) {
      setSelectedTab(e);
    } else {
      setCurrentTab(e);
    }
  };

  const Header = () => {
    const ResponsiveOptions = () => {
      return (
        <Tabs defaultActiveKey="1" className="tc-responsive-mode-selector">
          {dimensions.map((i) => (
            <TabPane tab={i.icon} key={i.key} />
          ))}
        </Tabs>
      );
    };

    const handleBack = async () => {
      setIsActionBack(true);
      const invalidValue = await ReloadChangedValue();
      if (!invalidValue) {
        setShowConfirm(true);
      } else {
        window.location.href = onlineStoreUrl;
      }
    };

    return (
      <div className="tc-header">
        <div className="tc-leave-page">
          <a onClick={handleBack}>
            <LeaveStoreWebIcon />
          </a>
        </div>

        <div className="tc-page-selector">
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            size="large"
            className="fnb-select-single"
            popupClassName="fnb-select-single-dropdown"
            suffixIcon={<ArrowDown />}
            menuItemSelectedIcon={<CheckedIcon />}
            onChange={onChangeThemePageCustomize}
            value={currentPage?.id}
          >
            {currentTheme?.pages
              ?.filter((obj, index, self) => self.findIndex((o) => o.id === obj.id) === index)
              .map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    <span className="option-icon">{item?.icon}</span>
                    {t(item.name)}
                  </Option>
                );
              })}
          </Select>
        </div>

        <div className="tc-page-action">
          <ResponsiveOptions />
          <div className="right-content-header">
            <Button
              className="store-web-btn preview-store-web-btn"
              icon={<EyeFilledIcon className="eye-icon" />}
              onClick={onClickPreviewTheme}
            >
              {translateData.preview}
            </Button>
            <Button className="store-web-btn save-store-web-btn ml-4" onClick={onClickSaveTheme}>
              {translateData.save}
            </Button>
            {isActiveTheme && (
              <Button className="store-web-btn publish-store-web-btn ml-4" onClick={onClickPublishTheme}>
                {translateData.publish}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Body = () => {
    return (
      <div className="tc-body">
        {/* <Customize section> */}
        <Tabs activeKey={currentTab} defaultActiveKey={currentTab} className="left-content" onChange={onChangeTab}>
          <TabPane tab={<CustomizeStoreWebIcon />} key={tab.GENERAL} />
          <TabPane tab={<GeneralStoreWebIcon />} key={tab.CUSTOMIZE} />
        </Tabs>

        <Form
          onClick={() => setIsPageLoading(false)}
          onValuesChange={(changedValues, allValues) => {
            if (window.onChangeThemeConfigForm) {
              clearTimeout(window.onChangeThemeConfigForm);
            }
            window.onChangeThemeConfigForm = setTimeout(() => {
              onChangeThemeConfigForm(allValues);
            }, 600);
          }}
          form={form}
          layout="vertical"
          autoComplete="off"
          className="background-white"
        >
          <GeneralCustomize
            visible={currentTab === tab.GENERAL}
            initialData={store.getState().session?.themeConfig?.general}
            form={form}
            updateFormValues={updateFormValues}
            setColorGroups={setColorGroups}
            themeId={themeId}
          />

          <ElementCustomize
            reduxStorage={store}
            updateReduxStorage={updateReduxStorage}
            updateFormValues={updateFormValues}
            onChange={onChangeChildComponent}
            visible={currentTab === tab.CUSTOMIZE}
            pageId={currentPage?.id}
            pageConfig={getPageConfig(currentPage)}
            form={form}
            prepareDataForHyperlink={prepareDataForHyperlink}
          />
        </Form>
        {/* </Customize section> */}

        {/* <Live preview section> */}
        <div id="right-content" className="right-content">
          {currentPage && (
            <ThemeCustomizeWrapper
              pageId={currentPage?.id}
              component={currentPage.component}
              pageDefaultData={pageDefaultData}
              clickToFocusCustomize={clickToFocusCustomize}
            />
          )}
        </div>
        {/* </Live preview section> */}
      </div>
    );
  };

  const GeneralCustomize = (props) => {
    const { visible } = props;
    let generalCustomizeBlocks = [];
    // Default general customize blocks should be get from theme
    if (themeId === ThemeKeys.PhoViet) {
      generalCustomizeBlocks = [
        {
          icon: <GeneralBackgroundStoreWebIcon />,
          title: translateData.general,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.GeneralBackground,
          clickToScroll: "",
          content: <SelectBackgroundComponent {...props} hasSelectFont />,
        },
        {
          icon: <PaintPalette />,
          title: translateData.color.title,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Color,
          clickToScroll: "",
          content: <GeneralColor {...props} colorGroupDefault={colorGroupDefault} />,
        },
        {
          icon: <OnlineStoreHeaderTitleIcon />,
          title: translateData.header.title,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Header,
          customizeKey: theme1ElementCustomize.Header,
          clickToScroll: "#themeHeader",
          content: <HeaderTheme2Customization {...props} onChangeMenu={onChangeMenuHeader} colorGroups={colorGroups} />,
        },
        {
          icon: <FooterIcon />,
          title: translateData.footer.title,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Footer,
          customizeKey: theme1ElementCustomize.Footer,
          clickToScroll: "#themeFooter",
          content: (
            <FooterTheme2Customization
              {...props}
              onChangeMenu={onChangeMenuFooter}
              colorGroups={colorGroups}
              setValueDefault={setValueDefault}
              defaultConfigTheme={defaultConfigTheme}
              appStoreLink={appStoreLink}
              googlePlayLink={googlePlayLink}
            />
          ),
        },
        {
          icon: <FaviconStoreWebIcon />,
          title: translateData.favicon,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Favicon,
          clickToScroll: "",
          content: <FaviconCustomization {...props} />,
        },
        {
          icon: <AppLogoStoreWebIcon />,
          title: translateData.appLogo,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.AppLogo,
          clickToScroll: "",
          content: <AppLogoCustomization {...props} />,
        },
      ];
    } else {
      generalCustomizeBlocks = [
        {
          icon: <GeneralBackgroundStoreWebIcon />,
          title: translateData.general,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.GeneralBackground,
          clickToScroll: "",
          content: <SelectBackgroundComponent {...props} hasSelectFont />,
        },
        {
          icon: <PaintPalette />,
          title: translateData.color.title,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Color,
          clickToScroll: "",
          content: <GeneralColor {...props} colorGroupDefault={colorGroupDefault} />,
        },
        {
          icon: <OnlineStoreHeaderTitleIcon />,
          title: translateData.header.title,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Header,
          customizeKey: theme1ElementCustomize.Header,
          clickToScroll: "#themeHeader",
          content: <HeaderTheme1Customization {...props} onChangeMenu={onChangeMenuHeader} colorGroups={colorGroups} />,
        },
        {
          icon: <FooterIcon />,
          title: translateData.footer.title,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Footer,
          customizeKey: theme1ElementCustomize.Footer,
          clickToScroll: "#themeFooter",
          content: (
            <FooterTheme1Customization
              {...props}
              onChangeMenu={onChangeMenuFooter}
              colorGroups={colorGroups}
              setValueDefault={setValueDefault}
              defaultConfigTheme={defaultConfigTheme}
              appStoreLink={appStoreLink}
              googlePlayLink={googlePlayLink}
            />
          ),
        },
        {
          icon: <FaviconStoreWebIcon />,
          title: translateData.favicon,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.Favicon,
          clickToScroll: "",
          content: <FaviconCustomization {...props} />,
        },
        {
          icon: <AppLogoStoreWebIcon />,
          title: translateData.appLogo,
          isNormal: true,
          defaultActiveKey: DefaultActiveKeyBlockCollapse.AppLogo,
          clickToScroll: "",
          content: <AppLogoCustomization {...props} />,
        },
      ];
    }

    return (
      <div className={`middle-content ${visible === true ? "" : "d-none"}`}>
        {generalCustomizeBlocks.map((block, key) => {
          return (
            <CustomizationCollapseBlock
              key={key}
              icon={block.icon}
              title={block.title}
              isNormal={block.isNormal}
              defaultActiveKey={block.defaultActiveKey}
              content={block.content}
              clickToScroll={block.clickToScroll}
              customizeKey={block.customizeKey}
            />
          );
        })}
      </div>
    );
  };

  const ElementCustomize = (props) => {
    const { visible, pageId, pageConfig } = props;
    // get customize components from page need to edit
    return (
      <div className={`background-white ${visible === true ? "" : "d-none"}`}>
        <div className="middle-content">
          <Form.Item name="pageId" hidden initialValue={pageId}>
            <Input />
          </Form.Item>
          {currentPage?.customizes?.map((block, key) => {
            if (block.isHasBackIcon) {
              return (
                <ElementCustomizationCollapseBlock
                  key={key}
                  props={props}
                  name={block.name}
                  icon={block.icon}
                  title={t(block.title)}
                  isNormal={block.isNormal}
                  defaultActiveKey={block.defaultActiveKey}
                  content={block.content}
                  className={isVisibleBlockContent === true ? "d-none" : ""}
                  onClickHeader={() => {
                    setIsVisibleBlockContent(true);
                    setCurrentContent(<block.content {...props} clickToScroll={block.clickToScroll} />);
                    setCurrentTitle(t(block.title));
                  }}
                  collapsible="disabled"
                  clickToScroll={block.clickToScroll}
                  customizeKey={block.customizeKey}
                  pageConfigName={block.name[1]}
                  isShowRightIconWhenHoverMouse={block.isShowRightIconWhenHoverMouse}
                  iconRight={block.iconRight}
                />
              );
            } else {
              return (
                <ElementCustomizationCollapseBlock
                  key={key}
                  props={props}
                  name={block.name}
                  icon={block.icon}
                  title={t(block.title)}
                  isNormal={block.isNormal}
                  defaultActiveKey={block.defaultActiveKey}
                  content={block.content}
                  className={isVisibleBlockContent === true ? "d-none" : ""}
                  clickToScroll={block.clickToScroll}
                  customizeKey={block.customizeKey}
                  pageConfigName={block.pageConfigName}
                  isShowRightIconWhenHoverMouse={block.isShowRightIconWhenHoverMouse}
                  iconRight={block.iconRight}
                  collapsible={block.collapsible}
                />
              );
            }
          })}

          {/* Visible content homepage */}
          {isVisibleBlockContent === true ? (
            <>
              <div className="selected-menu-back mb-3" onClick={onBackMenuCustomizeHomePage}>
                <ArrowMenuCustomizeIcon className="padding-icon" />
                {currentTitle}
              </div>
              {currentContent}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  const getPrepareDataForBanner = (prepareData) => {
    let bannerPrepareObj = hyperlinkModel;
    bannerPrepareObj.products = prepareData?.products;
    bannerPrepareObj.productCategories = prepareData?.productCategories;
    bannerPrepareObj.subMenus = prepareData?.subMenus;
    bannerPrepareObj.pages = prepareData?.pages;
    bannerPrepareObj.blogs = prepareData?.blogs;

    setPrepareDataForHyperlink(bannerPrepareObj);
    dispatch(setPrepareDataForBanner(bannerPrepareObj));
  };

  const getTheFirstProduct = (response) => {
    if (response?.status === 200 && Object.keys(response?.data).length) {
      setProductDefaultData(response?.data);
    } else {
      setProductDefaultData("");
    }
  };

  const onChangeMenuFooter = (value, isMenuPolicy) => {
    const state = store.getState();
    const menuList = state?.session?.themeConfigMenu;
    let menuItems = menuList?.find((x) => x?.id === value);

    if (!isMenuPolicy) {
      form.setFields([
        {
          name: ["general", "footer", "menu", "menuItems"],
          value: menuItems?.onlineStoreMultiLevelMenus,
        },
      ]);
      // redux will update in onChangeThemeConfigForm
    } else {
      form.setFields([
        {
          name: ["general", "footer", "policy", "menuItems"],
          value: menuItems?.onlineStoreMultiLevelMenus,
        },
      ]);
      // redux will update in onChangeThemeConfigForm
    }
  };

  const onChangeMenuHeader = (value) => {
    const state = store.getState();
    const menuList = state?.session?.themeConfigMenu;
    let menuItems = menuList.find((x) => x.id === value);
    const { general } = form.getFieldsValue();
    const { header } = general;

    form.setFieldsValue({
      ...form.getFieldsValue(),
      general: {
        ...general,
        header: {
          ...header,
          menuItems: menuItems?.onlineStoreMenuItems,
          scrollType: general?.header?.scrollType,
        },
      },
    });
    // redux will update in onChangeThemeConfigForm
  };

  const updateFormValues = () => {
    if (isPageLoading) return;
    fillPageConfigToForm(currentPage);
  };

  const setValueDefault = (name, value, isLogo) => {
    form.setFields([
      {
        name: name,
        value: value,
      },
    ]);
    const { general } = form.getFieldsValue();
    const { footer } = general;
    const { generalCustomization, logo } = footer;
    let themeConfig = store.getState()?.session?.themeConfig;
    let themeConfigNew;
    if (isLogo) {
      themeConfigNew = {
        ...themeConfig,
        general: {
          ...general,
          footer: {
            ...footer,
            logo: {
              ...logo,
              logoUrl: value,
            },
          },
        },
      };
    } else {
      themeConfigNew = {
        ...themeConfig,
        general: {
          ...general,
          footer: {
            ...footer,
            generalCustomization: {
              ...generalCustomization,
              backgroundImage: value,
            },
          },
        },
      };
    }

    dispatch(setThemeCustomizeConfig(themeConfigNew));
  };

  const onDiscard = () => {
    setShowConfirm(false);
    setSelectedTab("");
    setIsActionBack(false);
  };

  const onCompleted = async () => {
    setShowConfirm(false);
    if (isActionBack) {
      window.location.href = onlineStoreUrl;
    }
    await fetchData();
    if (selectPageId) {
      await changePageConfig(selectPageId);
    }
  };

  const onOk = async () => {
    await fetchData();
    setCurrentTab(selectedTab);
    setSelectedTab("");
  };

  const ReloadChangedValue = async (event) => {
    const state = store.getState();
    let oldObj = state?.session?.themeConfigDefault;

    let newObj = state?.session?.themeConfig;

    let compare = await CompareTwoObjs(newObj, oldObj, currentPage);

    if (!compare) {
      if (event) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = "";
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  if (!isReadyCustomize) {
    return <LoadingBg />;
  }
  return (
    <>
      <div className="theme-customize">
        <Header />
        <Body />
      </div>
      <DeleteConfirmComponent
        title={translateData.leaveDialog.confirmation}
        content={translateData.leaveDialog.content}
        visible={showConfirm}
        skipPermission={true}
        cancelText={translateData.discardBtn}
        okText={translateData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onCompleted}
      />
      {/*For changing tab unsaved confirm*/}
      <DeleteConfirmComponent
        title={translateData.leaveDialog.confirmation}
        content={translateData.leaveDialog.content}
        visible={selectedTab && selectedTab.length > 0}
        skipPermission={true}
        cancelText={translateData.discardBtn}
        okText={translateData.confirmLeaveBtn}
        onCancel={onDiscard}
        onOk={onOk}
      />
    </>
  );
}
