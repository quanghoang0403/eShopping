import { Badge, Image, Popover } from "antd";
import jwt_decode from "jwt-decode";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { store } from "../../modules";
import { setSelectedSubMenuId, setUserInfo } from "../../modules/session/session.actions";
import { storeConfigSelector } from "../../modules/session/session.reducers";
import { firebase } from "../../utils/firebase";
import { colorToRgba, handleHyperlinkValue, truncateText } from "../../utils/helpers";
import { getStorage, localStorageKeys, removeStorage, setStorage } from "../../utils/localStorage.helpers";
import "../assets/css/home-page.style.scss";
import { ArrowDownIcon, HeaderViewMoreMenuIcon, MyReservationIcon, UserIconUrl } from "../assets/icons.constants";
import closeNavbarIcon from "../assets/icons/close-nav-bar.svg";
import profileCricle from "../assets/icons/profile-circle.svg";
import menuPointUrl from "../assets/images/menu_point.svg";
import DefaultLogo from "../assets/images/pho-viet-logo.png";
import { Hyperlink } from "../constants/hyperlink.constants";
import { profileTab } from "../constants/string.constant";
import SelectLanguageContainer from "../containers/SelectLanguageContainer";
import ShoppingCartPage from "../pages/shopping-cart/shopping-cart.page";
import ChangeLanguageDesktop from "./ChangeLanguageDesktop/ChangeLanguageDesktop";
import CartComponent from "./cart/cart.component";
import { DeliveryAddressSelectorComponent } from "./delivery-address-selector/delivery-address-selector.component";
import LoginPopover from "./login-popover.component";
export function Theme2OriginalHeader(props) {
  // Listener theme config
  //const headerConfig = useSelector((state) => state?.themeConfig?.data?.general?.header);
  const headerConfig = useSelector((state) => state?.session?.themeConfig?.general?.header);
  const headerMenuOptions = useSelector((state) => state?.themeConfig?.headerMenuOptions);
  const isAllowReserveTable = useSelector(storeConfigSelector)?.isAllowReserveTable;
  const dispatch = useDispatch();
  const { logo, menuItem, colorGroups, config, isCustomize, isDefault, stateConfig, fontFamily } = props;
  const isMaxWidth600 = useMediaQuery({ maxWidth: 600 });
  const isDevicesTablet = useMediaQuery({ maxWidth: 1336, minWidth: 600 });
  const isMaxWidth640 = useMediaQuery({ maxWidth: 640 });
  const [t] = useTranslation();
  const history = useHistory();
  const selectedSubMenuId = useSelector((state) => state.session.selectedSubMenuID);
  const [headerMenus, setHeaderMenus] = useState(menuItem);
  const [__menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState();
  const [moreMenuItems, setMoreMenuItems] = useState([]);
  const [moreProfileInfo, setMoreProfileInfo] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isCalculate, setIsCalculate] = useState(true);
  const [isRefreshShowCart, setIsRefreshShowCart] = useState(false);
  const groupColorConfig = stateConfig?.general?.color?.colorGroups?.find((c) => c.id === headerConfig?.colorGroupId);
  const [maxMenuSupport, setMaxMenuSupport] = useState(5);
  const token = getStorage("token");
  const decoded = token && jwt_decode(token);
  const [isShowLanguageOnMobile, setIsShowLanguageOnMobile] = useState(false);

  const ScrollHeaderType = {
    SCROLL: 1,
    FIXED: 2,
  };
  const pageData = {
    logOut: t("loginPage.logOut", "Log Out"),
    myAccount: t("storeWebPage.header.myAccount", "My Account"),
    order: t("storeWebPage.header.order", "Order"),
    myReservation: t("reservation.myReservation", "My Reservations"),
  };
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  const accessToken = getStorage(localStorageKeys.TOKEN);
  const isLogin = customerInfo && accessToken;

  useEffect(() => {
    if (!headerConfig?.menuId || headerMenuOptions?.length < 1) return;
    const headerMenuOption = headerMenuOptions?.find((x) => x?.id === headerConfig?.menuId);
    const menuItems = headerMenuOption?.onlineStoreMultiLevelMenus ?? [];
    setHeaderMenus(menuItems);
  }, [headerConfig?.menuId, headerMenuOptions]);

  const setMenuHeader = useCallback(() => {
    const menuItemSlice = headerMenus?.slice(0, maxMenuSupport);
    setMenus(menuItemSlice);

    /// If number of menu item > 5 item => Add menu item "..."
    if (Array.isArray(headerMenus)) {
      const menuLength = headerMenus?.length - maxMenuSupport;
      const moreMenuItems = menuLength <= 0 ? [] : headerMenus?.slice(-menuLength);
      setMoreMenuItems(moreMenuItems);
    }
  }, [headerMenus, maxMenuSupport]);

  const StyledMenuItems = styled.span`
    .view-more-icon {
      svg {
        fill: ${groupColorConfig?.titleColor};
      }
    }
  `;
  const StyledLanguage = styled.div`
    .change-language-desktop {
      .link-language {
        color: ${groupColorConfig?.titleColor};
        .link-language-icon-desktop path {
          stroke: ${groupColorConfig?.titleColor};
        }
      }
    }
  `;

  const StyledDeliveryAddressSelector = styled.div`
    .delivery-address-selector-theme2 {
      .delivery-address-header-box {
        background-color: ${colorToRgba(groupColorConfig?.titleColor)};
        .right-box {
          svg path {
            stroke: ${groupColorConfig?.titleColor ?? "white"};
          }
        }
      }
    }
  `;

  const StyledPopoverLoginHeader = styled.div`
    .login_content_theme2 {
      .title {
        color: ${groupColorConfig?.textColor ? groupColorConfig?.textColor : "#282828"};
        &:hover {
          color: ${groupColorConfig?.buttonBackgroundColor ? groupColorConfig?.buttonBackgroundColor : "#DB4D29"};
        }
      }
    }

    .user-profile-contain {
      .user-profile-icon {
        color: ${groupColorConfig?.textColor ? groupColorConfig?.textColor : "#282828"};
        &:hover {
          color: ${groupColorConfig?.buttonBackgroundColor ? groupColorConfig?.buttonBackgroundColor : "#DB4D29"};
        }
        svg {
          fill: ${groupColorConfig?.buttonBackgroundColor};
          path {
            fill: ${groupColorConfig?.buttonBackgroundColor};
          }
        }
      }
    }
  `;

  const StyledSubMenuItem = styled.div`
    .subMenuHover:hover .child-menu-item-header,
    .subMenuHover:hover .sub-more-menu-items-theme2 {
      color: rgba(32, 32, 32, 0.8);
      cursor: pointer;
    }
    .subMenuHover {
      &:hover {
        background-color: ${colorToRgba(groupColorConfig?.buttonBackgroundColor, 0.2)} !important;
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
  const handleSubMenuEnter = (itemChildId) => {
    document.getElementById("subMenuHover-" + itemChildId).style.backgroundColor = colorToRgba(
      groupColorConfig?.buttonBackgroundColor,
      0.2,
    );
    document.getElementById("subMenuHover-" + itemChildId).style.borderRadius = "12px";
  };

  const handleSubMenuLeave = (itemChildId) => {
    document.getElementById("subMenuHover-" + itemChildId).style.backgroundColor =
      itemChildId === selectedSubMenuId ? groupColorConfig.buttonBackgroundColor : "";
    document.getElementById("subMenuHover-" + itemChildId).style.borderRadius = "12px";
  };

  const changeVisiblePopover = () => {
    if (!clicked) {
      setIsCalculate(false);
    }
    setClicked(!clicked);
  };

  const onLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        store.dispatch(setUserInfo({}));
        setMoreProfileInfo(false);
        removeStorage(localStorageKeys.LOGIN);
        removeStorage(localStorageKeys.TOKEN);
        removeStorage(localStorageKeys.CUSTOMER_INFO);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Handle Render Header Component
  const contentRef = useRef(null);

  const marginLeft = useMemo(() => {
    return window.innerWidth * 0.04;
  }, []);
  const sizeAnotherComponent = useMemo(() => {
    return 460 + 92 + 16;
  }, []);
  const sizeLogo = 240;
  const [maxWidthNavList, setMaxWidthNavList] = useState(1200 / 2 - sizeLogo / 2);

  useEffect(() => {
    if (isCustomize === true) {
      setMaxWidthNavList((window.innerWidth - sizeAnotherComponent) / 2 - marginLeft - sizeLogo / 2);
    }
  }, [isCustomize]);

  useEffect(() => {
    if (contentRef.current) {
      const width = contentRef?.current?.getBoundingClientRect()?.width;
      if (width !== 0 && width - maxMenuSupport >= maxWidthNavList) {
        const navItems = contentRef?.current?.querySelectorAll(".menu-header-trigger");
        if (navItems) {
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
    }
  }, [contentRef.current]);

  useEffect(() => {
    setMenuHeader();
  }, [maxMenuSupport, headerConfig, setMenuHeader]);

  useEffect(() => {
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
    setActiveMenu(pagePath);
    removeStorage(localStorageKeys.ACTIVE_MENU);
    setStorage(localStorageKeys.ACTIVE_MENU, pagePath);
  }, []);

  const logoutContent = (
    <>
      <div onClick={onLogout} className="login_content_theme1">
        {pageData.logOut}
      </div>
    </>
  );
  const renderUserIcon = (
    <div className="user-profile-contain">
      {isLogin && (
        <>
          <a className="user-profile-icon" href={`/my-profile/${profileTab.myAccount}`}>
            {/* <img src={userInfoNav} alt="" /> */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z"
                fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
              />
              <path
                d="M17.0809 14.15C14.2909 12.29 9.74094 12.29 6.93094 14.15C5.66094 15 4.96094 16.15 4.96094 17.38C4.96094 18.61 5.66094 19.75 6.92094 20.59C8.32094 21.53 10.1609 22 12.0009 22C13.8409 22 15.6809 21.53 17.0809 20.59C18.3409 19.74 19.0409 18.6 19.0409 17.36C19.0309 16.13 18.3409 14.99 17.0809 14.15Z"
                fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
              />
            </svg>

            {pageData.myAccount}
          </a>
          <a className="user-profile-icon" href={`/my-profile/${profileTab.myOrder}`}>
            {/* <img src={userCartNav} alt="" /> */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.25 22.5C17.2165 22.5 18 21.7165 18 20.75C18 19.7835 17.2165 19 16.25 19C15.2835 19 14.5 19.7835 14.5 20.75C14.5 21.7165 15.2835 22.5 16.25 22.5Z"
                fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
              />
              <path
                d="M8.25 22.5C9.2165 22.5 10 21.7165 10 20.75C10 19.7835 9.2165 19 8.25 19C7.2835 19 6.5 19.7835 6.5 20.75C6.5 21.7165 7.2835 22.5 8.25 22.5Z"
                fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
              />
              <path
                d="M4.84 3.94L4.64 6.39C4.6 6.86 4.97 7.25 5.44 7.25H20.75C21.17 7.25 21.52 6.93 21.55 6.51C21.68 4.74 20.33 3.3 18.56 3.3H6.27C6.17 2.86 5.97 2.44 5.66 2.09C5.16 1.56 4.46 1.25 3.74 1.25H2C1.59 1.25 1.25 1.59 1.25 2C1.25 2.41 1.59 2.75 2 2.75H3.74C4.05 2.75 4.34 2.88 4.55 3.1C4.76 3.33 4.86 3.63 4.84 3.94Z"
                fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
              />
              <path
                d="M20.5101 8.75H5.17005C4.75005 8.75 4.41005 9.07 4.37005 9.48L4.01005 13.83C3.87005 15.54 5.21005 17 6.92005 17H18.0401C19.5401 17 20.8601 15.77 20.9701 14.27L21.3001 9.6C21.3401 9.14 20.9801 8.75 20.5101 8.75Z"
                fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
              />
            </svg>

            {pageData.order}
          </a>
          {isAllowReserveTable ? (
            <a className="user-profile-icon" href={`/my-profile/${profileTab.myReservation}`}>
              <MyReservationIcon className="icon" />
              {pageData.myReservation}
            </a>
          ) : (
            <></>
          )}
        </>
      )}
      <a className="user-profile-icon" href="/">
        {/* <img src={userLogoutNav} alt="" /> */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_3599_4174)">
            <path
              d="M14.9998 13C14.4469 13 13.9999 13.4481 13.9999 14V18.0001C13.9999 18.551 13.5519 19 12.9998 19H9.99983V4.00014C9.99983 3.14615 9.45583 2.38315 8.63791 2.09916L8.34183 2.0001H12.9998C13.5519 2.0001 13.9999 2.44907 13.9999 3.00021V6.00018C13.9999 6.55206 14.4469 7.00011 14.9998 7.00011C15.5528 7.00011 15.9998 6.55206 15.9998 6.00018V3.00021C15.9998 1.34624 14.6538 0.000244141 12.9998 0.000244141H2.24998C2.21189 0.000244141 2.18003 0.0172728 2.14304 0.0222166C2.09489 0.0181883 2.04893 0.000244141 2.00004 0.000244141C0.897024 0.000244141 0 0.897085 0 2.0001V19.9999C0 20.8539 0.544001 21.6169 1.36192 21.9009L7.37999 23.907C7.58397 23.97 7.78684 24 7.99998 24C9.10299 24 9.99983 23.103 9.99983 22V21H12.9998C14.6538 21 15.9998 19.654 15.9998 18.0001V14C15.9998 13.4481 15.5528 13 14.9998 13Z"
              fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
            />
            <path
              d="M23.707 9.29317L19.7069 5.29327C19.4211 5.00726 18.991 4.9212 18.6171 5.07611C18.2441 5.2312 18 5.59612 18 6.00023V9.0002H14.0001C13.4481 9.0002 13 9.44807 13 10.0001C13 10.5522 13.4481 11.0001 14.0001 11.0001H18V14C18 14.4041 18.2441 14.7691 18.6171 14.9241C18.991 15.0791 19.4211 14.993 19.7069 14.7072L23.707 10.7071C24.0979 10.3162 24.0979 9.68409 23.707 9.29317Z"
              fill={groupColorConfig?.buttonBackgroundColor ?? "#DB4D29"}
            />
          </g>
          <defs>
            <clipPath id="clip0_3599_4174">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>

        {isLogin ? logoutContent : <LoginPopover isAllowReserveTable={isAllowReserveTable} />}
      </a>
    </div>
  );

  function handleMenuMobileClick(event) {
    event.target.classList.toggle("menu_arrow_rotate");
    event.target.classList.toggle("menu_arrow_rotate_reset");
    event.target.parentElement.nextSibling.classList.toggle("menu_arrow_hide");
  }

  function handleNavbarActive() {
    document.body.classList.toggle("disable-scroll");
    document.removeEventListener("touchmove", preventDefault, { passive: false });
  }

  function preventDefault(e) {
    e.preventDefault();
  }

  const StyledIconFill = styled.div`
    .icon-fill-color {
      path {
        fill: ${groupColorConfig?.titleColor};
      }
    }
  `;

  const handleSubMenuClick = (subMenuId) => {
    // Gọi action creator selectSubMenu khi click vào sub menu
    dispatch(setSelectedSubMenuId(subMenuId));
  };

  const handleSelectedMenuItem = (menu) => {
    setActiveMenu(menu);
    setStorage(localStorageKeys.ACTIVE_MENU, menu);
  };

  const handleClearSubMenuClick = () => {
    dispatch(setSelectedSubMenuId(""));
  };

  const StyledIconStroke = styled.div`
    .icon-stroke-color {
      path {
        stroke: ${groupColorConfig?.titleColor};
      }
    }
  `;

  const removeSrollDisable = () => {
    document.getElementById("nav-mobile-input").click();
    document.body.classList.remove("disable-scroll");
  };

  useEffect(() => {
    const level2ItemsElement = document.querySelectorAll(".sub-nav-menu-header-theme2");
    if (!level2ItemsElement) return;
    const handleMouseEnter = (item) => {
      item.style.display = "block !important";
      const parentElement = item?.closest("li").querySelector(".sub-nav-menu-header-theme2-parent");
      const linkElement = parentElement?.querySelector("a");
      const subMenuHoverId = linkElement?.id;
      const regex = /subMenuHover-(.*)/;
      const splitSubMenuHoverId = subMenuHoverId?.match(regex);
      const subMenuId = splitSubMenuHoverId?.length < 1 ? "" : splitSubMenuHoverId[1];
      handleSubMenuEnter(subMenuId);
    };
    const handleMouseLeave = (item) => {
      item.style.display = "none";
    };
    level2ItemsElement?.forEach((item) => {
      item.addEventListener("mouseenter", () => handleMouseEnter(item));
      item.addEventListener("mouseleave", () => handleMouseLeave(item));
    });

    return () => {
      level2ItemsElement?.forEach((item) => {
        item.removeEventListener("mouseenter", () => handleMouseEnter(item));
        item.removeEventListener("mouseleave", () => handleMouseLeave(item));
      });
    };
  });

  return (
    <div
      style={{
        background:
          headerConfig?.backgroundType === 1
            ? headerConfig?.backgroundColor
            : "url(" + headerConfig?.backgroundImage + ") no-repeat top",
      }}
    >
      <div
        style={{
          background:
            headerConfig?.backgroundType === 1
              ? headerConfig?.backgroundColor
              : "url(" + headerConfig?.backgroundImage + ") no-repeat top",
        }}
        className={`navigation theme2-header header-theme2-new ${
          headerConfig?.scrollType !== ScrollHeaderType.FIXED ? "scroll-header-theme2" : "fixed-header-theme2"
        }`}
        id="header-theme2"
      >
        <div
          className={`page-container ${
            isCustomize ? "page-container-customize-header-theme2" : "page-container-header-theme2"
          }`}
          style={{
            maxWidth: isCustomize ? "70vw" : "1200px",
            position: "relative",
          }}
        >
          {isDevicesTablet && (
            <div className="delivery-address-tablet-theme2">
              <StyledDeliveryAddressSelector>
                <DeliveryAddressSelectorComponent groupColorConfig={groupColorConfig} isCustomize={isCustomize} />
              </StyledDeliveryAddressSelector>
            </div>
          )}
          <div className="brand">
            <Link to="/">
              <Image preview={false} src={headerConfig?.logoUrl ?? logo?.url} alt="logo" fallback={DefaultLogo}></Image>
            </Link>
          </div>
          <nav>
            <div className="nav-mobile">
              <label id="nav-toggle" htmlFor="nav-mobile-input" className="nav-toggle">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 3L18 3"
                    stroke={groupColorConfig?.titleColor ?? "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 9H10"
                    stroke={groupColorConfig?.titleColor ?? "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 16L14 16"
                    stroke={groupColorConfig?.titleColor ?? "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </label>
              <input
                hidden
                type="checkbox"
                className="nav-input-header"
                id="nav-mobile-input"
                onClick={handleNavbarActive}
              />
              <label htmlFor="nav-mobile-input" className="overlay"></label>
              <div className="nav-menu-mobile">
                {moreProfileInfo ? (
                  <>
                    <div className="profile-mobile profile-mobile-top">
                      <ArrowDownIcon className="menu_arrow_rotate_left" onClick={() => setMoreProfileInfo(false)} />
                      <img
                        src={JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.thumbnail ?? profileCricle}
                        alt=""
                        height="24"
                        width="24"
                      ></img>
                      <span>
                        <div>{decoded?.FULL_NAME}</div>
                      </span>
                    </div>
                    <ul>
                      <li>
                        <a href={`/my-profile/${profileTab.myAccount}`}>Personal Profile</a>
                      </li>
                      <li>
                        <a href={`/my-profile/${profileTab.myAddress}`}>Address & Payment</a>
                      </li>
                      <li>
                        <a href={`/my-profile/${profileTab.myOrder}`}>Order History</a>
                      </li>
                      <li>
                        <a>Booking History</a>
                      </li>
                      <li>
                        <a>Wish List</a>
                      </li>
                      <li>
                        <a onClick={onLogout}>Sign Out</a>
                      </li>
                    </ul>
                  </>
                ) : (
                  <>
                    <label>
                      <img className="close-nav-bar" src={closeNavbarIcon} alt="Close" onClick={removeSrollDisable} />
                    </label>

                    <img
                      className="brand-mobile"
                      src={headerConfig?.logoUrl ?? logo?.url}
                      width="156"
                      height="138"
                      alt="logo"
                    />

                    <ul id="nav-menu-mobile-list">
                      {headerMenus?.map((item, index) => {
                        return (
                          <li key={index} className={isShowLanguageOnMobile ? "d-none" : "d-block"}>
                            {item?.subMenu ? (
                              <a>
                                {truncateText(t(item?.name), 20)}
                                <ArrowDownIcon
                                  className="arrow-right-mobile menu_arrow_rotate_reset"
                                  onClick={handleMenuMobileClick}
                                />
                              </a>
                            ) : (
                              <a href={`${handleHyperlinkValue(item?.hyperlinkOption, item?.url)}`}>
                                {truncateText(t(item?.name), 20)}
                              </a>
                            )}
                            {item?.children && (
                              <>
                                <ul className="sub-nav-menu-mobile">
                                  {item?.children
                                    .sort((a, b) => a?.position - b?.position)
                                    .map((itemSubMenu, indexSubMenu) => {
                                      return (
                                        <li key={indexSubMenu}>
                                          <a
                                            href={`${handleHyperlinkValue(
                                              itemSubMenu?.hyperlinkOption,
                                              itemSubMenu?.url,
                                            )}`}
                                          >
                                            {truncateText(itemSubMenu?.name, 20)}
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
                    <div className="profile-mobile">
                      <img
                        src={JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO))?.thumbnail ?? profileCricle}
                        alt=""
                      />

                      <div>
                        {isLogin ? (
                          decoded?.FULL_NAME
                        ) : (
                          <span
                            onClick={() => {
                              history.push("/login");
                              document.body.classList.remove("disable-scroll");
                            }}
                          >
                            Sign In/ Sign Up
                          </span>
                        )}
                      </div>

                      {isLogin && (
                        <ArrowDownIcon
                          className="arrow-right-mobile menu_arrow_rotate"
                          onClick={() => setMoreProfileInfo(true)}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <ul className="nav-list" ref={contentRef} id={isCustomize ? "" : "nav-menu"}>
              {__menus?.map((item, index) => {
                const className = "active-item-menu-theme2";
                const selectedMenuItemClassName =
                  activeMenu === handleHyperlinkValue(item.hyperlinkOption, item.url) ? className : "";
                if (item?.hyperlinkOption == Hyperlink?.RESERVATION && isAllowReserveTable == false) {
                  return null;
                } else {
                  if (item?.children?.length > 0) {
                    return (
                      <li
                        key={index}
                        className="custom-sub-menu-header-item menu-header-trigger"
                        onClick={() => handleSelectedMenuItem(handleHyperlinkValue(item.hyperlinkOption, item.url))}
                        style={{ position: "relative" }}
                      >
                        <Link
                          to={`#`}
                          onMouseEnter={() => handleItemMenu(index)}
                          onMouseLeave={() => handleItemMenu(index)}
                        >
                          <div style={{ color: groupColorConfig?.titleColor }} className={selectedMenuItemClassName}>
                            {truncateText(t(item?.name), 20)}
                          </div>
                          <svg
                            id={`menuArrowCollapse-${index}`}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.9465 5.45312H7.79316H4.05317C3.41317 5.45312 3.09317 6.22646 3.5465 6.67979L6.99983 10.1331C7.55317 10.6865 8.45317 10.6865 9.0065 10.1331L10.3198 8.81979L12.4598 6.67979C12.9065 6.22646 12.5865 5.45312 11.9465 5.45312Z"
                              fill={groupColorConfig?.titleColor}
                            />
                          </svg>
                          <svg
                            id={`menuArrowExpand-${index}`}
                            className="menu_arrow_right"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.0535 10.5469L8.20684 10.5469L11.9468 10.5469C12.5868 10.5469 12.9068 9.77354 12.4535 9.32021L9.00017 5.86687C8.44684 5.31354 7.54683 5.31354 6.9935 5.86687L5.68017 7.18021L3.54017 9.32021C3.0935 9.77354 3.4135 10.5469 4.0535 10.5469Z"
                              fill={groupColorConfig?.titleColor}
                            />
                          </svg>
                        </Link>
                        <ul className="nav-dropdown">
                          <div className="scroll-border-radius">
                            {item?.children
                              ?.sort((a, b) => a.position - b.position)
                              .map((itemChild, index) => {
                                return (
                                  <li
                                    key={index}
                                    onClick={() =>
                                      handleSelectedMenuItem(handleHyperlinkValue(item?.hyperlinkOption, item?.url))
                                    }
                                  >
                                    <StyledSubMenuItem>
                                      <a
                                        href={`${handleHyperlinkValue(itemChild?.hyperlinkOption, itemChild?.url)}`}
                                        id={`subMenuHover-${itemChild?.id}`}
                                        className="subMenuHover"
                                        style={{
                                          borderRadius: "12px",
                                          backgroundColor:
                                            selectedSubMenuId === itemChild?.id
                                              ? groupColorConfig?.buttonBackgroundColor
                                              : "#FFFFFF",
                                        }}
                                        onClick={() => handleSubMenuClick(itemChild?.id)}
                                        onMouseEnter={() => handleSubMenuEnter(itemChild?.id)}
                                        onMouseLeave={() => handleSubMenuLeave(itemChild?.id)}
                                      >
                                        <img alt="menu_point" className="menu_point" src={menuPointUrl} />
                                        <div
                                          style={
                                            selectedSubMenuId === itemChild?.id
                                              ? {
                                                  color: groupColorConfig?.buttonTextColor,
                                                  opacity: 0.8,
                                                }
                                              : { color: "#282828", opacity: 1 }
                                          }
                                          className="child-menu-item-header"
                                        >
                                          {truncateText(t(itemChild?.name), 20)}
                                        </div>
                                      </a>
                                    </StyledSubMenuItem>
                                  </li>
                                );
                              })}
                          </div>
                        </ul>
                      </li>
                    );
                  } else {
                    return (
                      <li
                        key={index}
                        className="custom-menu-header-item menu-header-trigger"
                        onClick={() => handleSelectedMenuItem(handleHyperlinkValue(item?.hyperlinkOption, item?.url))}
                      >
                        <a
                          onClick={() => handleClearSubMenuClick()}
                          href={`${handleHyperlinkValue(item?.hyperlinkOption, item?.url)}`}
                        >
                          <div style={{ color: groupColorConfig?.titleColor }} className={selectedMenuItemClassName}>
                            {truncateText(t(item?.name), 20)}
                          </div>
                        </a>
                      </li>
                    );
                  }
                }
              })}

              {__menus?.length >= maxMenuSupport && moreMenuItems?.length > 0 && (
                <>
                  <li key="999" style={{ marginLeft: "-12px", position: "relative" }}>
                    <a href="#!" onMouseEnter={() => handleItemMenu(999)} onMouseLeave={() => handleItemMenu(999)}>
                      <div style={{ color: groupColorConfig?.titleColor }}>
                        <StyledMenuItems>
                          <span className="view-more-icon">
                            <HeaderViewMoreMenuIcon />
                          </span>
                        </StyledMenuItems>
                      </div>
                    </a>
                    <ul className="nav-dropdown nav-dropdown-header-theme2">
                      <div className="scroll-border-radius">
                        {moreMenuItems?.map((itemChild, index) => {
                          return (
                            <li
                              key={index}
                              onClick={() =>
                                handleSelectedMenuItem(handleHyperlinkValue(itemChild?.hyperlinkOption, itemChild?.url))
                              }
                              className="nav-menu-li-dropdown-children"
                              style={{ position: "relative" }}
                            >
                              <StyledSubMenuItem
                                className={`submenu-item-parent-them2 ${
                                  itemChild?.children?.length > 0 ? "sub-nav-menu-header-theme2-parent" : ""
                                }`}
                              >
                                <a
                                  href={`${handleHyperlinkValue(itemChild?.hyperlinkOption, itemChild?.url)}`}
                                  id={`subMenuHover-${itemChild?.id}`}
                                  className="subMenuHover"
                                  style={{
                                    borderRadius: "12px",
                                    backgroundColor:
                                      selectedSubMenuId === itemChild?.id
                                        ? groupColorConfig?.buttonBackgroundColor
                                        : "#FFFFFF",
                                  }}
                                  onClick={() => handleSubMenuClick(itemChild?.id)}
                                  onMouseEnter={() => handleSubMenuEnter(itemChild?.id)}
                                  onMouseLeave={() => handleSubMenuLeave(itemChild?.id)}
                                >
                                  <img alt="menu_point" className="menu_point" src={menuPointUrl} />
                                  <div
                                    style={
                                      selectedSubMenuId === itemChild?.id
                                        ? {
                                            color: groupColorConfig?.buttonTextColor,
                                            opacity: 0.8,
                                          }
                                        : { color: "#282828", opacity: 1 }
                                    }
                                    className="sub-more-menu-items-theme2"
                                  >
                                    {truncateText(t(itemChild?.name), 20)}
                                  </div>
                                </a>
                              </StyledSubMenuItem>

                              {itemChild?.children?.length > 0 && (
                                <ul className="sub-nav-menu-header-theme2">
                                  {itemChild?.children
                                    ?.sort((a, b) => a.position - b.position)
                                    .map((itemChildSubMenu, index) => {
                                      return (
                                        <li
                                          key={index}
                                          onClick={() =>
                                            handleSelectedMenuItem(
                                              handleHyperlinkValue(
                                                itemChildSubMenu?.hyperlinkOption,
                                                itemChildSubMenu?.url,
                                              ),
                                            )
                                          }
                                        >
                                          <StyledSubMenuItem>
                                            <a
                                              href={`${handleHyperlinkValue(
                                                itemChildSubMenu?.hyperlinkOption,
                                                itemChildSubMenu?.url,
                                              )}`}
                                              id={`subMenuHover-${itemChildSubMenu?.id}`}
                                              className="subMenuHover"
                                              style={{
                                                borderRadius: "12px",
                                                backgroundColor:
                                                  selectedSubMenuId === itemChildSubMenu?.id
                                                    ? groupColorConfig?.buttonBackgroundColor
                                                    : "#FFFFFF",
                                              }}
                                              onClick={() => handleSubMenuClick(itemChildSubMenu?.id)}
                                              onMouseEnter={() => handleSubMenuEnter(itemChildSubMenu?.id)}
                                              onMouseLeave={() => handleSubMenuLeave(itemChildSubMenu?.id)}
                                            >
                                              <img alt="menu_point" className="menu_point" src={menuPointUrl} />
                                              <div
                                                style={
                                                  selectedSubMenuId === itemChildSubMenu?.id
                                                    ? {
                                                        color: groupColorConfig?.buttonTextColor,
                                                        opacity: 0.8,
                                                      }
                                                    : { color: "#282828", opacity: 1 }
                                                }
                                                className="child-menu-item-header"
                                              >
                                                {truncateText(t(itemChildSubMenu?.name), 20)}
                                              </div>
                                            </a>
                                          </StyledSubMenuItem>
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
          </nav>
          <div className="nav-top-right">
            {!isMaxWidth600 && !isDevicesTablet && (
              <StyledDeliveryAddressSelector>
                <DeliveryAddressSelectorComponent groupColorConfig={groupColorConfig} isCustomize={isCustomize} />
              </StyledDeliveryAddressSelector>
            )}

            {!isMaxWidth640 && (
              <div
                className={`header-language ${
                  isCustomize ? "header-language-customize-theme2" : "header-language-theme2"
                }`}
              >
                <StyledLanguage>
                  <ChangeLanguageDesktop fontFamily={fontFamily} overlayClassName="change-language-header-theme2" />
                </StyledLanguage>
              </div>
            )}

            <Popover
              placement="bottom"
              showArrow={false}
              trigger="click"
              content={
                <StyledPopoverLoginHeader>
                  {isLogin ? (
                    renderUserIcon
                  ) : (
                    <LoginPopover isAllowReserveTable={isAllowReserveTable} groupColorConfig={groupColorConfig ?? {}} />
                  )}
                </StyledPopoverLoginHeader>
              }
              getPopupContainer={(trigger) => trigger.parentElement}
              overlayClassName="popover-header-theme2"
            >
              <a className="user-icon" href>
                <Badge color="#ffffff" style={{ color: "#000000" }}>
                  <div className="userNameLogin">
                    <StyledIconStroke>
                      <span className="icon-stroke-color">
                        <UserIconUrl alt="cart-icon"></UserIconUrl>
                      </span>
                    </StyledIconStroke>
                  </div>
                </Badge>
              </a>
            </Popover>

            <CartComponent
              className="cart-header-theme-2-popover"
              groupColorConfig={groupColorConfig}
              content={(_props) => {
                const { open } = _props;
                return (
                  <ShoppingCartPage
                    open={open}
                    changeVisiblePopover={changeVisiblePopover}
                    isDefault={isDefault}
                    stateConfig={stateConfig}
                    isCalculate={isCalculate}
                    setIsCalculate={setIsCalculate}
                    isRefresh={isRefreshShowCart}
                  />
                );
              }}
            />
          </div>
        </div>
      </div>

      {!isCustomize && isMaxWidth600 && (
        <div
          className={`delivery-address-selector-mobile-mode ${
            headerConfig?.scrollType !== ScrollHeaderType.FIXED
              ? "scroll-header-delivery-theme2"
              : "fixed-header-delivery-theme2"
          }`}
          style={{
            background:
              headerConfig?.backgroundType === 1
                ? headerConfig?.backgroundColor
                : "url(" + headerConfig?.backgroundImage + ") no-repeat top",
          }}
          id="header-mobile-theme2"
        >
          <StyledDeliveryAddressSelector>
            <DeliveryAddressSelectorComponent groupColorConfig={groupColorConfig} isCustomize={isCustomize} />
          </StyledDeliveryAddressSelector>
        </div>
      )}
    </div>
  );
}
