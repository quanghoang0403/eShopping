import { RightOutlined } from "@ant-design/icons";
import { Popover } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { ScrollHeaderType } from "../../constants/enums";
import { HyperlinkType } from "../../constants/hyperlink-type.constants";
import { storeConfigSelector } from "../../modules/session/session.reducers";
import { handleHyperlinkValue, truncateText } from "../../utils/helpers";
import { getStorage, localStorageKeys, removeStorage, setStorage } from "../../utils/localStorage.helpers";
import { ArrowDownIcon } from "../assets/icons.constants";
import { ReactComponent as AccountIcon } from "../assets/icons/account.svg";
import { ReactComponent as CartIcon } from "../assets/icons/cart.svg";
import navbarIcon from "../assets/icons/nav-bar.svg";
import defaultLogo from "../assets/images/coffee-mug-logo.png";
import { backgroundTypeEnum } from "../constants/store-web-page.constants";
import { maxNumberCart } from "../constants/string.constants";
import SelectLanguageContainer from "../containers/SelectLanguageContainer";
import ChangeLanguageDesktop from "./ChangeLanguageDesktop/ChangeLanguageDesktop";
import { AccountComponent } from "./fnb-account/account.component";
import { CartComponent } from "./fnb-cart/cart.component";
import ImageWithFallback from "./fnb-image-with-fallback/fnb-image-with-fallback.component";
import "./header.component.scss";
import LoginPopover from "./login-popover.component";
export function ThemeOriginalHeader(props) {
  // Listener theme config
  const { logo, isDefault, isCustomize, colorConfig, headerConfig } = props;

  const headerMenuOptions = useSelector((state) => state?.themeConfig?.headerMenuOptions);
  const headerMenuOption = headerMenuOptions?.find((x) => x.id === headerConfig?.menuId);
  const menuItemsGeneral = headerConfig?.menuItems ?? [];
  const headerMenus = headerMenuOption?.onlineStoreMultiLevelMenus ?? menuItemsGeneral;

  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;

  const path = props?.path ?? "";
  const [t] = useTranslation();
  const [groupColorConfig, setGroupColorConfig] = useState();
  const [menus, setMenus] = useState();
  const [isMaxMenu, setIsMaxMenu] = useState(false);
  const [isShowCart, setIsShowCart] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isShowAccount, setIsShowAccount] = useState(false);
  const [activeMenu, setActiveMenu] = useState();
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const isTablet = useMediaQuery({ maxWidth: 1280, minWidth: 576 });
  const isMaxWidth1199 = useMediaQuery({ maxWidth: 1199 });
  const isMinWidth1199 = useMediaQuery({ minWidth: 1200 });
  const [maxMenuSupport, setMaxMenuSupport] = useState(5);
  const [isShowLanguageOnMobile, setIsShowLanguageOnMobile] = useState(false);
  const contentRef = useRef(null);
  const [moreMenuItems, setMoreMenuItems] = useState([]);

  const sizeAnotherComponent = 270 + 12 + 102 + 102 + 40 * 4;
  const sizeLogo = 256;
  const maxWidthNavList = useMemo(() => {
    const marginLeft = window.innerWidth * 0.08;
    return window.innerWidth - sizeAnotherComponent - marginLeft - sizeLogo;
  }, [sizeAnotherComponent]);

  const setMenuHeader = useCallback(() => {
    let currentHeaderMenus = headerMenus;
    if (!isAllowReserveTable) {
      currentHeaderMenus = headerMenus?.filter((x) => x.hyperlinkOption !== HyperlinkType.RESERVATION);
    }
    const isMaxMenu = currentHeaderMenus?.length > maxMenuSupport;
    const menus = currentHeaderMenus?.slice(0, maxMenuSupport);
    setIsMaxMenu(isMaxMenu);
    setMenus(menus);
    /// If number of menu item > 5 item => Add menu item "..."
    if (Array.isArray(headerMenus)) {
      const menuLength = currentHeaderMenus?.length - maxMenuSupport;
      const moreMenuItems = menuLength <= 0 ? [] : currentHeaderMenus?.slice(-menuLength);
      setMoreMenuItems(moreMenuItems);
    }
  }, [headerMenus, maxMenuSupport, isAllowReserveTable]);

  const getGroupColor = useCallback(
    (id) => {
      const group = colorConfig?.colorGroups?.find((item) => item.id === id);
      if (group) {
        setGroupColorConfig(group);
      }
    },
    [colorConfig],
  );

  useEffect(() => {
    //Check if user is login or not
    const login = getStorage(localStorageKeys.LOGIN);
    if (login) setIsLogin(true);
    const menuItems = document.querySelectorAll('#nav-menu-mobile-list li a[href*="#"]');
    for (var i = 0; i < menuItems.length; i++) {
      var menuItem = menuItems[i];
      var isParentMenu =
        menuItem.nextElementSibling && menuItem.nextElementSibling.classList.contains("sub-nav-menu-mobile");
      menuItem.onclick = (e) => {
        if (isParentMenu) {
          e.preventDefault();
        }
      };
    }
  }, [headerConfig?.menuId]);

  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef?.current?.getBoundingClientRect()?.width;
      if (width !== 0 && width - maxMenuSupport >= maxWidthNavList) {
        const navItems = contentRef?.current?.querySelectorAll(".menu-header-trigger");
        let maxItem = 0;
        let widthCurrent = 0;
        for (let i = 0; i < navItems.length; i++) {
          const width = navItems[i]?.getBoundingClientRect()?.width;
          if (widthCurrent + width <= maxWidthNavList) {
            widthCurrent += width;
            maxItem += 1;
          } else {
            break;
          }
        }
        setMaxMenuSupport(maxItem);
      }
    }
  }, [contentRef.current]);

  useEffect(() => {
    setMenuHeader();
  }, [isAllowReserveTable]);

  useEffect(() => {
    setMenuHeader();
    checkLocationCurrentAddStyleHeader();
  }, [maxMenuSupport, headerMenus]);

  useEffect(() => {
    // get route from parameter URL
    const arrParam = window.location.pathname.split("/");
    if (!arrParam || arrParam?.length < 1) return;
    function getActiveMenuURL(arr) {
      const slicedArray = arr?.slice(2);
      const result = slicedArray?.join("/");
      return result;
    }
    let pagePath = isDefault ? "/" + arrParam[3] : "/" + arrParam[1];
    if (arrParam?.length >= 3) {
      const getUrlActiveMenu = getActiveMenuURL(arrParam);
      pagePath += "/" + getUrlActiveMenu;
    }
    // set state to compare and add class active
    setActiveMenu(pagePath);
    removeStorage(localStorageKeys.ACTIVE_MENU);
    setStorage(localStorageKeys.ACTIVE_MENU, pagePath);
    getGroupColor(headerConfig?.colorGroupId);
  }, []);

  useEffect(() => {
    getGroupColor(headerConfig?.colorGroupId);
  }, [colorConfig?.colorGroups, headerConfig]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setStorage(localStorageKeys.ACTIVE_MENU, menu);
    document.removeEventListener("touchmove", preventDefault, { passive: false });
    document.body.classList.remove("disable-scroll");
    window.isForceHideDeliveryAddressModal = true;
  };

  const CartQuantity = () => {
    const cartItems = useSelector((state) => state.session?.cartItems);
    return (
      <>
        {cartItems && cartItems?.length > 0 && (
          <span className="cart-quantity" id="cart-quantity">
            {cartItems?.reduce((amount, productList) => {
              return amount + productList.quantity;
            }, 0) > maxNumberCart
              ? maxNumberCart.toString().concat("+")
              : cartItems?.reduce((amount, productList) => {
                  return amount + productList.quantity;
                }, 0)}
          </span>
        )}
      </>
    );
  };

  function checkLocationCurrentAddStyleHeader() {
    const getCurrentUrl = window.location.pathname.split("/")[1];
    if (getCurrentUrl === "my-profile") {
      const themeheaderMenu = document.querySelector(".theme1-original-header");
      if (themeheaderMenu) {
        themeheaderMenu.style.height = "64px";
      }
    }
  }

  function handleMenuMobileClick(event) {
    event?.target?.classList?.toggle("menu_arrow_rotate");
    event?.target?.classList?.toggle("menu_arrow_rotate_reset");
    event?.target?.parentElement?.nextSibling?.classList?.toggle("menu_arrow_hide");
    document.body.classList.remove("disable-scroll");
    document.removeEventListener("touchmove", preventDefault, { passive: false });
  }

  function handleNavbarActive(event) {
    document.getElementsByClassName("nav-bar")[0].classList.toggle("nav-bar-active");
    document.body.classList.toggle("disable-scroll");
    document.removeEventListener("touchmove", preventDefault, { passive: false });
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  const StyledHeader = styled.div`
    background-color: ${headerConfig?.backgroundColor};
    background-image: url(${headerConfig?.backgroundType === backgroundTypeEnum.Image
      ? headerConfig?.backgroundImage
      : ""});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    #nav-menu > li > a {
      color: ${(props) => groupColorConfig?.titleColor ?? props.theme.config?.colorGroup?.titleColor};
      svg path {
        stroke: ${(props) => groupColorConfig?.titleColor ?? props.theme.config?.colorGroup?.titleColor};
      }
      cursor: pointer;
    }
    #nav-menu > li > a span.active {
      border-bottom: 2px solid ${(props) => groupColorConfig?.titleColor ?? props.theme.config?.colorGroup?.titleColor};
      padding-bottom: 5px;
      font-weight: bold;
    }
    #nav-menu > .nav-menu-main:hover a {
      cursor: pointer;
      opacity: 0.8;
    }
    #nav-menu .sub-nav-menu li a {
      color: #282828;
    }
    #nav-menu .sub-nav-menu li:hover,
    #nav-menu .sub-nav-menu li:hover a,
    #nav-menu .sub-nav-menu li a.active {
      background-color: ${(props) =>
        groupColorConfig?.buttonBackgroundColor ?? props.theme.config?.colorGroup?.buttonBackgroundColor};
      color: ${(props) => groupColorConfig?.buttonTextColor ?? props.theme.config?.colorGroup?.buttonTextColor};
    }

    #nav-menu .sub-nav-menu li a.active {
      color: ${(props) => groupColorConfig?.buttonTextColor ?? props.theme.config?.colorGroup?.buttonTextColor};
    }

    #nav-menu .sub-nav-menu li:hover,
    #nav-menu .sub-nav-menu li:hover a {
      opacity: 0.8;
    }

    .account-cart .account > svg > path,
    .account-cart .cart > svg > path {
      stroke: ${groupColorConfig?.titleColor};
    }
    .account-cart .change-language-desktop .Flag-Default-Title {
      color: ${groupColorConfig?.titleColor};
    }
    .account-cart .change-language-desktop .link-language svg > path {
      fill: ${groupColorConfig?.titleColor};
    }
    .nav-dropdown {
      .scroll-border-radius {
        li:hover a {
          cursor: pointer;
          opacity: 0.8;
          background-color: ${groupColorConfig?.buttonBackgroundColor};
          color: ${groupColorConfig?.buttonTextColor};
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .icon-right-outlined {
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        .nav-menu-li-dropdown-children {
          .sub-nav-menu {
            .li-sub-menu:hover a {
              cursor: pointer;
              opacity: 0.8;
              background-color: ${groupColorConfig?.buttonBackgroundColor} !important;
              color: ${groupColorConfig?.buttonTextColor} !important;
              border-radius: 8px;
              display: flex;
              justify-content: start;
              align-items: center;
            }
            .li-sub-menu .active {
              background-color: ${groupColorConfig?.buttonBackgroundColor} !important;
              color: ${groupColorConfig?.buttonTextColor} !important;
              opacity: 1;
            }
          }
        }
      }
    }
    .active-more {
      color: ${groupColorConfig?.titleColor};
      border-bottom: 2px solid ${groupColorConfig?.titleColor};
      padding-bottom: 5px;
      font-weight: bold !important;
    }
  `;

  const StyledMenuItems = styled.span`
    .view-more-icon {
      svg {
        fill: ${groupColorConfig?.titleColor};
      }
    }
  `;

  const handleItemMenu = (index) => {
    const menuArrowCollapseElement = document.getElementById("menuArrowCollapse-" + index);
    if (menuArrowCollapseElement) {
      menuArrowCollapseElement.classList.toggle("menu_arrow_right");
    }

    const menuArrowExpandElement = document.getElementById("menuArrowExpand-" + index);
    if (menuArrowExpandElement) {
      menuArrowExpandElement.classList.toggle("menu_arrow_right");
    }
  };

  const handleDisplayBlock = (flag) => {
    const blockNavMenu = document.getElementsByClassName("nav-dropdown")[0];
    if (blockNavMenu != null) {
      blockNavMenu.style.display = flag ? "none" : "block";
    }
  };

  const handleDisplayChildren = (index, flag) => {
    const blockNavMenu = document.getElementsByClassName("nav-menu-li-dropdown-children")[index]?.children[1];
    if (blockNavMenu != null) {
      blockNavMenu.style.setProperty("display", flag ? "block" : "none", "important");
    }
  };

  const handleDislayNoneSubMenu = () => {
    const blockNavMenu = document.getElementsByClassName("nav-dropdown")[0];
    if (blockNavMenu != null) {
      blockNavMenu.style.display = "none";
    }
  };

  useEffect(() => {
    if (headerConfig?.scrollType === ScrollHeaderType.FIXED) return;
    let prevScrollPos = window.scrollY;
    let idNavProductList = "wrapper-sticky-slider-category-product-list-theme1-id";
    window.onscroll = function () {
      const currentScrollPos = window.scrollY;

      if (prevScrollPos > currentScrollPos) {
        // Scrolling up, show the header
        const headerTabElement = document.getElementById("header");
        if (headerTabElement != null) {
          document.getElementById("header").style.top = "0";
          const navProductListElement = document.getElementById(idNavProductList);
          if (navProductListElement) {
            if (isMaxWidth575) {
              navProductListElement.style.top = "8px";
            } else if (isTablet) {
              navProductListElement.style.top = "8px";
            } else {
              navProductListElement.style.top = "51px";
            }
          }
        }
      } else {
        // Scrolling down, hide the header
        const headerTabElement = document.getElementById("header");
        if (headerTabElement != null) document.getElementById("header").style.top = "-100px";
        const navProductListElement = document.getElementById(idNavProductList);
        if (navProductListElement) {
          navProductListElement.style.top = "-51px";
        }
      }
      if (currentScrollPos <= 0 || prevScrollPos <= 0) {
        const headerTabElement = document.getElementById("header");
        if (headerTabElement != null) document.getElementById("header").style.top = "0";
      }
      prevScrollPos = currentScrollPos;
    };
  }, [headerConfig?.scrollType]);

  return (
    <>
      <div
        className={`cart-wrap ${!isShowCart && "d-none"}`}
        onClick={() => {
          setIsShowCart(false);
        }}
      ></div>
      <div
        className={`cart-wrap ${!isShowAccount && "d-none"}`}
        onClick={() => {
          setIsShowAccount(false);
        }}
      ></div>
      <StyledHeader
        id="header"
        className={`header-theme1-new theme1-header-for-admin ${
          headerConfig?.scrollType !== ScrollHeaderType.FIXED ? "scroll-header-theme1" : "fixed-header-theme1"
        }`}
      >
        <div id="themeHeader" onClick={handleDislayNoneSubMenu}>
          <div id="box-content" className="main-session">
            <label className="nav-bar" htmlFor="nav-mobile-input" onClick={handleNavbarActive}>
              <img src={navbarIcon} alt="Nav bar" />
            </label>
            <div className="logo-menu-contain">
              <a href={`${path}/home`} className="logo-contain">
                <ImageWithFallback
                  src={headerConfig?.logoUrl ?? logo?.url}
                  alt="icon"
                  fallbackSrc={defaultLogo}
                  className="logo-original-theme"
                  align={isMaxWidth1199 ? "center" : "left"}
                />
              </a>
              <ul id="nav-menu" ref={contentRef}>
                {menus?.map((item, index) => {
                  return (
                    <li key={index} className="menu-header-trigger nav-menu-main">
                      {item?.children && item?.children?.length > 0 ? (
                        <a>
                          {truncateText(t(item.name, 25))} <ArrowDownIcon className="arrow-down-icon" />
                        </a>
                      ) : (
                        <a
                          href={`${handleHyperlinkValue(item.hyperlinkOption, item.url)}`}
                          onClick={() => handleMenuClick(handleHyperlinkValue(item.hyperlinkOption, item.url))}
                        >
                          <span
                            className={
                              (activeMenu === handleHyperlinkValue(item.hyperlinkOption, item.url) ||
                                (!activeMenu && index === 0)) &&
                              "active"
                            }
                          >
                            {truncateText(t(item?.name, 25))}
                          </span>
                        </a>
                      )}
                      {item?.children && item?.children?.length > 0 && (
                        <ul className="sub-nav-menu sub-nav-menu-type-2">
                          {item?.children &&
                            item?.children
                              ?.sort((a, b) => a.position - b.position)
                              .map((itemSubMenu, indexSubMenu) => {
                                return (
                                  <li key={indexSubMenu} className="li-sub-menu">
                                    <a
                                      className={
                                        activeMenu ===
                                          handleHyperlinkValue(itemSubMenu.hyperlinkOption, itemSubMenu.url) && "active"
                                      }
                                      onClick={() =>
                                        handleMenuClick(
                                          handleHyperlinkValue(itemSubMenu.hyperlinkOption, itemSubMenu.url),
                                        )
                                      }
                                      href={`${handleHyperlinkValue(itemSubMenu.hyperlinkOption, itemSubMenu.url)}`}
                                    >
                                      {truncateText(t(itemSubMenu?.name, 20))}
                                    </a>
                                  </li>
                                );
                              })}
                        </ul>
                      )}
                    </li>
                  );
                })}

                {menus?.length >= maxMenuSupport && moreMenuItems?.length > 0 && isMinWidth1199 && (
                  <>
                    <li
                      onMouseEnter={() => handleDisplayBlock(false)}
                      onMouseLeave={() => handleDisplayBlock(true)}
                      className="nav-menu-li-dropdown"
                      key="999"
                      style={{ marginLeft: "-12px" }}
                    >
                      <a href="#!" onMouseEnter={() => handleItemMenu(999)} onMouseLeave={() => handleItemMenu(999)}>
                        <div style={{ color: groupColorConfig?.titleColor }}>
                          <StyledMenuItems>
                            <span className="view-more-icon">...</span>
                          </StyledMenuItems>
                        </div>
                      </a>
                      <ul className="nav-dropdown" style={isCustomize ? { top: 106, left: -116 } : {}}>
                        <div className="scroll-border-radius">
                          {moreMenuItems?.map((item, index) => {
                            return (
                              <li
                                className="nav-menu-li-dropdown-children"
                                onMouseEnter={() => handleDisplayChildren(index, true)}
                                onMouseLeave={() => handleDisplayChildren(index, false)}
                                key={index}
                              >
                                {item?.children && item?.children?.length > 0 ? (
                                  <a>
                                    {truncateText(t(item.name, 25))} <RightOutlined className="icon-right-outlined" />
                                  </a>
                                ) : (
                                  <a
                                    href={`${handleHyperlinkValue(item.hyperlinkOption, item.url)}`}
                                    onClick={() =>
                                      handleMenuClick(handleHyperlinkValue(item.hyperlinkOption, item.url))
                                    }
                                  >
                                    <span
                                      className={
                                        (activeMenu === handleHyperlinkValue(item.hyperlinkOption, item.url) ||
                                          (!activeMenu && index === 0)) &&
                                        "active-more"
                                      }
                                    >
                                    {truncateText(item?.name)}
                                    </span>
                                  </a>
                                )}
                                {item?.children && item?.children?.length > 0 && (
                                  <ul className="sub-nav-menu">
                                    {item?.children &&
                                      item?.children
                                        ?.sort((a, b) => a.position - b.position)
                                        .map((itemSubMenu, indexSubMenu) => {
                                          return (
                                            <li key={indexSubMenu} className="li-sub-menu">
                                              <a
                                                className={
                                                  activeMenu ===
                                                    handleHyperlinkValue(
                                                      itemSubMenu.hyperlinkOption,
                                                      itemSubMenu.url,
                                                    ) && "active-more"
                                                }
                                                onClick={() =>
                                                  handleMenuClick(
                                                    handleHyperlinkValue(itemSubMenu.hyperlinkOption, itemSubMenu.url),
                                                  )
                                                }
                                                href={`${handleHyperlinkValue(
                                                  itemSubMenu.hyperlinkOption,
                                                  itemSubMenu.url,
                                                )}`}
                                              >
                                                      {truncateText(itemSubMenu?.name)}
                                              </a>
                                            </li>
                                          );
                                        })}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </div>
                      </ul>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="account-cart">
              <Popover
                placement="bottom"
                overlayClassName="account-header-theme-1-popover"
                content={isLogin ? <AccountComponent /> : <LoginPopover />}
                trigger="click"
                open={isShowAccount}
                onOpenChange={(isShowAccount) => {
                  window.isForceHideDeliveryAddressModal = true;
                  setIsShowAccount(true);
                }}
                getPopupContainer={(trigger) => trigger.parentElement}
                showArrow={!isMaxWidth1199}
              >
                <span className="account">
                  <AccountIcon />
                </span>
              </Popover>
              <Popover
                placement="bottomRight"
                overlayClassName="cart-header-theme-1-popover"
                content={<CartComponent isShowCart={isShowCart} />}
                trigger="click"
                open={isShowCart}
                onOpenChange={(isShowCart) => {
                  window.isForceHideDeliveryAddressModal = true;
                  setIsShowCart(true);
                }}
                getPopupContainer={(trigger) => trigger.parentElement}
                showArrow={!isMaxWidth1199}
              >
                <span className="cart" style={{ marginLeft: isMaxMenu || isMaxWidth575 ? "10px" : "34px" }}>
                  <CartIcon />
                  <CartQuantity />
                </span>
              </Popover>
              {!isMaxWidth1199 && !isCustomize && (
                <>
                  <ChangeLanguageDesktop />
                </>
              )}
            </div>
            <input hidden type="checkbox" className="nav-input-header" id="nav-mobile-input" />
            <label htmlFor="nav-mobile-input" className="overlay" onClick={handleNavbarActive}></label>
            <div className="nav-menu-mobile">
              <label htmlFor="nav-mobile-input"></label>
              <ul id="nav-menu-mobile-list">
              {(menus && Array.isArray(menus) ? [...menus, ...(moreMenuItems || [])] : []).map((item, index) => {
                  return (
                    <li key={index} className={isShowLanguageOnMobile ? "d-none" : "d-block"}>
                      {item?.children && item?.children.length > 0  ? (
                        <a>
                          {item?.name}
                          <ArrowDownIcon
                            onClick={handleMenuMobileClick}
                            className="arrow-right-mobile menu_arrow_rotate_reset"
                          />
                        </a>
                      ) : (
                        <a href={`${handleHyperlinkValue(item.hyperlinkOption, item.url)}`}>
                          {truncateText(item?.name)}
                        </a>
                      )}
                      {item?.children && item?.children.length > 0 && (
                        <>
                          <ul className="sub-nav-menu-mobile">
                            {item?.children
                              ?.sort((a, b) => a.position - b.position)
                              .map((itemSubMenu, indexSubMenu) => {
                                return (
                                  <li key={indexSubMenu} className="li-sub-menu">
                                    <a href={`${handleHyperlinkValue(itemSubMenu.hyperlinkOption, itemSubMenu.url)}`}>
                                      {truncateText(itemSubMenu?.name)}
                                    </a>
                                  </li>
                                );
                              })}
                          </ul>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
              <SelectLanguageContainer className="custom-language" />
            </div>
          </div>
        </div>
      </StyledHeader>
      <div className={`header-wrap ${!isShowCart && "d-none"}`} onClick={() => setIsShowCart(false)}></div>
      <div className={`header-wrap ${!isShowAccount && "d-none"}`} onClick={() => setIsShowAccount(false)}></div>
    </>
  );
}
