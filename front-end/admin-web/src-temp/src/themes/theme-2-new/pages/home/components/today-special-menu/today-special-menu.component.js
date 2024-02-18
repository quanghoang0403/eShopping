import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import productDataService from "../../../../../data-services/product-data.service";
import { getStorage } from "../../../../../utils/localStorage.helpers";
import "../../../../assets/css/home-page.style.scss";
import arrowLeftUrl from "../../../../assets/images/back-arrow-left.png";
import arrowRightUrl from "../../../../assets/images/back-arrow-right.png";
import menuSpecialBgImgUrl from "../../../../assets/images/menu_special_bg.png";
import {
  backgroundTypeEnum,
  theme2ElementCustomize,
  theme2ElementRightId,
} from "../../../../constants/store-web-page.constants";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Button, Popover } from "antd";
import ReactDOMServer from "react-dom/server";
import { useTranslation } from "react-i18next";
import { Navigation, Pagination } from "swiper";
import { EnumAddToCartType, EnumFlashSaleResponseCode } from "../../../../../constants/enums";
import { Platform } from "../../../../../constants/platform.constants";
import productComboAddToCartServices from "../../../../../services/product-combo-add-to-cart.services";
import { LockMultipleCalls } from "../../../../../services/promotion.services";
import { getLabelPromotion } from "../../../../../utils/helpers";
import { ArrowDownIcon } from "../../../../assets/icons.constants";
import NotificationDialog from "../../../../components/notification-dialog/notification-dialog.component";
import ProductItem from "../../../../components/product-item";
import { categoryMenuDefault, todayMenuDefault } from "./default-data";
import SlideDotActiveTodayMenuIcon from "./slide-dot-active.component";
import "./today-special-menu.style.scss";

export default function TodaySpecialMenu(props) {
  const { config, general, clickToFocusCustomize, isDefault } = props;
  const todayMenu = config?.todayMenu;
  const generalCustomization = todayMenu?.generalCustomization;
  const colorGeneral = general?.color?.colorGroups?.find((c) => c.id === generalCustomization?.colorGroupId);
  const platformId = window?.isStoreAppWebView ? Platform.StoreMobileApp : Platform.StoreWebsite;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState("");

  const configCustomize = JSON.parse(getStorage("config"));
  const menuRef = useRef(null);
  const swiperRef = useRef(null);
  const [hiddenItems, setHiddenItems] = useState([]);
  const isMockup = Boolean(clickToFocusCustomize) || Boolean(isDefault);
  const [isShowNotifyFlashSaleDialog, setIsShowNotifyFlashSaleDialog] = useState(false);
  const [flashSaleProduct, setFlashSaleProduct] = useState(null);
  const [minHeightSwiper, setMinHeightSwiper] = useState(null);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const translatedData = {
    okay: t("storeWebPage.generalUse.okay"),
    notification: t("storeWebPage.generalUse.notification"),
    flashSaleEndNotification: t("storeWebPage.flashSale.flashSaleEndNotification"),
  };

  useEffect(() => {
    let totalWidth = 0;
    let totalMaxWidth = menuRef.current.offsetWidth - 60;
    if (window.matchMedia("(min-width: 1200px)").matches) {
      totalMaxWidth = 1140;
    }
    const hidden = [];
    menuRef.current.childNodes.forEach((item, index) => {
      totalWidth += item.offsetWidth;
      if (totalWidth >= totalMaxWidth) {
        const itemId = item.getAttribute("id");
        if (itemId) {
          hidden.push(itemId);
          totalWidth -= item.offsetWidth;
        }
      }
    });
    if (hidden.length > 0) {
      setHiddenItems(hidden);
    }
    const offsetHeight = document.getElementById("today-special-menu-swiper").offsetHeight;
    setMinHeightSwiper(offsetHeight);
  }, [categories]);

  let settings = {};
  if (window.matchMedia("(max-width: 575px)").matches) {
    settings = {
      slidesPerView: "auto",
      spaceBetween: 12,
      navigation: false,
    };
  } else if (window.matchMedia("(max-width: 1200px)").matches) {
    settings = {
      slidesPerView: "auto",
      spaceBetween: 40,
      navigation: false,
    };
  } else {
    settings = {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 36,
      navigation: true,
    };
  }
  const branchAddress = useSelector((state) => state?.session?.deliveryAddress?.branchAddress);
  const reduxState = useSelector((state) => state);
  useEffect(() => {
    getDataProductsAndCategories(todayMenu?.productCategoryIds, todayMenu?.isCheckAllCategory);
  }, [todayMenu?.productCategoryIds, todayMenu?.isCheckAllCategory, branchAddress?.id]);

  const getDataProductsAndCategories = async (values, isCheckAllCategory) => {
    if (!reduxState?.session?.themeConfig?.storeThemeId) {
      setCategories(categoryMenuDefault);
      setProducts(todayMenuDefault);
    } else {
      if (values || isCheckAllCategory) {
        ///Get product categories
        LockMultipleCalls(async () => {
          const productCategoryResponse = await productDataService.getProductCategoriesStoreTheme(
            isMockup ? "" : branchAddress?.id, //customize or preview page: load all products in config
          );
          if (productCategoryResponse) {
            let categorySelected = productCategoryResponse?.data?.productCategories;
            if (!isCheckAllCategory || isCheckAllCategory === false) {
              categorySelected = categorySelected?.filter((b) => values.find((v) => v === b.id));
            }
            setCategories(categorySelected);
          }
        }, "Lock_getDataProductsAndCategories");

        ///Get products
        if (values && values.length > 0) {
          getDataProductsByCategoryId(values, isCheckAllCategory);
        } else {
          // auto get product when isCheckAllCategory is set to false and the selected category is 0.
          getDataProductsByCategoryId(values, true);
        }
      }
    }
  };

  const getDataProductsByCategoryId = async (values, isCheckAllCategory) => {
    const productResponse = await productDataService.getProductsByCategoryIdsAsync(
      values,
      "",
      isCheckAllCategory,
      platformId,
      isMockup ? "" : branchAddress?.id, //customize or preview page: load all products in config
    );
    if (productResponse) {
      setProducts(productResponse?.data?.productsByCategoryId);
    } else {
      setProducts([]);
    }
  };

  const onClickScrollLeft = () => {
    if (configCustomize?.customizeTheme) {
      clickToFocusCustomize(theme2ElementCustomize.TodayMenu);
    }
  };
  const onClickProductDetailUrl = (url) => {
    document.location.href = url;
  };
  const handleLeftArrow = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const handleRightArrow = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // Load all products in Menu special in the first render
  useEffect(() => {
    if (products?.length == 0) {
      const getProductAsync = async () => {
        const productResponse = await productDataService.getProductsByCategoryIdsAsync(
          "",
          "",
          true,
          platformId,
          isMockup ? "" : branchAddress?.id, //customize or preview page: load all products in config
        );

        if (productResponse) {
          setProducts(productResponse?.data?.productsByCategoryId);
        }
      };
      getProductAsync();
    }
  }, []);

  const getProductsByCategoryId = async (event, id, isCheckAllCategory) => {
    setActiveMenu(id);
    const ulElement = event.target.closest(".menu-special-ul");

    const allLinks = ulElement.querySelectorAll("a");

    allLinks.forEach((link) => {
      if (link !== event.target) {
        link.classList.remove("active");
      }
    });

    event.target.classList.toggle("active");
    ///Get products
    const productResponse = await productDataService.getProductsByCategoryIdsAsync(
      [id],
      "",
      isCheckAllCategory,
      platformId,
      isMockup ? "" : branchAddress?.id, //customize or preview page: load all products in config
    );
    if (productResponse) {
      setProducts(productResponse?.data?.productsByCategoryId);
    }
  };

  function truncateText(text) {
    var truncated = text.length > 50 ? text.substring(0, 50) + "..." : text;
    return truncated;
  }

  const quickAddToCart = async (data) => {
    let requestData = {
      id: data?.id,
      productPriceId: data?.productPrices[0]?.id,
      isFlashSale: data?.isFlashSale,
      flashSaleId: data?.flashSaleId,
    };
    productComboAddToCartServices.quickAddToCart(
      requestData,
      EnumAddToCartType.Product,
      branchAddress?.id,
      null,
      (allAreApplicable, responseCode, product) => checkFlashSaleApplicable(allAreApplicable, responseCode, product),
    );
  };

  const checkFlashSaleApplicable = (allAreApplicable, responseCode, product) => {
    if (allAreApplicable) {
      updateCartToRedux(product);
    } else {
      if (responseCode === EnumFlashSaleResponseCode.Inactive) {
        setIsShowNotifyFlashSaleDialog(true);
        setFlashSaleProduct(product);
      } else {
        updateCartToRedux(product);
      }
    }
  };

  const handleConfirmNotify = () => {
    if (flashSaleProduct) {
      updateCartToRedux();
      setIsShowNotifyFlashSaleDialog(false);
      window.location.reload();
    }
  };

  const updateCartToRedux = (product) => {
    const currentProduct = product ?? flashSaleProduct;
    productComboAddToCartServices.updateCartInLocalAndRedux(
      productComboAddToCartServices.mappingToProductLocal(currentProduct),
      false,
    );
  };

  return (
    //remove onClick={onClickScrollLeft} because it overlays all click events in the component
    <div id={theme2ElementRightId.TodayMenu}>
      <div
        style={{
          background:
            generalCustomization?.backgroundType === backgroundTypeEnum.Color
              ? generalCustomization?.backgroundColor
              : "url(" +
                (generalCustomization?.backgroundImage ? generalCustomization?.backgroundImage : menuSpecialBgImgUrl) +
                ") center",
        }}
        className={`menu-special ${!todayMenu?.visible && "d-none"}`}
      >
        <div className="page-container">
          <div className="menu-special-intro h3" style={{ color: colorGeneral?.textColor }}>
            {todayMenu?.headerText ? todayMenu?.headerText : "MENU SPECIAL"}
          </div>
          <div className="menu-special-title">
            <div style={{ color: colorGeneral?.titleColor }}>
              {todayMenu?.titleText ? todayMenu?.titleText : "Today's Special Menu"}
            </div>
          </div>
          <div className="menu-special-nav" style={{ position: "relative" }}>
            <ul className="menu-special-ul" ref={menuRef}>
              <li>
                <a
                  href
                  className="active"
                  style={
                    activeMenu === ""
                      ? {
                          color: colorGeneral?.buttonTextColor,
                          backgroundColor: colorGeneral?.buttonBackgroundColor,
                          minWidth: "124px",
                        }
                      : { color: colorGeneral?.textColor }
                  }
                  onClick={(event) => getProductsByCategoryId(event, "", true)}
                >
                  TẤT CẢ
                </a>
              </li>
              {categories?.map((item, index) => {
                return (
                  !hiddenItems?.includes(item.id) && (
                    <li key={index} id={item.id}>
                      <a
                        href
                        style={
                          activeMenu === item.id
                            ? {
                                color: colorGeneral?.buttonTextColor,
                                backgroundColor: colorGeneral?.buttonBackgroundColor,
                              }
                            : { color: colorGeneral?.textColor }
                        }
                        onClick={(event) => getProductsByCategoryId(event, item.id, false)}
                      >
                        {truncateText(item.name)}
                      </a>
                    </li>
                  )
                );
              })}
              <li
                style={{
                  width: "60px",
                  height: "60px",
                  visibility: categories?.some((item) => hiddenItems?.includes(item.id)) ? "visible" : "hidden",
                }}
              >
                <a>
                  <Popover
                    placement="bottom"
                    showArrow={false}
                    trigger="click"
                    content={
                      <>
                        <ul className="popover-dropdown-menu-today-menu">
                          {categories?.map((item, index) => {
                            return (
                              hiddenItems?.includes(item.id) && (
                                <li key={index} id={item.id} style={{ display: "grid" }}>
                                  <a
                                    href
                                    style={
                                      activeMenu === item.id
                                        ? {
                                            color: colorGeneral?.buttonTextColor,
                                            backgroundColor: colorGeneral?.buttonBackgroundColor,
                                          }
                                        : { color: colorGeneral?.textColor }
                                    }
                                    onClick={(event) => getProductsByCategoryId(event, item.id, false)}
                                  >
                                    {truncateText(item.name)}
                                  </a>
                                </li>
                              )
                            );
                          })}
                        </ul>
                      </>
                    }
                    getPopupContainer={(trigger) => trigger.parentElement}
                    overlayClassName="overlay-menu-special-theme2"
                  >
                    <ArrowDownIcon style={{ position: "relative", top: "5px" }} />
                  </Popover>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="banner-menu-special banner-menu-special-swiper page-container"
          id="today-special-menu-swiper"
          style={{ minHeight: minHeightSwiper }}
        >
          <Swiper
            {...settings}
            grabCursor={true}
            loop={false}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3,
              renderBullet: function (index, className) {
                const htmlString = ReactDOMServer.renderToString(
                  <SlideDotActiveTodayMenuIcon color={colorGeneral?.buttonBackgroundColor} />,
                );
                return `<span class="${className}">${htmlString}</span>`;
              },
            }}
            modules={[Pagination, Navigation]}
            ref={swiperRef}
          >
            {products?.map((p, index) => {
              let promotionTitle = null;
              const sellingPrice = p?.productPrices?.[0]?.priceValue;
              const originalPrice = p?.productPrices?.[0]?.originalPrice;
              if (p?.isHasPromotion || p?.isFlashSale) {
                promotionTitle = getLabelPromotion(
                  p?.isFlashSale,
                  p?.isDiscountPercent,
                  p?.discountValue,
                  p?.isHasPromotion,
                  originalPrice,
                  sellingPrice,
                );
              }
              let productItem = {
                id: p?.productId,
                name: p?.name,
                thumbnail: p?.thumbnail,
                sellingPrice: sellingPrice,
                originalPrice: originalPrice,
                description: p?.description,
                isFlashSale: p?.isFlashSale,
                flashSaleId: p?.flashSaleId,
                promotionTitle: promotionTitle,
                navigateTo: `/product-detail/${p?.productId}`,
                productPrices: p?.productPrices,
              };

              return (
                <SwiperSlide key={index}>
                  <ProductItem
                    product={productItem}
                    addProductToCart={() => quickAddToCart(productItem)}
                    key={index}
                    colorGroup={colorGeneral}
                    isCombo={false}
                    useIconAddtoCart={true}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <img
            alt=""
            hidden={products?.length === 0 && true}
            className="button-left-arrow"
            src={arrowLeftUrl}
            onClick={handleLeftArrow}
          />
          <img
            alt=""
            hidden={products?.length === 0 && true}
            className="button-right-arrow"
            src={arrowRightUrl}
            onClick={handleRightArrow}
          />
        </div>
      </div>

      {/* Product flash sale notify */}
      <NotificationDialog
        open={isShowNotifyFlashSaleDialog}
        title={translatedData.notification}
        onConfirm={handleConfirmNotify}
        confirmLoading={false}
        className="checkout-theme1-notify-dialog"
        content={translatedData.flashSaleEndNotification}
        footer={[<Button onClick={handleConfirmNotify}>{translatedData.okay}</Button>]}
        closable={true}
      />
    </div>
  );
}
