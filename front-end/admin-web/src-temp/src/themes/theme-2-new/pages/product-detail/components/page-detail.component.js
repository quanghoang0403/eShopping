import { Button, Col, Collapse, Image, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import comboDataService from "../../../../data-services/combo-data.service";
import productDataService from "../../../../data-services/product-data.service";
import { env } from "../../../../env";
import { setCartItems, setNotificationDialog } from "../../../../modules/session/session.actions";
import {
  setToastMessageAddToCart,
  setToastMessageMaxDiscount,
} from "../../../../modules/toast-message/toast-message.actions";
import maxDiscountService from "../../../../services/max-discount.services";
import productComboAddToCartServices from "../../../../services/product-combo-add-to-cart.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import {
  calculatePercentage,
  formatTextNumber,
  getLabelPromotion,
  mappingDiscountApplyToPromotionPopupData,
} from "../../../../utils/helpers";
import { BackToHistoryIcon, CheckoutIcon, NoChatContentIcon, ReviewIcon } from "../../../assets/icons.constants.js";
import productDetailHeaderDefault from "../../../assets/images/product-detail-header-default.png";
import productImageDefault from "../../../assets/images/product-img-default.png";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog.component";
import FnbFlashSaleBannerComponent from "../../../components/fnb-flash-sale-banner/fnb-flash-sale-banner.component";
import { MaximumLimitFlashSaleNotifyComponent } from "../../../components/maximum-limit-flash-sale-notify/maximum-limit-flash-sale-notify.component";
import ProductDetailDescriptionComponent from "../../../components/product-detail-description-component/product-detail-description.component";
import ProductDetailImagesComponent from "../../../components/product-detail-images-component/product-detail-images.component";
import { EnumPromotion } from "../../../constants/enum";
import { backgroundTypeEnum, comboTypeEnum, theme2ElementCustomize } from "../../../constants/store-web-page.constants";
import { maximumQuantity } from "../../../constants/string.constant";
import { productDetailDefault, productImagesDefault } from "../default-data";

import styled from "styled-components";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { EnumAddToCartType } from "../../../../constants/enums";
import { Platform } from "../../../../constants/platform.constants";
import orderDataService from "../../../../data-services/order-data.service";
import { checkOutOfStockWhenQuickAdd } from "../../../../services/material/check-out-of-stock.service";
import { getStorage, localStorageKeys } from "../../../../utils/localStorage.helpers";
import ChangeQuantityComponent, {
  changeQuantityComponentSize,
} from "../../../components/change-quantity/ChangeQuantityComponent";
import NameAndValuePopoverStoreWeb from "../../../components/name-and-value-popup-store-web/NameAndValuePopoverStoreWeb.jsx";
import NoteTextAreaComponent from "../../../components/note-text-area/NoteTextAreaComponent";
import OutOfStockLabelBoxComponent from "../../../components/out-of-stock-label-box/out-of-stock-label-box.component";
import ProductItem from "../../../components/product-item.js";
import RadioGroupTypeButtonComponent from "../../../components/radio-group_type-button/RadioGroupTypeButtonComponent";
import RadioGroupTypeRadioComponent from "../../../components/radio-group_type-radio/RadioGroupTypeRadioComponent";
import StarRatingComponent from "../../../components/star-rating/StarRatingComponent";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import "../index.style.scss";
import "./flash-sale.scss";
const { Panel } = Collapse;
const StyledProductDetailSection = styled.div`
  .related-products-container {
    .top-tile {
      color: ${(props) => props?.color?.titleColor} !important;
    }
    .middle-content-product-detail {
      .product-name {
        color: ${(props) => props?.color?.textColor} !important;
      }
    }
  }
  .btn-add-to-cart-text {
    svg {
      path {
        fill: ${(props) => props?.color?.buttonTextColor};
      }
    }
  }
  .group-product-option-item {
    .option-level-value .ant-radio-button-wrapper-checked {
      color: ${(props) => props?.color?.buttonTextColor} !important;
    }
    .ant-radio-button-checked {
      .ant-radio-button-input::after {
        background: ${(props) => props?.color?.buttonTextColor} !important;
      }
      background-color: ${(props) => props?.color?.buttonBackgroundColor} !important;
      border: 1px solid ${(props) => props?.color?.buttonBorderColor} !important;
      span {
        color: ${(props) => props?.color?.buttonTextColor} !important;
      }
    }
  }
  .product-price-btn-increase {
    background: ${(props) => props?.color?.buttonBackgroundColor} !important;
    color: ${(props) => props?.color?.buttonBackgroundColor} !important;
    svg {
      rect {
        fill: ${(props) => props?.color?.buttonBackgroundColor};
      }
      path {
        stroke: ${(props) => props?.color?.buttonTextColor};
      }
    }
  }
  .product-price-btn-decrease {
    background: ${(props) => props?.color?.buttonBackgroundColor} !important;
    color: ${(props) => props?.color?.buttonBackgroundColor} !important;
    svg {
      rect {
        fill: ${(props) => props?.color?.buttonBackgroundColor};
      }
      path {
        stroke: ${(props) => props?.color?.buttonTextColor};
      }
    }
  }
  .group-multiple-price-item {
    .ant-radio-inner {
      border: 1px solid ${(props) => props?.color.buttonBackgroundColor} !important;
      color: ${(props) => props?.color.buttonBackgroundColor};
    }
    .ant-radio-inner::after {
      background-color: ${(props) => props?.color.buttonBackgroundColor} !important;
    }
  }
  .group-product-topping-item {
    .topping-quantity-btn-increase {
      background: ${(props) => props?.color?.buttonBackgroundColor} !important;
      color: ${(props) => props?.color?.buttonBackgroundColor} !important;
      svg {
        rect {
          fill: ${(props) => props?.color?.buttonBackgroundColor};
        }
        path {
          stroke: ${(props) => props?.color?.buttonTextColor};
        }
      }
    }
  }

  .btn-increase {
    color: ${(props) => props?.color?.buttonBackgroundColor} !important;
    svg {
      rect {
        fill: ${(props) => props?.color?.buttonBackgroundColor};
      }
      path {
        stroke: ${(props) => props?.color?.buttonTextColor};
      }
    }
  }
  .radio-group--type-button .ant-radio-wrapper-checked .radio-item {
    border-color: ${(props) => props?.color?.titleColor};
    .radio-content {
      .name,
      .value {
        color: ${(props) => props?.color?.titleColor};
      }
    }
  }
  .btn-add-to-cart {
    background: ${(props) => props?.color?.buttonBackgroundColor}!important;
    color: ${(props) => props?.color?.buttonTextColor}!important;
    &:hover {
      border-color: ${(props) => props?.color?.buttonBorderColor}!important;
    }
  }
  .radio-group--type-radio {
    .radio-item {
      .icon-selected {
        circle {
          stroke: ${(props) => props?.color?.buttonBackgroundColor};
          &:last-child {
            fill: ${(props) => props?.color?.buttonBackgroundColor};
          }
        }
      }
    }
  }
`;

export default function PageDetailComponent(props) {
  const [t] = useTranslation();
  const { config, general, isCustomize, isDefault, clickToFocusCustomize } = props;
  const { header, productDetail, relatedProducts } = config;
  const { productId, comboId, comboType } = useParams();
  const [styleBackgroundHeader, setStyleBackgroundHeader] = useState({});
  const [styleBackgroundBody, setStyleBackgroundBody] = useState({});
  const [styleBackgroundRelatedProduct, setStyleBackgroundRelatedProduct] = useState({});
  const [colorGroupHeader, setColorGroupHeader] = useState({});
  const [colorGroupBody, setColorGroupBody] = useState({});
  const [colorGroupRelatedProduct, setColorGroupRelatedProduct] = useState({});
  const [sizeSelected, setSizeSelected] = useState(null);
  const [reviewAmount, setReviewAmount] = useState(0);
  const [productDetailInformation, setProductDetailInformation] = useState({});
  const [productImageList, setProductImageList] = useState([]);
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(0);
  const [optionGroupSelected, setOptionGroupSelected] = useState([]);
  const [toppingGroupSelected, setToppingGroupSelected] = useState([]);
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [totalPriceTopping, setTotalPriceTopping] = useState(0);
  const [totalOriginalPriceTopping, setTotalOriginalPriceTopping] = useState(0);
  const [totalOriginalPriceProduct, setTotalOriginalPriceProduct] = useState(0);
  const [noteForProduct, setNoteForProduct] = useState(null);
  const [isDiscountPercent, setIsDiscountPercent] = useState(false);
  const [originalPriceDefault, setOriginalPriceDefault] = useState(0);
  const [priceAfterDiscountDefault, setPriceAfterDiscountDefault] = useState(0);
  const [thumbnail, setThumbnail] = useState([]);
  const [isCombo, setIsCombo] = useState(false);
  const [comboDetailInformationData, setComboDetailInformation] = useState();
  const [flashSaleEndTime, setFlashSaleEndTime] = useState(null);
  const [isShowFlashSaleInActive, setIsShowFlashSaleInActive] = useState(false);
  const [maximumLimitFlashSale, setMaximumLimitFlashSale] = useState(0);
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery({ query: "(max-width: 575px)" });
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const [isShowProductNotInBranchModal, setIsShowProductNotInBranchModal] = useState(false);
  const [productInBranch, setProductInBranch] = useState(true);
  const [similarProductList, setSimilarProductList] = useState([]);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [tempQuantityWhenAddToCart, setTempQuantityWhenAddToCart] = useState(1);
  const limitLengthPriceCSS = 1_000_000;

  const [promotionTag, setPromotionTag] = useState("");
  const [promotionsOfProductPriceApplied, setPromotionOfProductPriceApplied] = useState([]);

  const getPriceFormat = (number) => {
    let convertNumber = parseFloat(number);
    if (convertNumber >= 0) {
      return <>{formatTextNumber(Math.round(convertNumber))}đ</>;
    }
    return "0đ";
  };
  const checkPrice = (value) => {
    const checkNum = Number.isInteger(value);
    if (checkNum) {
      return value;
    } else {
      return value?.toFixed(2);
    }
  };
  const history = useHistory();

  const translateData = {
    btnAddToCart: t("storeWebPage.productDetailPage.addProductToCart"),
    notYetReview: t("storeWebPage.productDetailPage.notReview"),
    reviewTitle: t("storeWebPage.productDetailPage.reviewTitle"),
    notePlaceholder: t("storeWebPage.editOrderItem.noteAMessageForTheStore"),
    flashSaleInActive: t("promotion.flashSale.description.inactive"),
    notification: t("loginPage.notification"),
    okay: t("form.okay"),
    productNotInBranch: t("form.productNotInBranch"),
    selectOption: t("storeWebPage.editOrderItem.selectOption", "Select option"),
    selectSize: t("storeWebPage.editOrderItem.selectSize", "Select size"),
    selectTopping: t("storeWebPage.editOrderItem.selectTopping", "Select topping"),
    relatedProducts: t("storeWebPage.productDetailPage.relatedProducts", "Related products"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    iGotIt: t("loginPage.iGotIt", "I got it"),
  };

  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const branchAddressId = deliveryAddress?.branchAddress?.id ?? "";

  //#region Checkout of stock
  useEffect(() => {
    if (isCustomize || isDefault) return;
    if ((!isCombo && sizeSelected) || (isCombo && comboDetailInformationData)) {
      checkOutOfStock(sizeSelected, branchAddress?.id, quantityProduct, true, true);
    }
  }, [sizeSelected, comboDetailInformationData, branchAddressId]);

  async function checkOutOfStock(productPriceSelected, branchId, quantity, isInitData, isChangeSize) {
    let verifyOutOfStock = false;
    if (isCustomize || isDefault) return;
    if (isCombo) {
      if (comboDetailInformationData) {
        verifyOutOfStock = await checkOutOfStockWhenQuickAdd(true, branchId, comboDetailInformationData, quantity);
      }
    } else {
      verifyOutOfStock = await checkOutOfStockWhenQuickAdd(false, branchId, productPriceSelected, quantity);
    }

    if (verifyOutOfStock) {
      ///Check when init data or change the size
      if (isInitData) {
        setIsOutOfStock(true);
        if (quantity > 1) {
          if (!isChangeSize) {
            showNotificationOutOfStock();
          }
        }
      }
    } else {
      setIsOutOfStock(false);
    }
    return verifyOutOfStock;
  }

  function showNotificationOutOfStock() {
    const notificationDialog = {
      isShow: true,
      content: translateData.textOutOfStock,
      buttonText: translateData.iGotIt,
    };
    dispatch(setNotificationDialog(notificationDialog));
  }
  //#endregion

  const getSimilarProductList = useCallback(
    async (productCategoryId, isCombo) => {
      let similarList = [];
      if (isCombo) {
        const comboRelated = await comboDataService.getSimilarCombosByBranchIdAsync();
        let comboRelatedSelected = [];

        if (comboRelated?.data?.combos) {
          comboRelatedSelected = comboRelated.data.combos;
        }

        comboRelatedSelected.map((item, index) => {
          let combo = {
            ...item,
            percentValue: item?.percentValueOfComboProductPrice,
          };
          if (item?.comboTypeId === comboTypeEnum.comboPricing.id) {
            const comboPricingItem = item?.comboPricings[0];
            combo = {
              ...item,
              percentValue: comboPricingItem?.percentValueOfComboPricings,
              sellingPrice: comboPricingItem?.sellingPrice,
              originalPrice: comboPricingItem?.originalPrice,
              comboPricingId: comboPricingItem?.id,
            };
          }
          let comboItem = {
            ...combo,
            name: combo?.name,
            thumbnail: combo?.thumbnail,
            description: combo?.description,
            sellingPrice: combo?.sellingPrice,
            originalPrice: combo?.originalPrice,
            id: combo?.id,
            navigateTo:
              combo.comboTypeId === comboTypeEnum.comboPricing.id
                ? `/combo-detail/${comboTypeEnum.comboPricing.path}/${combo?.comboPricingId}`
                : `/combo-detail/${comboTypeEnum.comboProductPrice.path}/${combo?.id}`,
            comboTypeId: combo.comboTypeId,
            comboPricings: combo?.comboPricings,
            rate: index + 2,
            percentValue: combo?.percentValue,
          };

          similarList.push(comboItem);
        });
      } else {
        if (productId) {
          const similarProduct = await productDataService.getProductsStoreTheme(
            productCategoryId,
            branchAddress?.id,
            "",
            productId,
          );

          if (similarProduct) {
            similarProduct?.data?.products?.map((item, index) => {
              let productItem = {
                ...item,
                navigateTo: `/product-detail/${item?.id}`,
                rate: index + 2,
              };
              similarList.push(productItem);
            });
          }
        } else {
          similarList = productDetailDefault.similarProducts;
        }
      }

      setSimilarProductList(similarList);
    },
    [branchAddress?.id, productId],
  );

  const getProductDetailData = useCallback(async () => {
    let productDetailObj = {};
    let comboDetail = {};
    let thumbnailProduct = [];
    let isComboValue = false;
    let originalPrice = 0;
    let priceAfterDiscount = 0;
    let productPriceValue = 0;
    if (comboId) {
      isComboValue = true;
      if (comboType === comboTypeEnum.comboProductPrice.path) {
        // combo specific
        comboDetail = await comboDataService.getComboProductPriceByComboIdAsync(comboId);
      } else if (comboType === comboTypeEnum.comboPricing.path) {
        // combo flexible
        comboDetail = await comboDataService.getComboPricingByComboPricingIdAsync(comboId);
      }

      comboDetail = comboDetail?.data?.combo;
      comboDetail?.comboProductPrices?.map((item) => {
        originalPrice += item?.priceValue;
      });
      thumbnailProduct.push({ imageUrl: comboDetail?.thumbnail });
      priceAfterDiscount = comboDetail?.sellingPrice ?? originalPrice;
      productPriceValue = comboDetail?.sellingPrice ?? originalPrice;
      productDetailObj = comboDetail;
      setComboDetailInformation(comboDetail);
      getSimilarProductList(null, true);
    } else {
      let categoryId = null;
      if (productId) {
        try {
          const productDetailData = await productDataService.getProductDetailByIdAsync(
            productId,
            Platform.StoreWebsite,
            branchAddress?.id,
          );
          categoryId = productDetailData?.data?.productDetail?.productCategoryId;

          productDetailObj = {
            product: {
              ...productDetailData?.data,
            },
          };
          thumbnailProduct.push({
            imageUrl: productDetailObj?.product?.productDetail?.thumbnail,
          });
        } catch {
          history.push("/product-list");
        }
      } else {
        productDetailObj = productDetailDefault;
      }

      const defaultProductPriceIndex = productDetailObj?.product?.productDetail?.defaultProductPriceIndex;
      const productPrices = productDetailObj?.product?.productDetail?.productPrices;
      let productPriceSelected = productPrices[defaultProductPriceIndex]
        ? productPrices[defaultProductPriceIndex]
        : productPrices[0];

      originalPrice = productPriceSelected?.originalPrice;
      priceAfterDiscount = productPriceSelected?.priceValue;
      productPriceValue = productPriceSelected?.priceValue;
      setProductDetailInformation({ ...productDetailObj });
      setProductImageList(productImagesDefault);
      setSizeSelected(productPriceSelected?.id);
      setFlashSaleEndTime(productPriceSelected?.promotionEndTime ?? null);
      setIsDiscountPercent(productDetailObj?.product?.productDetail?.isDiscountPercent);
      setMaximumLimitFlashSale(productPriceSelected?.maximumLimit);
      getSimilarProductList(categoryId, false);

      setPromotionTag(productPriceSelected?.promotionTag);
      setPromotionOfProductPriceApplied(productPriceSelected?.promotions);
    }
    // Group the options for product. The optionGroupSelected variable will use a check when adding the product to cart
    getOptionGroupSelected(productDetailObj, isComboValue);
    // Group the topping for product. The toppingGroupSelected variable will use a check when adding the product to cart
    getToppingGroupSelected(productDetailObj, isComboValue);
    // Image of product or combo
    setThumbnail(thumbnailProduct);
    setIsCombo(isComboValue);
    setQuantityProduct(1);
    // The price of all toppings selected
    setTotalPriceTopping(0);
    setTotalOriginalPriceTopping(0);
    // The original price/price after discount of the product. This price is only structured once and does not reset the value
    setOriginalPriceDefault(originalPrice);
    setPriceAfterDiscountDefault(priceAfterDiscount);
    // The main price of the product.
    // This price will reset when the user handle add, edit or delete options of the current product
    setTotalPriceOfProduct(productPriceValue);
    setTotalOriginalPriceProduct(originalPrice);

    setNoteForProduct("");
  }, [branchAddress?.id, comboId, comboType, getSimilarProductList, productId]);

  const initBackgroundHeader = () => {
    let style = {};
    if (header?.backgroundType === backgroundTypeEnum.Color) {
      style = {
        backgroundColor: header?.backgroundColor,
      };
    } else {
      let imageUrl = header?.backgroundImage
        ? header?.backgroundImage
        : `${env.PUBLIC_URL}/assets/images/product-detail-header.png`;
      style = {
        backgroundImage: `url(${imageUrl})`,
      };
    }
    let colorGroup = general.color.colorGroups.find((a) => a.id === header?.colorGroupId);
    setColorGroupHeader({ ...colorGroup });
    setStyleBackgroundHeader({ ...style });
  };

  const initBackgroundBody = () => {
    let style = {};
    if (productDetail?.backgroundType === backgroundTypeEnum.Color) {
      style = {
        backgroundColor: productDetail?.backgroundColor,
      };
    } else {
      style = {
        backgroundImage: `url(${productDetail?.backgroundImage})`,
        backgroundRepeat: `no-repeat !important`,
        backgroundPosition: `center !important`,
        backgroundSize: `100% 100% !important`,
        backgroundAttachment: "initial !important",
      };
    }
    let colorGroup = general.color.colorGroups.find((a) => a.id === productDetail?.colorGroupId);

    setColorGroupBody({ ...colorGroup });
    setStyleBackgroundBody({
      ...style,
      width: productId || comboId ? "calc(100vw - 50%)" : "100%",
    });
  };
  const detailBackgroundStyle =
    productDetail?.backgroundType === backgroundTypeEnum.Color
      ? {
          background: productDetail?.backgroundColor,
        }
      : {
          backgroundImage: "url(" + productDetail?.backgroundImage + ")",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        };
  const initBackgroundRelatedProduct = () => {
    let style = {};
    if (relatedProducts?.backgroundType === backgroundTypeEnum.Color) {
      style = {
        backgroundColor: relatedProducts?.backgroundColor,
      };
    } else {
      style = {
        backgroundImage: `url(${relatedProducts?.backgroundImage})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `cover`,
      };
    }
    let colorGroup = general.color.colorGroups.find((a) => a.id === relatedProducts?.colorGroupId);
    setColorGroupRelatedProduct({ ...colorGroup });
    setStyleBackgroundRelatedProduct({ ...style });
  };

  useEffect(() => {
    if (Boolean(isDefault) || isCustomize) {
      getProductDetailData();
    }
  }, []);

  useEffect(() => {
    initBackgroundHeader();
  }, [header]);

  useEffect(() => {
    initBackgroundBody();
  }, [productDetail]);

  useEffect(() => {
    initBackgroundRelatedProduct();
  }, [relatedProducts]);

  useEffect(() => {
    if (isCustomize || isDefault) return; //still call when do not inputting customer delivery address
    getProductDetailData();
    if (!branchAddress?.id) return;

    const handleCheckProductInBranch = async () => {
      const checkProductInBranch = await productDataService.checkProductInBranchAsync(productId, branchAddress?.id);
      if (checkProductInBranch?.data?.success === false) {
        setIsShowProductNotInBranchModal(true);
        setProductInBranch(false);
        return history.push("/product-list");
      } else {
        setProductInBranch(true);
        return () => {
          window.scrollTo(0, 0);
        };
      }
    };
    handleCheckProductInBranch();
  }, [branchAddress?.id, isCustomize, isDefault, productId, comboId, branchAddress, getProductDetailData]);

  useEffect(() => {
    getPriceToppingProductFlashSale(productDetailInformation);
  }, [sizeSelected, productDetailInformation]);

  /// Handle caculateTotalOfAmountHaveMaximumLimit
  const calculateTotalOfAmountHaveMaximumLimit = async (quantityHaveFlashSale, quantity, originalPrice, priceValue) => {
    const priceAfterMaximumLimit = await calculateAmountAfterMaximumLimit(quantity - quantityHaveFlashSale);
    setPromotionOfProductPriceApplied(priceAfterMaximumLimit?.promotions);
    const flashSaleTotal = quantityHaveFlashSale * priceValue;
    const totalAmount = flashSaleTotal + (priceAfterMaximumLimit?.sellingPrice || 0);
    return totalAmount;
  };

  const calculateAmountAfterMaximumLimit = async (quantity) => {
    const productPriceValue = productDetailInformation?.product?.productDetail?.productPrices.find(
      (a) => a.id === sizeSelected,
    );
    const productToppings = toppingGroupSelected.filter((a) => a.quantity >= 1) || [];
    const toppingsData = productToppings.map((item) => ({
      ...item,
      toppingId: item?.toppingId || item?.id,
      quantity: item?.quantity,
    }));
    const dataSubmit = {
      productId: productDetailInformation?.product?.productDetail?.id,
      productPriceId: productPriceValue?.id,
      productCategoryId: productDetailInformation?.product?.productDetail?.productCategoryId,
      isCombo: false,
      quantity: quantity,
      toppings: toppingsData,
      comboTypeId: "",
      comboPricingId: "",
      branchId: branchAddress?.id,
      isProductAfterMaximumLimit: true,
    };
    const dataResult = !isCustomize && (await productDataService.calculatingPriceOfTheProduct(dataSubmit));
    return dataResult?.data;
  };

  /// HandleCalculateTotalOfAmountHaveMaximumLimit
  const handleCalculateTotalOfAmountHaveMaximumLimit = async (
    productToppings,
    quantity,
    calculateValue,
    maximumLimitFlashSale,
  ) => {
    if (isFlashSaleIncludedTopping()) {
      const totalOfAmountHaveMaximumLimit = await calculateTotalOfAmountHaveMaximumLimit(
        maximumLimitFlashSale,
        quantity,
        calculateValue?.originalPriceNotYetHaveQuantity,
        calculateValue?.sellingPriceNotYetHaveQuantity,
      );
      setTotalPriceOfProduct(totalOfAmountHaveMaximumLimit);
    } else {
      const totalOfAmountHaveMaximumLimit = await calculateTotalOfAmountHaveMaximumLimit(
        maximumLimitFlashSale,
        quantity,
        calculateValue?.originalPriceNotYetHaveQuantity,
        calculateValue?.sellingPriceNotYetHaveQuantity,
      );
      setTotalPriceOfProduct(
        productToppings?.reduce(
          (totalTopping, currentTopping) => totalTopping + currentTopping?.priceValue * currentTopping?.quantity,
          0,
        ) *
          maximumLimitFlashSale +
          totalOfAmountHaveMaximumLimit,
      );
    }
  };

  const onChangeSize = async (e) => {
    let productPriceValue = productDetailInformation?.product?.productDetail?.productPrices.find(
      (a) => a.id === e.target.value,
    );
    const calculateValue = await getDataCalculatePrice(toppingGroupSelected, quantityProduct, e.target.value);

    setSizeSelected(e.target.value);
    setOriginalPriceDefault(productPriceValue.originalPrice);
    setPriceAfterDiscountDefault(productPriceValue.priceValue);
    setTotalPriceTopping(calculateValue?.totalPriceOfTopping);
    setTotalPriceOfProduct(calculateValue?.sellingPrice);
    setFlashSaleEndTime(productPriceValue?.promotionEndTime ?? null);
    setMaximumLimitFlashSale(productPriceValue?.maximumLimit);
    setTotalOriginalPriceProduct(calculateValue?.originalPrice);

    setPromotionTag(productPriceValue?.promotionTag);
    setPromotionOfProductPriceApplied(calculateValue?.promotions);

    /// Handle caculateTotalOfAmountHaveMaximumLimit
    if (quantityProduct > productPriceValue?.maximumLimit && productPriceValue?.maximumLimit > 0) {
      handleCalculateTotalOfAmountHaveMaximumLimit(
        toppingGroupSelected,
        quantityProduct,
        calculateValue,
        productPriceValue.maximumLimit,
      );
    }
  };

  const renderSelectSize = (data) => {
    return (
      <>
        <StyledProductDetailSection color={colorGroupBody}>
          <div className="size-header">{translateData.selectSize}</div>
          <RadioGroupTypeButtonComponent
            className="scrollbar-hide"
            data={data}
            onChange={onChangeSize}
            value={sizeSelected}
          />
        </StyledProductDetailSection>
      </>
    );
  };

  const onChangeProductOption = (e, optionId, productItemId, productPriceId, index) => {
    let optionLevelId = e.target.value;
    let optionGroupSelectedCopy = [...optionGroupSelected];
    let optionGroupItem, option, optionName, isSetDefault;

    if (isCombo) {
      optionGroupItem = optionGroupSelectedCopy.find(
        (a) =>
          a.id === optionId &&
          a.productId === productItemId &&
          a.productPriceId === productPriceId &&
          a.index === index,
      );
      let comboPrice = comboDetailInformationData.comboProductPrices.find((a) => a.productPriceId === productPriceId);
      option = comboPrice?.productPrice?.product?.productOptions.find((a) => a.id === optionId);
      let optionLevels = option.optionLevels.find((a) => a.id === optionLevelId);
      optionName = optionLevels?.name;
      isSetDefault = optionLevels?.isSetDefault;
    } else {
      optionGroupItem = optionGroupSelectedCopy.find((a) => a.id === optionId);
      option = productDetailInformation?.product?.productDetail?.productOptions.find((a) => a.id === optionId);
      let optionLevels = option.optionLevels.find((a) => a.id === optionLevelId);
      optionName = optionLevels?.name;
      isSetDefault = optionLevels?.isSetDefault;
    }

    optionGroupItem.optionLevelId = optionLevelId;
    optionGroupItem.optionLevelName = optionName;
    optionGroupItem.isSetDefault = isSetDefault;

    setOptionGroupSelected([...optionGroupSelectedCopy]);
  };

  const renderProductOption = (options, productItemId, productPriceId, index) => {
    return (
      <>
        {options.map((productOption, indexOption) => {
          let defaultValue = productOption?.optionLevels.find((a) => a.isSetDefault === true);
          return (
            <Collapse defaultActiveKey={["option" + indexOption]} expandIconPosition="end" className="group-collapse">
              <Panel header={productOption?.name} key={"option" + indexOption}>
                <div className="group-product-option-content">
                  <StyledProductDetailSection color={colorGroupBody}>
                    <RadioGroupTypeRadioComponent
                      data={productOption?.optionLevels}
                      onChange={(e) => {
                        onChangeProductOption(e, productOption?.id, productItemId, productPriceId, index);
                      }}
                      defaultValue={defaultValue.id}
                    />
                  </StyledProductDetailSection>
                </div>
              </Panel>
            </Collapse>
          );
        })}
      </>
    );
  };

  const onChangeQuantityTopping = async (id, isDecrease = false, productItemId, productPriceId, price, index) => {
    let toppingGroupSelectedCopy = [...toppingGroupSelected];
    let toppingItem;
    if (isCombo) {
      toppingItem = toppingGroupSelectedCopy.find(
        (a) =>
          a.toppingId === id &&
          a.productId === productItemId &&
          a.productPriceId === productPriceId &&
          a.index === index,
      );
    } else {
      toppingItem = toppingGroupSelectedCopy.find((a) => a.toppingId === id);
    }
    toppingItem.quantity = isDecrease ? toppingItem.quantity - 1 : toppingItem.quantity + 1;

    const calculateValue = await getDataCalculatePrice(toppingGroupSelectedCopy, quantityProduct);
    setTotalPriceTopping(calculateValue?.totalPriceOfTopping);
    setTotalOriginalPriceProduct(calculateValue?.originalPrice);

    setPromotionOfProductPriceApplied(calculateValue?.promotions);

    /// Handle caculateTotalOfAmountHaveMaximumLimit
    if (quantityProduct > maximumLimitFlashSale && maximumLimitFlashSale > 0) {
      handleCalculateTotalOfAmountHaveMaximumLimit(
        toppingGroupSelectedCopy,
        quantityProduct,
        calculateValue,
        maximumLimitFlashSale,
      );
    } else {
      setTotalPriceOfProduct(calculateValue?.sellingPrice);
    }
    setToppingGroupSelected([...toppingGroupSelectedCopy]);

    /// Handle calculation max discount for topping
    if (isCombo === false) {
      const data = {
        isApplyPromotion: productDetailInformation?.product?.productDetail?.isHasPromotion,
        isIncludedTopping: productDetailInformation?.product?.productDetail?.isIncludedTopping,
        isDiscountProductCategory: productDetailInformation?.product?.productDetail?.isPromotionProductCategory,
        totalPriceTopping:
          ((calculateValue?.totalPriceOfTopping * productDetailInformation?.product?.productDetail?.discountValue ||
            1) /
            100) *
          quantityProduct,
        totalPriceValue: quantityProduct * productDetailInformation?.product?.productDetail?.discountPrice,
        maximumDiscountAmount: productDetailInformation?.product?.productDetail?.maximumDiscountAmount,
      };
      maxDiscountService.calculationMaxDiscountService(
        data,
        () => {
          dispatch(setToastMessageMaxDiscount(true));
        },
        () => {
          dispatch(setToastMessageMaxDiscount(false));
        },
      );
    }
  };

  const renderProductTopping = (toppingList, productItemId, productPriceId, index) => {
    if (isCombo) {
      toppingList = toppingList.filter(
        (a) => a.productId === productItemId && a.productPriceId === productPriceId && a.index === index,
      );
    }
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
        <Panel header={translateData.selectTopping} key="1">
          <div className="group-product-topping-content">
            {toppingList.map((productTopping, indexTopping) => {
              return (
                <StyledProductDetailSection color={colorGroupBody} key={`topping-${indexTopping}`}>
                  <div className="group-product-topping-item">
                    <div className="topping-name">
                      <span className="name">{productTopping?.name}</span>
                      <Row>
                        {(productTopping?.priceValue !== productTopping?.originalPrice ||
                          (productTopping?.priceValueInMaxDiscount !== productTopping?.originalPrice &&
                            productTopping.priceValueInMaxDiscount !== undefined)) &&
                          productTopping?.priceValue !== undefined &&
                          productTopping?.originalPrice !== undefined && (
                            <Col>
                              <span className="topping-original-price-value">
                                {getPriceFormat(checkPrice(productTopping?.originalPrice))}
                              </span>
                            </Col>
                          )}
                        <Col>
                          <span className="topping-price-value">
                            {getPriceFormat(
                              checkPrice(
                                productTopping.priceValueInMaxDiscount === undefined
                                  ? productTopping?.priceValue
                                  : productTopping.priceValueInMaxDiscount,
                              ),
                            )}
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <ChangeQuantityComponent
                      size={changeQuantityComponentSize.Small}
                      quantity={productTopping?.quantity}
                      onDecreaseQuantity={() =>
                        onChangeQuantityTopping(
                          productTopping?.id ?? productTopping?.toppingId,
                          true,
                          productTopping?.productId,
                          productTopping?.productPriceId,
                          productTopping?.priceValue,
                          index,
                        )
                      }
                      onIncreaseQuantity={() =>
                        onChangeQuantityTopping(
                          productTopping?.id ?? productTopping?.toppingId,
                          false,
                          productTopping?.productId,
                          productTopping?.productPriceId,
                          productTopping?.priceValue,
                          index,
                        )
                      }
                    />
                  </div>
                </StyledProductDetailSection>
              );
            })}
          </div>
        </Panel>
      </Collapse>
    );
  };

  const getOptionGroupSelected = (productDetailObj, isComboValue = false) => {
    let selectedList = [];

    if (isComboValue) {
      const { comboProductPrices } = productDetailObj;
      let index = 0;
      for (let comboProductPriceItem of comboProductPrices) {
        const { productPrice, productPriceId } = comboProductPriceItem;
        const { product, productId } = productPrice;
        const { productOptions } = product;
        for (let option of productOptions) {
          let optionDefault = option.optionLevels.find((a) => a.isSetDefault === true);
          let selectedItem = {
            id: option.id, // is optionId,
            name: option.name,
            optionLevelId: optionDefault.id,
            optionLevelName: optionDefault.name,
            isSetDefault: optionDefault.isSetDefault,
            productPriceId: productPriceId,
            productId: productId,
            index: index,
          };
          selectedList.push(selectedItem);
        }
        index++;
      }
    } else {
      let optionList = productDetailObj?.product?.productDetail?.productOptions;
      for (let option of optionList) {
        let optionDefault = option.optionLevels.find((a) => a.isSetDefault === true);
        let selectedItem = {
          id: option.id, // is optionId,
          name: option.name,
          optionLevelId: optionDefault.id,
          optionLevelName: optionDefault.name,
          isSetDefault: optionDefault.isSetDefault,
        };
        selectedList.push(selectedItem);
      }
    }

    setOptionGroupSelected(selectedList);
  };

  const getToppingGroupSelected = (productDetailObj, isComboValue = false) => {
    let selectedList = [];

    if (isComboValue) {
      const { comboProductPrices } = productDetailObj;
      let index = 0;
      for (let comboProductPriceItem of comboProductPrices) {
        const { productPrice, productPriceId } = comboProductPriceItem;
        const { product, productId } = productPrice;
        const { productToppings } = product;
        for (let topping of productToppings) {
          let selectedItem = {
            ...topping,
            id: topping.toppingId,
            quantity: 0,
            productPriceId: productPriceId,
            productId: productId,
            index: index,
          };
          selectedList.push(selectedItem);
        }
        index++;
      }
    } else {
      let toppingList = productDetailObj?.product?.productToppings;
      if (toppingList) {
        for (let topping of toppingList) {
          let selectedItem = { ...topping, id: topping.toppingId, quantity: 0 };
          selectedList.push(selectedItem);
        }
      }
    }
    setToppingGroupSelected(selectedList);
    getPriceToppingProduct(productDetailObj?.product?.productDetail, selectedList);
    getPriceToppingProductFlashSale(productDetailObj);
  };

  const getPriceToppingProduct = (productDetail, toppings) => {
    let productToppings = toppings;
    if (toppingGroupSelected?.length > 0 && toppingGroupSelected !== undefined) productToppings = toppingGroupSelected;
    const isHasPromotion = productDetail?.isHasPromotion;
    const isIncludedTopping = productDetail?.isIncludedTopping;
    const isFlashSale = productDetail?.isFlashSale;
    const isDiscountPercent = productDetail?.isDiscountPercent;
    const maximumDiscountAmount = productDetail?.maximumDiscountAmount;
    if (isHasPromotion && isIncludedTopping && !isFlashSale) {
      if (maximumDiscountAmount === 0) {
        if (isDiscountPercent) {
          productToppings.forEach((item) => {
            item.originalPrice = item?.priceValue;
            item.priceValue = item?.priceValue - (item?.priceValue / 100) * productDetail?.discountValue;
          });
        } else {
          productToppings.forEach((item) => {
            item.originalPrice = item?.priceValue;
            item.priceValue =
              item?.priceValue - productDetail?.discountValue < 0 ? 0 : item?.priceValue - productDetail?.discountValue;
          });
        }
      } else {
        if (isDiscountPercent) {
          productToppings.forEach((item) => {
            item.originalPrice = item?.priceValue;
            item.priceValue = item?.priceValue - (item?.priceValue / 100) * productDetail?.discountValue;
          });
        }
      }
      setToppingGroupSelected(productToppings);
    }
  };

  const getPriceToppingProductFlashSale = async (productDetailInformation) => {
    let productToppings = productDetailInformation?.product?.productToppings;
    if (toppingGroupSelected?.length > 0 && toppingGroupSelected !== undefined) productToppings = toppingGroupSelected;
    const productDetail = productDetailInformation?.product?.productDetail;
    const isFlashSale = productDetail?.isFlashSale;
    let idProductPriceSelect = productDetail?.productPrices?.[0]?.id;
    if (isFlashSale && productDetail?.defaultProductPriceIndex) {
      idProductPriceSelect = productDetail?.productPrices?.[productDetail?.defaultProductPriceIndex]?.id;
    }
    const productPriceSelected = productDetail?.productPrices.find(
      (a) => a.id === (sizeSelected ?? idProductPriceSelect),
    );
    const isIncludedTopping = productDetail?.isIncludedTopping;
    if (productPriceSelected?.flashSaleId && productPriceSelected?.isIncludedTopping) {
      const updatedToppings = productToppings?.map((item) => {
        delete item?.priceValueInMaxDiscount;
        if (item?.originalPrice === undefined || item?.originalPrice === item?.priceValue) {
          return {
            ...item,
            originalPrice: item?.priceValue,
            priceValue: 0,
          };
        } else if (item?.originalPrice > item?.priceValue) {
          return {
            ...item,
            priceValue: 0,
          };
        }
        return item;
      });
      setToppingGroupSelected(updatedToppings);
    } else if (productPriceSelected !== undefined && !productPriceSelected?.isIncludedTopping && isFlashSale) {
      let updatedToppings = productToppings;
      if (!productPriceSelected?.flashSaleId) {
        if (!isIncludedTopping) {
          updatedToppings = productToppings?.map((item) => {
            if (item.originalPrice !== item.priceValue && item.originalPrice !== undefined) {
              return {
                ...item,
                priceValue: item.originalPrice,
              };
            }
            return item;
          });
        } else {
          updatedToppings = handelToppingInPromotionAndFlashSale(
            productDetail?.maximumDiscountAmount,
            productDetail?.isDiscountPercent,
            productToppings,
            productDetail?.discountValue,
          );
        }
      } else {
        updatedToppings = productToppings?.map((item) => {
          delete item?.priceValueInMaxDiscount;
          return {
            ...item,
            priceValue: item?.originalPrice ?? item.priceValue,
          };
        });
        const calculateValue = await getDataCalculatePrice(updatedToppings, quantityProduct);
        if (calculateValue) {
          setTotalPriceOfProduct(calculateValue?.sellingPrice);
          setTotalOriginalPriceProduct(calculateValue?.originalPrice);
          setPromotionOfProductPriceApplied(calculateValue?.promotions);
        }
      }
      setToppingGroupSelected(updatedToppings);
    }
  };

  const handelToppingInPromotionAndFlashSale = (
    maximumDiscountAmount,
    isDiscountPercent,
    productToppings,
    discountValue,
  ) => {
    let updatedToppings = productToppings;
    if (maximumDiscountAmount === 0) {
      if (isDiscountPercent) {
        updatedToppings = productToppings?.map((item) => {
          return {
            ...item,
            originalPrice: item?.originalPrice ?? item?.priceValue,
            priceValue:
              (item?.originalPrice ?? item?.priceValue) -
              ((item?.originalPrice ?? item?.priceValue) / 100) * discountValue,
          };
        });
      } else {
        updatedToppings = productToppings?.map((item) => {
          return {
            ...item,
            originalPrice: item?.originalPrice ?? item?.priceValue,
            priceValue: item?.originalPrice ?? item?.priceValue,
          };
        });
      }
    } else {
      if (isDiscountPercent) {
        updatedToppings = productToppings?.map((item) => {
          return {
            ...item,
            originalPrice: item?.originalPrice ?? item?.priceValue,
            priceValueInMaxDiscount:
              (item?.originalPrice ?? item?.priceValue) -
              ((item?.originalPrice ?? item?.priceValue) / 100) * discountValue,
          };
        });
      } else {
        updatedToppings = productToppings?.map((item) => {
          return {
            ...item,
            originalPrice: item?.originalPrice ?? item?.priceValue,
            priceValue: item?.originalPrice ?? item?.priceValue,
          };
        });
      }
    }
    return updatedToppings;
  };

  const updateQuantityProduct = async (quantity, isIncrease) => {
    if (quantity >= 1 && quantity <= maximumQuantity) {
      const isOutOfStock = await checkOutOfStock(sizeSelected, branchAddress?.id, quantity);
      if (isIncrease && isOutOfStock === true) {
        showNotificationOutOfStock();
        return;
      }

      /// If not out of stock, continue calculate
      let priceValue = 0;
      let productToppings = toppingGroupSelected.filter((a) => a.quantity >= 1);
      let calculateValue = await getDataCalculatePrice(productToppings, quantity);
      priceValue = calculateValue?.sellingPrice;
      setQuantityProduct(quantity);
      setTotalPriceTopping(calculateValue?.totalPriceOfTopping);
      setTotalOriginalPriceProduct(calculateValue?.originalPrice);

      setPromotionOfProductPriceApplied(calculateValue?.promotions);
      /// Handle caculateTotalOfAmountHaveMaximumLimit
      if (quantity > maximumLimitFlashSale && maximumLimitFlashSale > 0) {
        handleCalculateTotalOfAmountHaveMaximumLimit(productToppings, quantity, calculateValue, maximumLimitFlashSale);
      } else {
        setTotalPriceOfProduct(priceValue);
      }

      /// Handle calculation max discount
      let productPriceSelected = productDetailInformation?.product?.productDetail?.productPrices.find(
        (a) => a.id === sizeSelected,
      );

      const data = {
        isApplyPromotion: productDetailInformation?.product?.productDetail?.isHasPromotion,
        isIncludedTopping: productDetailInformation?.product?.productDetail?.isIncludedTopping,
        isDiscountProductCategory: productDetailInformation?.product?.productDetail?.isPromotionProductCategory,
        totalPriceTopping:
          (quantity * totalPriceTopping * productDetailInformation?.product?.productDetail?.discountValue || 1) / 100,
        totalPriceValue: quantity * productPriceSelected?.priceValue,
        maximumDiscountAmount: productDetailInformation?.product?.productDetail?.maximumDiscountAmount,
      };

      maxDiscountService.calculationMaxDiscountService(
        data,
        () => {
          dispatch(setToastMessageMaxDiscount(true));
        },
        () => {
          dispatch(setToastMessageMaxDiscount(false));
        },
      );
    }
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageAddToCart(true));
    setTimeout(() => {
      dispatch(setToastMessageAddToCart(false));
    }, 3000);
  };

  const handleVerifyProductInStoreBranchBeforeAddToCart = async () => {
    let canAddToCart = true;
    const jsonConfig = getStorage(localStorageKeys.STORE_CONFIG);
    const storeConfig = JSON.parse(jsonConfig);
    const storeId = storeConfig?.storeId;
    const branchId = branchAddress?.id;

    let queryString = `storeId=${storeId}&branchId=${branchId}`;
    if (isCombo) {
      const comboId =
        comboDetailInformationData?.comboTypeId === comboTypeEnum.comboPricing.id
          ? comboDetailInformationData?.comboId
          : comboDetailInformationData?.id;
      queryString += `&comboIds=${comboId}`;
    } else {
      queryString += `&productIds=${productId}`;
    }

    const response = await orderDataService.verifyProductInShoppingCartAsync(queryString);
    if (response) {
      const { comboIds, productIds } = response.data;
      if ((isCombo && comboIds?.length === 0) || (!isCombo && productIds?.length === 0)) {
        canAddToCart = false;
      }
    }

    return canAddToCart;
  };

  const handleShowProductNotInBranchModal = () => {
    setIsShowProductNotInBranchModal(false);
  };

  const addProductToCartFromDetail = () => {
    if (isOutOfStock) {
      return;
    }

    if (window.addProductToCart) {
      clearTimeout(window.addProductToCart);
    }
    window.addProductToCart = setTimeout(() => {
      addProductToCart();
    }, 300);
  };

  const addProductToCart = async () => {
    //Verify outofstock before add to cart
    if (isOutOfStock === true) return;
    setTempQuantityWhenAddToCart(tempQuantityWhenAddToCart + 1);
    const verifyOutOfStock = await checkOutOfStock(sizeSelected, branchAddress?.id, tempQuantityWhenAddToCart, false);
    if (verifyOutOfStock === true) {
      showNotificationOutOfStock();
      return;
    }

    //Verify product belong to branch befor add to cart
    const canAddToCart = await handleVerifyProductInStoreBranchBeforeAddToCart();
    if (canAddToCart === false) {
      setIsShowProductNotInBranchModal(true);
      return;
    }

    let productPriceSelected = productDetailInformation?.product?.productDetail?.productPrices.find(
        (a) => a.id === sizeSelected,
      ),
      product = {},
      productList = [];

    if (isCombo) {
      comboDetailInformationData?.comboProductPrices?.map((item, index) => {
        let itemProduct = item?.productPrice?.product;
        let optionsSelected = optionGroupSelected.filter(
          (a) =>
            a.productId === item?.productPrice?.productId &&
            a.productPriceId === item?.productPriceId &&
            a.index === index,
        );
        let toppingSelected = toppingGroupSelected.filter(
          (a) =>
            a.productId === item?.productPrice?.productId &&
            a.productPriceId === item?.productPriceId &&
            a.index === index,
        );

        let productItem = {
          id: item?.productPrice?.productId,
          name: itemProduct?.name,
          thumbnail: itemProduct?.thumbnail,
          productPrice: {
            id: item?.productPriceId,
            priceName: item?.priceName,
            priceValue: item?.priceValue,
          },
          options: mappingDataOptions(optionsSelected),
          toppings: mappingDataToppings(toppingSelected),
          index: index,
        };
        productList.push(productItem);
      });
      product = {
        isCombo: true,
        id:
          comboDetailInformationData?.comboTypeId === comboTypeEnum.comboPricing.id
            ? comboDetailInformationData?.comboId
            : comboDetailInformationData?.id,
        name: comboDetailInformationData?.name,
        comboPricingId: comboDetailInformationData?.comboPricingId,
        comboPricingName: comboDetailInformationData?.comboPricingName,
        thumbnail: comboDetailInformationData?.thumbnail,
        notes: noteForProduct,
        comboTypeId: comboDetailInformationData?.comboTypeId,
        products: productList,
        quantity: quantityProduct,
        originalPrice: originalPriceDefault,
        sellingPrice: priceAfterDiscountDefault,
        dataDetails: { ...comboDetailInformationData },
        totalOfToppingPrice: totalPriceTopping,
        branchId: branchAddress?.id,
      };
    } else {
      const checkProductInBranch = await productDataService.checkProductInBranchAsync(productId, branchAddress?.id);
      if (!checkProductInBranch?.data?.success) {
        setIsShowProductNotInBranchModal(true);
        setProductInBranch(false);
        return history.push("/product-list");
      } else {
        setProductInBranch(true);
      }
      product = {
        isCombo: false,
        id: productId,
        name: productDetailInformation?.product?.productDetail?.name,
        thumbnail: productDetailInformation?.product?.productDetail?.thumbnail,
        notes: noteForProduct,
        productPrice: {
          ...productPriceSelected,
          totalOfToppingPrice: totalPriceTopping,
          totalOfToppingOriginalPrice: totalOriginalPriceTopping,
          maximumDiscountAmount: productDetailInformation?.product?.productDetail?.maximumDiscountAmount,
        },
        quantity: quantityProduct,
        isFlashSale: productDetailInformation?.product?.productDetail?.isFlashSale,
        isPromotionProductCategory: productDetailInformation?.product?.productDetail?.isPromotionProductCategory,
        isPromotionTotalBill: productDetailInformation?.product?.promotions?.some(
          (item) => item?.promotionTypeId === EnumPromotion.DiscountTotal,
        ),
        options: mappingDataOptions(optionGroupSelected),
        toppings: mappingDataToppings(toppingGroupSelected),
        branchId: branchAddress?.id,
        dataDetails: {
          product: {
            ...productDetailInformation?.product,
          },
        },
      };
    }

    const currentDate = new Date().toISOString();
    if (currentDate > product?.productPrice?.promotionEndTime && product?.productPrice?.promotionEndTime != undefined) {
      setIsShowFlashSaleInActive(true);
    }
    shoppingCartService.updateStoreCart(product, (storeCartNew) => {
      dispatch(setCartItems(storeCartNew));
    });
    getProductDetailData();
    onShowToastMessage();
  };

  const isFlashSaleIncludedTopping = () => {
    let productPriceSelected = productDetailInformation?.product?.productDetail?.productPrices.find(
      (a) => a.id === sizeSelected,
    );
    return productPriceSelected?.flashSaleId && productPriceSelected?.isIncludedTopping;
  };

  const mappingDataOptions = (options) => {
    const newOptions = options?.map((o) => ({
      id: o?.id,
      name: o?.name,
      isSetDefault: o?.isSetDefault,
      optionLevelId: o?.optionLevelId,
      optionLevelName: o?.optionLevelName,
    }));

    return newOptions;
  };

  const mappingDataToppings = (toppings) => {
    if (isFlashSaleIncludedTopping()) {
      const newToppings = toppings?.map((t) => ({
        id: t?.toppingId,
        name: t?.name,
        priceValue: 0,
        originalPrice: t?.priceValue,
        quantity: t.quantity,
      }));
      return newToppings;
    } else {
      const newToppings = toppings?.map((t) => ({
        id: t?.toppingId,
        name: t?.name,
        priceValue: t?.priceValue,
        originalPrice: t?.priceValue,
        quantity: t.quantity,
      }));
      return newToppings;
    }
  };

  const addRelatedProductToCart = async (data) => {
    if (isCombo) {
      let requestData = {
        id: data?.id,
        comboProductPrices: data?.comboProductPrices,
        comboPricingProducts: data?.comboPricings[0]?.comboPricingProducts,
      };
      if (data?.comboTypeId === comboTypeEnum.comboPricing.id) {
        requestData.id = data?.comboPricings?.[0]?.id ?? null;
      }
      productComboAddToCartServices.quickAddToCart(requestData, data?.comboTypeId, branchAddress?.id);
    } else {
      let requestData = {
        id: data?.id,
        productPriceId: data?.productPrices?.[data?.defaultProductPriceIndex ?? 0]?.id,
        isFlashSale: data?.isFlashSale,
        flashSaleId: data?.flashSaleId,
      };
      productComboAddToCartServices.quickAddToCart(requestData, EnumAddToCartType.Product, branchAddress?.id);
    }
  };

  const getDataCalculatePrice = async (toppingGroupSelected, quantityProduct, sizeId = "") => {
    let productToppings = toppingGroupSelected.filter((a) => a.quantity >= 1);
    let toppingsData = [],
      dataSubmit = {};
    for (const item of productToppings) {
      let toppingItem = {
        ...item,
        toppingId: item?.toppingId ?? item?.toppingId,
        quantity: item?.quantity,
      };

      toppingsData.push(toppingItem);
    }
    if (isCombo) {
      if (!comboDetailInformationData) return;
      dataSubmit = {
        productId:
          comboDetailInformationData?.comboTypeId === comboTypeEnum.comboPricing.id
            ? comboDetailInformationData?.comboId
            : comboDetailInformationData?.id,
        isCombo: true,
        quantity: quantityProduct,
        toppings: toppingsData,
        comboTypeId: comboDetailInformationData?.comboTypeId,
        comboPricingId: comboDetailInformationData?.comboPricingId,
        productPriceId: "",
        productCategoryId: "",
        branchId: branchAddress?.id,
      };
    } else {
      if (!productDetailInformation) return;
      let productPriceValue = productDetailInformation?.product?.productDetail?.productPrices.find(
        (a) => a.id === (sizeId ? sizeId : sizeSelected),
      );
      const totalOriginalPriceOfTopping = productToppings.reduce(
        (totalPriceOfTopping, topping) =>
          totalPriceOfTopping +
          (topping?.originalPrice ? topping?.originalPrice : topping?.priceValue) * topping?.quantity * quantityProduct,
        0,
      );
      setTotalOriginalPriceTopping(totalOriginalPriceOfTopping);
      if (productPriceValue?.flashSaleId != null) {
        const totalPriceOfTopping = productPriceValue?.isIncludedTopping ? 0 : totalOriginalPriceOfTopping ?? 0;
        const dataResult = {
          sellingPrice: productPriceValue?.priceValue * quantityProduct + (totalPriceOfTopping ?? 0),
          originalPrice: productPriceValue?.originalPrice * quantityProduct + (totalOriginalPriceOfTopping ?? 0),
          totalPriceOfTopping: totalPriceOfTopping ?? 0,
          quantityProduct: quantityProduct,
          sellingPriceNotYetHaveQuantity: productPriceValue?.priceValue,
          originalPriceNotYetHaveQuantity: productPriceValue?.originalPrice,
        };
        return dataResult;
      } else {
        dataSubmit = {
          productId: productDetailInformation?.product?.productDetail?.id,
          productPriceId: productPriceValue?.id,
          productCategoryId: productDetailInformation?.product?.productDetail?.productCategoryId,
          isCombo: false,
          quantity: quantityProduct,
          toppings: toppingsData,
          comboTypeId: "",
          comboPricingId: "",
          branchId: branchAddress?.id,
        };
      }
    }

    let dataResult = {};
    if (
      (Boolean(dataSubmit?.isCombo) || (!Boolean(dataSubmit?.isCombo) && dataSubmit?.productPriceId)) &&
      isCustomize != true
    ) {
      dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    }

    return dataResult?.data;
  };

  function historyGoBack() {
    history.goBack();
  }

  const renderRelatedProduct = () => {
    let containerRelatedProduct = <></>;
    let listRelatedProduct = [];

    if (similarProductList?.length > 0) {
      if (isCombo) {
        similarProductList?.forEach((item, index) => {
          const combo = {
            ...item,
            id: item.id,
            name:
              item?.comboTypeId === (comboTypeEnum.comboPricing?.id && comboTypeEnum.comboPricing?.length > 0)
                ? item?.comboPricings[0]?.customName
                : item?.name,
            thumbnail: item?.thumbnail,
            sellingPrice: item?.sellingPrice,
            originalPrice: item?.originalPrice,
            description: item?.description,
            promotionTitle: item?.percentValue ? "-" + item?.percentValue + "%" : null,
            navigateTo: item?.navigateTo,
          };

          listRelatedProduct.push(
            <SwiperSlide className="swiper-slide-related-product">
              <ProductItem
                isCombo={true}
                key={index}
                product={combo}
                colorGroup={colorGroupRelatedProduct}
                addProductToCart={() =>
                  (productId !== undefined || comboId !== undefined) && addRelatedProductToCart(item)
                }
                useIconAddtoCart={true}
              />
            </SwiperSlide>,
          );
        });
      } else {
        similarProductList?.forEach((item, index) => {
          let promotionTitle = null;
          const sellingPrice = item?.productPrices?.[item?.defaultProductPriceIndex ?? 0]?.priceValue;
          const originalPrice = item?.productPrices?.[item?.defaultProductPriceIndex ?? 0]?.originalPrice;
          if (item?.isHasPromotion || item?.isFlashSale) {
            promotionTitle = getLabelPromotion(
              item?.isFlashSale,
              item?.isDiscountPercent,
              item?.discountValue,
              item?.isHasPromotion,
              originalPrice,
              sellingPrice,
            );
          }
          const product = {
            ...item,
            id: item?.id,
            name: item?.name,
            thumbnail: item?.thumbnail,
            sellingPrice: sellingPrice,
            originalPrice: originalPrice,
            description: item?.description,
            isFlashSale: item?.isFlashSale,
            promotionTitle: promotionTitle,
            navigateTo: `/product-detail/${item?.id}`,
          };

          listRelatedProduct.push(
            <SwiperSlide className="swiper-slide-related-product">
              <ProductItem
                key={index}
                product={product}
                colorGroup={colorGroupRelatedProduct}
                addProductToCart={() =>
                  (productId !== undefined || comboId !== undefined) && addRelatedProductToCart(item)
                }
                useIconAddtoCart={true}
              />
            </SwiperSlide>,
          );
        });
      }
    }

    let slidesPerView = "auto";
    let spaceBetween = 20;
    if (isLargeScreen) {
      slidesPerView = 4;
      spaceBetween = 32;
    }
    containerRelatedProduct = (
      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        pagination={{
          clickable: false,
        }}
        modules={[Pagination]}
        className="swiper-related-product"
      >
        {listRelatedProduct}
      </Swiper>
    );
    return containerRelatedProduct;
  };

  const removeOldFocusElement = () => {
    // Remove old focus
    let oldElementId = window.oldElements;
    const oldElement = document.querySelector(oldElementId);
    if (oldElement) {
      oldElement.setAttribute("style", "border: none;");
    }
  };

  const setFocusElement = (elementId) => {
    try {
      const element = document.querySelector(elementId);
      if (element) {
        // set border element on focused
        element.setAttribute("style", "border: 5px solid #50429b !important;");
        element.scrollIntoView({ behavior: "smooth" });
        window.oldElements = elementId;
      }
    } catch {}
  };

  const renderNamePriceNameCombo = (comboProductPrice) => {
    const priceName = Boolean(comboProductPrice?.priceName) ? ` (${comboProductPrice?.priceName})` : "";
    return comboProductPrice?.productPrice?.product?.name + priceName;
  };

  return (
    <>
      <ConfirmationDialog
        open={isShowFlashSaleInActive}
        title={translateData.notification}
        content={translateData.flashSaleInActive}
        footer={[
          <Button
            className="button-okay"
            onClick={() => {
              setIsShowFlashSaleInActive(false);
            }}
          >
            {translateData.okay}
          </Button>,
        ]}
        onCancel={() => {
          setIsShowFlashSaleInActive(false);
        }}
        className="flash-sale-in-active-theme2"
        closable={true}
        maskClosable={true}
      />
      <ConfirmationDialog
        open={isShowProductNotInBranchModal}
        title={translateData.notification}
        content={translateData.productNotInBranch}
        footer={[
          <Button
            className="button-okay"
            onClick={() => {
              handleShowProductNotInBranchModal();
              history.push("/product-list");
            }}
          >
            {translateData.okay}
          </Button>,
        ]}
        onCancel={() => {
          handleShowProductNotInBranchModal();
        }}
        className="product-not-in-branch-theme2"
        closable={true}
      />
      <section
        className={theme2ElementCustomize.HeaderProductDetail}
        id="productDetailHeader"
        onClick={() => {
          if (clickToFocusCustomize) {
            clickToFocusCustomize(theme2ElementCustomize.HeaderProductDetail);
            removeOldFocusElement();
            setTimeout(() => {
              setFocusElement("#productDetailHeader");
            }, 500);
          }
        }}
      >
        <BackToHistoryIcon className="back-to-history-icon displayed-when-medium-screen" onClick={historyGoBack} />
        <div className="product-detail-top-img" style={styleBackgroundHeader}>
          <span className="title-product" style={{ color: colorGroupHeader?.textColor }}>
            <span className="span-title-product">
              {isCombo
                ? comboDetailInformationData?.comboTypeId === comboTypeEnum.comboPricing.id
                  ? comboDetailInformationData?.comboPricingName
                  : comboDetailInformationData?.name
                : productDetailInformation?.product?.productDetail?.name}
            </span>
          </span>
          {header?.backgroundType === backgroundTypeEnum.Image && !header?.backgroundImage && (
            <img src={productDetailHeaderDefault} alt="" />
          )}
        </div>
      </section>

      <section className="product-detail-theme-pho-viet-section">
        <div
          id="productDetailBodyandChat"
          className={theme2ElementCustomize.MainProductDetail}
          onClick={() => {
            if (clickToFocusCustomize) {
              clickToFocusCustomize(theme2ElementCustomize.MainProductDetail);
              removeOldFocusElement();
              setTimeout(() => {
                setFocusElement("#productDetailBodyandChat");
              }, 500);
            }
          }}
        >
          <div style={detailBackgroundStyle}>
            <CloseBranchContainer branchId={branchAddress?.id} />
            {/* Section product detail */}
            <div id="productDetailBody" className={(productId || comboId) && "detail-center"}>
              <div className="product-detail-theme-pho-viet-section-group">
                <div
                  className={`product-detail-theme-pho-viet-section-left ${
                    (productId || comboId) && "non-padding-left"
                  }`}
                >
                  {productId || comboId ? (
                    <>
                      {thumbnail.length > 1 ? (
                        <>
                          <ProductDetailImagesComponent
                            images={thumbnail}
                            isLoop={true}
                            isNavigation={true}
                            isPromotion={productDetailInformation?.product?.productDetail?.isHasPromotion}
                            promotion={
                              isDiscountPercent
                                ? productDetailInformation?.product?.productDetail?.discountValue + "%"
                                : getPriceFormat(productDetailInformation?.product?.productDetail?.discountPrice)
                            }
                            classPromotion={"discount-product-detail"}
                          />
                        </>
                      ) : (
                        <>
                          {promotionTag ||
                          (comboDetailInformationData?.percentDisount &&
                            comboDetailInformationData?.percentDisount > 0) ? (
                            <div className="discount-product-detail">
                              <span className="discount-text">
                                {isCombo ? (
                                  <>{comboDetailInformationData?.percentDisount + "%"}</>
                                ) : (
                                  <>
                                    {flashSaleEndTime
                                      ? calculatePercentage(priceAfterDiscountDefault, originalPriceDefault)
                                      : promotionTag}
                                  </>
                                )}
                              </span>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div className="main-image-box">
                            <OutOfStockLabelBoxComponent isShow={isOutOfStock} />
                            <BackToHistoryIcon
                              className="back-to-history-icon displayed-when-small-screen"
                              onClick={historyGoBack}
                            />
                            <Image
                              src={thumbnail[0]?.imageUrl ?? "error"}
                              className={`product-image image-border-custom ${isOutOfStock && "out-of-stock-opacity"}`}
                              fallback={productImageDefault}
                              preview={false}
                            />
                          </div>
                          <div className="image-sub-group">
                            <Image
                              className="image-sub"
                              src={thumbnail[0]?.imageUrl ?? "error"}
                              fallback={productImageDefault}
                              preview={false}
                            />
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <ProductDetailImagesComponent
                      images={productImageList}
                      isLoop={false}
                      isNavigation={true}
                      isPromotion={productDetailInformation?.product?.productDetail?.isHasPromotion}
                      promotion={
                        isDiscountPercent
                          ? productDetailInformation?.product?.productDetail?.discountValue + "%"
                          : getPriceFormat(productDetailInformation?.product?.productDetail?.discountPrice)
                      }
                      classPromotion={"discount-product-detail"}
                      isShowImageBottom={true}
                    />
                  )}
                </div>
                <div className="product-detail-theme-pho-viet-section-right">
                  <div className="product-detail-theme-pho-viet-section-right-content">
                    {flashSaleEndTime && <FnbFlashSaleBannerComponent endTime={flashSaleEndTime} endAtZero={true} />}
                    <h3 className="product-name" style={{ color: colorGroupBody?.textColor }}>
                      {isCombo
                        ? comboDetailInformationData?.comboTypeId === comboTypeEnum.comboPricing.id
                          ? comboDetailInformationData?.comboPricingName
                          : comboDetailInformationData?.name
                        : productDetailInformation?.product?.productDetail?.name}
                    </h3>

                    <StarRatingComponent
                      defaultValueRate={productDetailInformation?.product?.productDetail?.rate}
                      numberOfReview={productDetailInformation?.product?.productDetail?.totalReview}
                    />

                    {promotionsOfProductPriceApplied?.length > 0 && (
                      <NameAndValuePopoverStoreWeb
                        data={mappingDiscountApplyToPromotionPopupData(promotionsOfProductPriceApplied)}
                        className="popover-promotion-product-detail-theme2"
                      />
                    )}

                    {(comboDetailInformationData?.description ||
                      productDetailInformation?.product?.productDetail?.description) && (
                      <ProductDetailDescriptionComponent
                        content={
                          isCombo
                            ? comboDetailInformationData?.description
                            : productDetailInformation?.product?.productDetail?.description
                        }
                        isViewMore={true}
                        classNameDescription={"product-description"}
                        idDescription={"product-description"}
                      />
                    )}

                    <div className="product-price">
                      <div className="product-price-left">
                        {isCombo ? (
                          <>
                            {originalPriceDefault !== priceAfterDiscountDefault && (
                              <div className="product-price-original-box">
                                <span className="promotion-tag-for-small-screen d-none">
                                  {comboDetailInformationData?.percentDisount + "%"}
                                </span>
                                <span className="product-price-original">{getPriceFormat(originalPriceDefault)}</span>
                              </div>
                            )}
                            <span className="product-price-discount" style={{ color: colorGroupBody?.titleColor }}>
                              {getPriceFormat(priceAfterDiscountDefault)}
                            </span>
                          </>
                        ) : (
                          <>
                            {promotionTag && originalPriceDefault > priceAfterDiscountDefault && (
                              <div className="product-price-original-box">
                                <span className="promotion-tag-for-small-screen d-none">
                                  {flashSaleEndTime
                                    ? calculatePercentage(priceAfterDiscountDefault, originalPriceDefault)
                                    : promotionTag}
                                </span>
                                <span className="product-price-original">{getPriceFormat(originalPriceDefault)}</span>
                              </div>
                            )}
                            <span className="product-price-discount" style={{ color: colorGroupBody?.titleColor }}>
                              {getPriceFormat(priceAfterDiscountDefault)}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="product-price-right">
                        <StyledProductDetailSection color={colorGroupBody}>
                          <ChangeQuantityComponent
                            size={
                              isSmallScreen ? changeQuantityComponentSize.Small : changeQuantityComponentSize.Medium
                            }
                            quantity={quantityProduct}
                            onDecreaseQuantity={() => updateQuantityProduct(quantityProduct - 1)}
                            onIncreaseQuantity={() => updateQuantityProduct(quantityProduct + 1, true)}
                            disableIncreaseQuantity={isOutOfStock}
                          />
                        </StyledProductDetailSection>
                      </div>
                    </div>

                    {isCombo ? (
                      <div className="combo-content">
                        <div className="line-in-small-screen"></div>
                        {comboDetailInformationData?.comboProductPrices.map((comboProductPrice, index) => {
                          return (
                            <div className={`group-product-combo ${index >= 1 && "margin-top"}`}>
                              <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
                                <Panel
                                  header={renderNamePriceNameCombo(comboProductPrice)}
                                  key="1"
                                  className="product-name-banner"
                                >
                                  <div className="topping-and-option-in-combo">
                                    <div className="group-product-topping">
                                      {comboProductPrice?.productPrice?.product?.productToppings?.length > 0 &&
                                        renderProductTopping(
                                          toppingGroupSelected ?? [],
                                          comboProductPrice?.productPrice?.productId,
                                          comboProductPrice?.productPriceId,
                                          index,
                                        )}
                                    </div>
                                    <div className="group-product-option">
                                      {comboProductPrice?.productPrice?.product?.productOptions?.length > 0 &&
                                        renderProductOption(
                                          comboProductPrice?.productPrice?.product?.productOptions ?? [],
                                          comboProductPrice?.productPrice?.productId,
                                          comboProductPrice?.productPriceId,
                                          index,
                                        )}
                                    </div>
                                  </div>
                                </Panel>
                              </Collapse>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        {quantityProduct > maximumLimitFlashSale && maximumLimitFlashSale > 0 && (
                          <MaximumLimitFlashSaleNotifyComponent maximumLimit={maximumLimitFlashSale} />
                        )}

                        {productDetailInformation?.product?.productDetail?.productPrices?.length > 1 && (
                          <div className="group-multiple-price scrollbar-hide">
                            {renderSelectSize(productDetailInformation?.product?.productDetail?.productPrices)}
                          </div>
                        )}
                        {(productDetailInformation?.product?.productToppings?.length > 0 ||
                          productDetailInformation?.product?.productDetail?.productOptions?.length > 0) && (
                          <div className="topping-and-option">
                            {productDetailInformation?.product?.productToppings?.length > 0 && (
                              <div className="group-product-topping">
                                {renderProductTopping(toppingGroupSelected ?? [])}
                              </div>
                            )}
                            {productDetailInformation?.product?.productDetail?.productOptions?.length > 0 && (
                              <div className="group-product-option">
                                {renderProductOption(
                                  productDetailInformation?.product?.productDetail?.productOptions ?? [],
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    <div className="product-note">
                      <NoteTextAreaComponent
                        className="mt-24"
                        onChange={(e) => setNoteForProduct(e.target.value)}
                        value={noteForProduct}
                      />
                    </div>
                    <StyledProductDetailSection color={colorGroupBody}>
                      <div
                        className="btn-add-to-cart"
                        style={{
                          opacity: isOutOfStock ? 0.5 : 1,
                          cursor: isOutOfStock ? "not-allowed" : "pointer",
                        }}
                        onClick={addProductToCartFromDetail}
                      >
                        <div className="btn-add-to-cart-price">
                          {totalPriceOfProduct !== totalOriginalPriceProduct && (
                            <div className={`btn-add-to-cart-origin-price-value`}>
                              {getPriceFormat(totalOriginalPriceProduct)}
                            </div>
                          )}
                          <div
                            className={`btn-add-to-cart-price-value ${
                              totalPriceOfProduct >= limitLengthPriceCSS ? "btn-add-to-cart-price-value--down-fs" : ""
                            }`}
                          >
                            {getPriceFormat(totalPriceOfProduct < 0 ? 0 : totalPriceOfProduct)}
                          </div>
                        </div>
                        <div
                          className={`btn-add-to-cart-text ${
                            totalPriceOfProduct >= limitLengthPriceCSS ? "btn-add-to-cart-text--down-fs" : ""
                          }`}
                        >
                          {`${translateData.btnAddToCart} `}
                          <CheckoutIcon className="icon-check-out" />
                        </div>
                      </div>
                    </StyledProductDetailSection>
                  </div>
                </div>
              </div>
            </div>

            {/* Section chat about product */}
            <StyledProductDetailSection color={colorGroupBody}>
              <div className={`chatAboutProduct detail-center`}>
                <div className={`product-detail-theme-pho-viet-section-reviews`}>
                  <div className="product-detail-reviews-title">
                    <ReviewIcon />
                    <div className="product-detail-reviews-title-content">{`${translateData.reviewTitle} (${reviewAmount})`}</div>{" "}
                  </div>
                  <div className="product-detail-reviews-content">
                    <div className="product-detail-reviews-no-content">
                      <NoChatContentIcon className="icon-reviews-no-content" />
                      <p className="product-detail-reviews-no-content-text">{translateData.notYetReview}</p>
                    </div>
                  </div>
                </div>
              </div>
            </StyledProductDetailSection>
          </div>
        </div>

        {/* Related products */}
        {productInBranch && (
          <div
            className={`${theme2ElementCustomize.RelatedProductDetail} ${(productId || comboId) && "detail-center"}`}
            style={styleBackgroundRelatedProduct}
            id="boxRelatedProductsDetail"
            onClick={() => {
              if (clickToFocusCustomize) {
                clickToFocusCustomize(theme2ElementCustomize.RelatedProductDetail);
                removeOldFocusElement();
                setTimeout(() => {
                  setFocusElement("#boxRelatedProductsDetail");
                }, 500);
              }
            }}
          >
            <div id="relatedProductsDetail" className={(productId || comboId) && "w-50"}>
              <StyledProductDetailSection color={colorGroupRelatedProduct}>
                <div className="related-products-container">
                  <div className="related-products">
                    <div className="top-content-product">
                      <div className="top-tile">
                        <label>{translateData?.relatedProducts}</label>
                      </div>
                    </div>

                    <div className="middle-content-product-detail">
                      <div className="product-row">{renderRelatedProduct()}</div>
                    </div>
                  </div>
                </div>
              </StyledProductDetailSection>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
