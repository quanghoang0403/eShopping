import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import SwiperCore, { Autoplay, EffectCoverflow, FreeMode, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import { Swiper, SwiperSlide } from "swiper/react";
import { Platform } from "../../constants/platform.constants";
import productDataService from "../../data-services/product-data.service";
import { formatTextNumber, roundNumber } from "../../utils/helpers";
import { getStorage } from "../../utils/localStorage.helpers";
import ImgDefault from "../assets/icons/img_default.png";
import ProductDefault1 from "../assets/images/hibiscus-vanilla.png";
import ProductDefault2 from "../assets/images/pho_mai_tuyet_hoa_hong.png";
import ProductDefault from "../assets/images/product-default.png";
import ProductDefault4 from "../assets/images/tra_atiso_do_hat_boba.png";
import ProductDefault5 from "../assets/images/tra_dua_nhiet_doi.png";
import ProductDefault3 from "../assets/images/tra_vai.png";
import { theme1ElementCustomize } from "../constants/store-web-page.constants";
import { bestSellingProductDefault } from "../pages/home/default-data";
import "./best-selling-product.component.scss";
import FnbDisplayImageComponent from "./fnb-display-image/fnb-display-image.component";

SwiperCore.use([EffectCoverflow]);

export function BestSellingProduct(props) {
  const ProductDefaultUrl = [
    ProductDefault1,
    ProductDefault2,
    ProductDefault3,
    ProductDefault4,
    ProductDefault5,
    ProductDefault2,
    ProductDefault4,
  ];
  const [t] = useTranslation();
  const translatedData = {
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    bookNow: t("storeWebPage.productDetailPage.bookNow", "Order now"),
  };
  const { clickToFocusCustomize, config, general } = props;
  const currentConfig = config?.bestSellingProduct;
  const path = props?.path ?? "";
  const isSmallScreen = useMediaQuery({ query: "(max-width: 575px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 576px) and (max-width: 1199px)" });
  let settings = {};
  let min_loop_quantity = 2;
  if (isSmallScreen) {
    settings = {
      slidesPerView: "auto",
      spaceBetween: 16,
    };
  } else if (isMediumScreen) {
    min_loop_quantity = 4;
    settings = {
      slidesPerView: "auto",
      spaceBetween: 32,
    };
  } else {
    min_loop_quantity = 5;
    settings = {
      slidesPerView: 5,
    };
  }

  const StyledMain = styled.div`
    padding: 16px;
    background: ${currentConfig?.generalCustomization?.backgroundType === 1
      ? currentConfig?.generalCustomization?.backgroundColor
      : "url(" + currentConfig?.generalCustomization?.backgroundImage + ") repeat-y top"};
    background-size: 100%;
  `;
  const colorGroup = general?.color?.colorGroups?.find(
    (g) => g.id === currentConfig?.generalCustomization?.colorGroupId,
  );
  const StyledTitleProductList = styled.h2`
    color: ${colorGroup?.titleColor};
  `;
  const StyledCardProductList = styled.div`
    .product-price {
      color: ${colorGroup?.titleColor};
    }
    .product-name {
      color: ${colorGroup?.textColor + " !important"};
    }
  `;
  const reduxState = useSelector((state) => state);
  const [products, setProducts] = useState([]);
  const branchAddress = useSelector((state) => state?.session?.deliveryAddress?.branchAddress);

  useEffect(() => {
    let timeoutId;
    const callFetchData = () => {
      fetchData();
    };
    timeoutId = setTimeout(() => {
      callFetchData();
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [branchAddress?.id]);

  const fetchData = () => {
    // get default data
    if (!currentConfig?.isCheckAllProduct && currentConfig?.bestSellingProductIds?.length === 0) {
      setProducts([]);
      if (!reduxState?.session?.themeConfig?.storeThemeId) {
        setProducts(mappingToData(bestSellingProductDefault));
      }
    }
    getProducts();
  };

  const getProducts = async () => {
    const platformId = window?.isStoreAppWebView ? Platform.StoreMobileApp : Platform.StoreWebsite;
    const configCustomize = JSON.parse(getStorage("config"));
    let values = {
      storeThemeId: reduxState?.session?.themeConfig?.storeThemeId,
      productIds: currentConfig?.bestSellingProductIds,
      isCheckAllProduct: currentConfig?.isCheckAllProduct,
      branchId: branchAddress?.id,
      isCustomize: configCustomize?.customizeTheme ?? false,
      platformId: platformId,
    };

    const listProduct = await productDataService.getAllProductByStoreThemeIdAsync(values);
    if (listProduct?.data?.products.length > 0) {
      let productModel = mappingToData(listProduct?.data?.products);
      setProducts(productModel);
    }
  };

  const mappingToData = (products) => {
    return products?.map((item) => {
      const productPrice = item?.productPrices[0]?.priceValue;
      return {
        ...item,
        thumbnail:
          item?.thumbnail === "" || item?.thumbnail === undefined ? ProductDefault : item?.thumbnail ?? ProductDefault,
        price: productPrice,
      };
    });
  };

  return (
    <div id="themeBestSellingProduct">
      <StyledMain
        onClick={() => {
          if (clickToFocusCustomize) clickToFocusCustomize(theme1ElementCustomize.BestSellingProduct);
        }}
        hidden={!currentConfig?.visible}
        className="theme-best-selling-product-theme1"
      >
        <div className="main-session">
          <StyledTitleProductList className="title-best-selling-product-list">
            {currentConfig?.title}
          </StyledTitleProductList>
          <Swiper
            {...settings}
            loop={products?.length > min_loop_quantity}
            speed={500}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            freeMode={true}
            modules={[FreeMode, Navigation, Autoplay]}
            lazy={true}
            scrollbar={{
              el: ".swiper-scrollbar",
              draggable: true,
            }}
            className="product-list-theme-1"
          >
            <div className="swiper-wrapper">
              {products?.map((item, index) => {
                let imgProduct = new Image();
                const priceName = item?.productPrices?.[0].priceName;
                imgProduct.src = item?.thumbnail;
                const defaultProductPrice = item?.productPrices[0];
                return (
                  <SwiperSlide key={index} className="swiper-slide-bestselling-theme1">
                    <StyledCardProductList className="product-card product-card-bestselling-theme1" key={index}>
                      <a href={`${path}/product-detail/${item.id}`} className="product-image-cover">
                        <div
                          src={item?.thumbnail}
                          className={`product-image ${
                            imgProduct.width === imgProduct.height
                              ? "fitSizeImg"
                              : imgProduct.width > imgProduct.height
                              ? "horizontalImg"
                              : "verticalImg"
                          }  ${item?.isFlashSale ? "flash-sale-border" : ""}`}
                          style={{
                            backgroundImage: "url('" + item?.thumbnail + "')",
                          }}
                        >
                          <FnbDisplayImageComponent
                            src={
                              item?.thumbnail == null || item?.thumbnail.trim() === "" ? ImgDefault : item?.thumbnail
                            }
                            isOutOfStock={item?.isOutOfStock}
                            outOfStock={translatedData.outOfStock}
                            isFlashSale={item?.isFlashSale}
                            flashSaleDiscountPercent={formatTextNumber(
                              roundNumber(100 - (item?.price / (item?.price + item?.discountValue)) * 100, 0),
                            )}
                            bestSellingProduct={
                              !reduxState?.session?.themeConfig?.storeThemeId && ProductDefaultUrl[index]
                            }
                            isPromotion={defaultProductPrice?.isApplyPromotion && !defaultProductPrice?.isFlashSale}
                            promotionTitle={defaultProductPrice?.promotionTag}
                            isBestSellingProduct={item?.isFlashSale && defaultProductPrice?.flashSaleId}
                          />
                        </div>
                      </a>

                      <div className="best-selling-theme1">
                        <a href={`${path}/product-detail/${item.id}`} style={{ textDecoration: "none" }}>
                          <div className="product-name">{priceName ? `${item?.name} (${priceName})` : item?.name}</div>
                        </a>

                        <div className="product-price">
                          <span>{formatTextNumber(defaultProductPrice?.priceValue)}đ</span>
                          {(defaultProductPrice?.isApplyPromotion || defaultProductPrice?.flashSaleId) &&
                            !isSmallScreen && (
                              <span className="discount-price">
                                {formatTextNumber(defaultProductPrice?.originalPrice)}đ
                              </span>
                            )}
                        </div>

                        {!isSmallScreen && !isMediumScreen && (
                          <a
                            href={`${path}/product-detail/${item.id}`}
                            style={{ textDecoration: "none", color: "#FFF" }}
                          >
                            <div
                              className="btn-order-now"
                              style={{ backgroundColor: colorGroup?.buttonBackgroundColor }}
                            >
                              <span>{translatedData.bookNow}</span>
                            </div>
                          </a>
                        )}
                      </div>
                    </StyledCardProductList>
                  </SwiperSlide>
                );
              })}
            </div>
          </Swiper>
        </div>
      </StyledMain>
    </div>
  );
}
