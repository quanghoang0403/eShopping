import { Button, Col, Input, Row } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { EnumVerifyProductPromotionType, enumCheckInactiveProduct } from "../../../../constants/enums";
import productDataService from "../../../../data-services/product-data.service";
import { setCartItems, setNotificationDialog } from "../../../../modules/session/session.actions";
import { useAppCtx } from "../../../../providers/app.provider";
import {
  checkOutOfStockAllProductWhenUpdateCart,
  checkOutOfStockWhenUpdateCart,
} from "../../../../services/material/check-out-of-stock.service";
import posCartService from "../../../../services/pos/pos-cart.services";
import reduxService from "../../../../services/redux.services";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import {
  calculatePercentage,
  checkNonEmptyArray,
  formatTextNumber,
  mappingDiscountApplyToPromotionPopupData,
} from "../../../../utils/helpers";
import { HttpStatusCode } from "../../../../utils/http-common";
import { getStorage, localStorageKeys, setStorage } from "../../../../utils/localStorage.helpers";
import { CheckCircleIcon, CloseIcon, MinusOutlined, NoteIcon, PlusOutlined } from "../../../assets/icons.constants";
import productDefaultImage from "../../../assets/images/product-default-img.jpg";
import productDefault from "../../../assets/images/product-default.png";
import FnbFlashSaleBannerComponent from "../../../components/fnb-flash-sale-banner/fnb-flash-sale-banner.component";
import { MaximumLimitFlashSaleNotifyComponent } from "../../../components/maximum-limit-flash-sale-notify/maximum-limit-flash-sale-notify.component";
import NameAndValuePopoverStoreWeb from "../../../components/name-and-value-popup-store-web/NameAndValuePopoverStoreWeb";
import { backgroundTypeEnum, theme1ElementRightId } from "../../../constants/store-web-page.constants";
import { CloseBranchContainer } from "../../../containers/close-branch/close-branch.container";
import ProductDetailImagesComponent from "../../product-detail/components/product-detail-images.component";
import { ProductDetailOptionComponent } from "../../product-detail/components/product-detail-option.component";
import ProductDetailProductPriceComponent from "../../product-detail/components/product-detail-product-price.component";
import ProductDetailRateDescriptionComponent from "../../product-detail/components/product-detail-rate-description.component";
import { ProductDetailToppingComponent } from "../../product-detail/components/product-detail-topping.component";
import { EditOrderComboDialogComponent } from "./edit-order-combo-dialog.component";
import "./edit-order-dialog.style.scss";
const StyledProductEditDetail = styled.div`
  .edit-product-cart-detail-container .product-detail-content {
    .options {
      .ant-radio-button-wrapper-checked {
        background-color: ${(props) => props?.colorConfig?.buttonBackgroundColor} !important;
        border: 1px solid ${(props) => props?.colorConfig?.buttonBackgroundColor} !important;
        .ant-radio-button-checked {
          background: #fff;
        }
      }
    }
    .modify-quantity {
      background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
      .quantity-product {
        color: ${(props) => props?.colorConfig?.buttonTextColor};
      }
      svg {
        path {
          fill: #000000;
        }
        rect {
          fill: #fff;
        }
      }
      .ant-btn-icon {
      }
      .btn-reduce {
        background-color: transparent;
        svg {
          path {
            fill: #000000;
          }
          rect {
            fill: #fff;
          }
        }
      }
      .btn-increase {
        background-color: transparent;
        svg {
          path {
            fill: #000000;
          }
          rect {
            fill: #fff;
          }
        }
      }
    }
    .quantity-responsive .modify-quantity-for-responsive {
      background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
      .quantity-product {
        color: ${(props) => props?.colorConfig?.buttonTextColor};
      }
      svg {
        path {
          fill: #000000;
        }
        rect {
          fill: #fff;
        }
      }
      .btn-reduce {
        background-color: transparent;
      }
      .btn-increase {
        background-color: transparent;
      }
    }
    .modify-quantity-topping {
      .active {
        background: ${(props) => props?.colorConfig?.buttonBackgroundColor};
        .quantity-product {
          color: ${(props) => props?.colorConfig?.buttonTextColor};
        }
      }
      svg {
        path {
          fill: #000000;
        }
        rect {
          fill: #fff;
        }
      }
    }
  }
`;
export const EditOrderProductDialogComponent = forwardRef((props, ref) => {
  const {
    onCancel,
    setCurrentCartItems,
    calculateShoppingCart,
    colorGroup,
    isPOS = false,
    branchIdPos,
    platformId,
    initProductData,
    initCurrentIndex,
    isModalVisible,
    fontFamily,
  } = props;
  const [t] = useTranslation();
  const { Toast } = useAppCtx();
  const dispatch = useDispatch();
  const [productDetail, setProductDetail] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productPrices, setProductPrices] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [productOptions, setProductOptions] = useState([]);
  const [optionsSelected, setOptionsSelected] = useState([]);
  const [productPriceSelected, setProductPriceSelected] = useState({});
  const [oldProductPriceSelected, setOldProductPriceSelected] = useState({});
  const [isChangeSizeProduct, setIsChangeSizeProduct] = useState(false);
  const [productToppings, setProductToppings] = useState(null);
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [totalPriceTopping, setTotalPriceTopping] = useState(0);
  const [messagesForStore, setMessagesForStore] = useState("");
  const [isPromotion, setIsPromotion] = useState(false);
  const [promotionValue, setPromotionValue] = useState("");
  const [dataDetails, setDataDetails] = useState(null);
  const [isCombo, setIsCombo] = useState(null);
  const [comboData, setComboData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isUpdateButtonVisible, setIsUpdateButtonVisible] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [toppingDiscountPrice, setToppingDiscountPrice] = useState(0);
  const branchAddress = isPOS ? { id: branchIdPos } : reduxService.getAllData()?.deliveryAddress?.branchAddress;
  const [totalOfAmount, setTotalOfAmount] = useState([]);
  const [totalOriginalPrice, setTotalOriginalPrice] = useState(0);
  const [branchId, setBranchId] = useState(null);
  const [isInitData, setIsInitData] = useState(true);
  const [isFlashSaleAfterMaximumLimit, setFlashSaleAfterMaximumLimit] = useState(false);
  const [promotionsOfProductPriceApplied, setPromotionOfProductPriceApplied] = useState([]);

  const { TextArea } = Input;
  const cartItems = useSelector((state) => state.session.cartItems);
  let defaultActiveKey = ["Size", "Topping", "Option"];
  const maximumQuantity = 999;
  const isMobile = useMediaQuery({ maxWidth: 575 });

  const translatedData = {
    leaveAMessageForTheStore: t("storeWebPage.generalUse.leaveAMessageForTheStore"),
    description: t("storeWebPage.generalUse.description"),
    maybeYouLike: t("storeWebPage.generalUse.maybeYouLike"),
    review: t("storeWebPage.generalUse.review"),
    thereAreCurrentlyNoReviews: t("storeWebPage.generalUse.thereAreCurrentlyNoReviews"),
    chooseOptions: t("storeWebPage.productDetailPage.chooseOptions"),
    updateCart: t("storeWebPage.generalUse.updateCart"),
    addProductToCart: t("storeWebPage.productDetailPage.addProductToCart", "Add Product To Cart"),
    okay: t("storeWebPage.generalUse.okay"),
    notification: t("storeWebPage.generalUse.notification"),
    flashSaleEndNotification: t("storeWebPage.flashSale.flashSaleEndNotification"),
    notePlaceHolder: t("checkOutPage.notePlaceHolder", "Nhập ghi chú"),
    chooseSize: t("storeWebPage.productDetailPage.chooseSize", "Chọn size"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    quantity: t("storeWebPage.productDetailPage.quantity", "Quantity"),
  };

  const verifyProduct = async (productId, promotionId, promotionType, productPriceId, isApplyFlashSale, platformId) => {
    const res = await productDataService.verifyProductStoreThemeAsync(
      productId,
      platformId,
      branchAddress?.id,
      promotionId,
      promotionType,
      productPriceId,
      isApplyFlashSale,
    );
    if (res?.data.responseCode == enumCheckInactiveProduct.NOT_FOUND) {
      window.location.reload();
      return;
    } else {
      return res;
    }
  };

  useEffect(() => {
    if (initProductData && isModalVisible) {
      setCurrentIndex(initCurrentIndex);
      handleVerifyProduct(initProductData);
    }
  }, [initProductData, initCurrentIndex, isModalVisible]);

  useImperativeHandle(ref, () => ({
    // If index == -1 then it will see details and add new
    setProductData(data, index) {
      setCurrentIndex(index);
      handleVerifyProduct(data);
    },
  }));

  function handleVerifyProduct(data) {
    if (data) {
      setIsCombo(data.isCombo);
      if (data.isCombo) {
        setComboData(data);
      } else {
        let productData = {};
        let _promotionId = "";
        let _promotionType = EnumVerifyProductPromotionType.NotPromotion;
        if (data?.isFlashSale) {
          _promotionType = EnumVerifyProductPromotionType.FlashSale;
          _promotionId = data?.productPrice?.flashSaleId;
        } else if (data?.productPrice?.isApplyPromotion) {
          _promotionType = EnumVerifyProductPromotionType.Discount;
          _promotionId = data?.productPrice?.promotionId;
        }
        verifyProduct(data?.id, _promotionId, _promotionType, data?.productPrice?.id, !isPOS, platformId)
          .then((response) => {
            if (response?.status === HttpStatusCode.Ok) {
              productData.product = response?.data?.product;
              productData.promotions = response?.data?.product?.promotions;
              data.dataDetails = productData;
              getProductData(data);
            } else {
              getProductData(data);
            }
          })
          .catch((response) => {
            // To do
          });
      }
      setMessagesForStore(data?.notes);
    }
  }

  const getProductData = (data) => {
    const currentProductPrice = data?.productPrice;
    setOriginalPrice(currentProductPrice?.originalPrice);
    setDataDetails(data?.dataDetails);
    const productDetail = data?.dataDetails?.product?.productDetail;
    const priceValue = productDetail?.productPrices?.find((p) => p.id === currentProductPrice?.id)?.priceValue;
    if (priceValue) {
      setProductPrice(priceValue);
    } else {
      setProductPrice(currentProductPrice?.priceValue);
    }

    if (productDetail) {
      const { productOptions, productPrices } = productDetail;
      setProductDetail(productDetail);
      setProductOptions(productOptions);
      setProductPrices(productPrices);

      ///Data changed
      const { quantity, productPrice, toppings, options, branchId } = data;
      setQuantityProduct(quantity);

      const newToppingsData = data?.dataDetails?.product?.productToppings;
      let toppingsMapping = [];
      newToppingsData?.map((item) => {
        const toppingExist = toppings?.find((topping) => topping?.id === item?.toppingId);
        if (toppingExist) {
          toppingsMapping.push(toppingExist);
        } else {
          toppingsMapping.push({
            id: item?.toppingId,
            name: item?.name,
            originalPrice: item?.priceValue,
            priceValue: item?.priceValue,
            quantity: 0,
          });
        }
      });
      getToppingsInitData(toppingsMapping, productDetail?.isIncludedTopping, productDetail);
      getSizeInitData(productPrice?.id, productPrices);
      getOptionsInitData(options, productOptions);
      setBranchId(branchId);
      ///Calculate discount price, percentage
      calculateDiscountPricePercentage(
        currentProductPrice?.flashSaleId,
        currentProductPrice?.isApplyPromotion,
        currentProductPrice?.isPercentDiscount,
        currentProductPrice?.discountValue,
        currentProductPrice?.priceValue,
        currentProductPrice?.originalPrice,
      );

      setIsUpdateButtonVisible(true);
    }
    if (!data?.productPrice?.flashSaleId) {
      setFlashSaleAfterMaximumLimit(true);
    }
    setIsInitData(false);
  };

  useEffect(() => {
    if (productPriceSelected && Object.keys(productPriceSelected).length && !isInitData) {
      handleChangeSize();
    }
  }, [productPriceSelected]);

  useEffect(() => {
    if (window.updateQuantityProduct) {
      clearTimeout(window.updateQuantityProduct);
    }
    window.updateQuantityProduct = setTimeout(async () => {
      if (quantityProduct >= 1 && quantityProduct <= maximumQuantity && !isInitData) {
        let productTopping = productToppings?.filter((a) => a.quantity >= 1);
        let calculateValue = await getDataCalculatePrice(
          productDetail,
          productTopping,
          quantityProduct,
          productPriceSelected,
          branchId,
        );
        handleTotalOfAmount(productToppings, calculateValue, totalPriceTopping);
        setPromotionOfProductPriceApplied(calculateValue?.promotions);
      }
    }, 500);
  }, [quantityProduct, totalPriceTopping]);

  const getDataCalculatePrice = async (
    productDetail,
    toppingGroupSelected,
    quantityProduct,
    productPriceSelected,
    branchId,
  ) => {
    let productToppings = toppingGroupSelected?.filter((a) => a.quantity >= 1) ?? [];
    let toppingsData = [],
      dataSubmit = {};
    for (const item of productToppings) {
      let toppingItem = {
        ...item,
        toppingId: item?.toppingId ?? item?.id,
        quantity: item?.quantity,
      };

      toppingsData.push(toppingItem);
    }
    const productListOfCart = cartItems?.filter((a) => a.isCombo === false) ?? [];

    dataSubmit = {
      productId: productDetail?.id,
      productPriceId: productPriceSelected?.id,
      productCategoryId: productDetail?.productCategoryId,
      isCombo: false,
      quantity: quantityProduct,
      toppings: toppingsData,
      comboTypeId: "",
      comboPricingId: "",
      branchId: branchId,
      productListOfCart: productListOfCart,
      isCheckFlashSale: Boolean(productPriceSelected?.flashSaleId),
      isProductAfterMaximumLimit: isFlashSaleAfterMaximumLimit,
    };
    let dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    return dataResult?.data;
  };

  const isFlashSaleIncludedTopping = () => {
    return productPriceSelected?.flashSaleId && productPriceSelected?.isIncludedTopping;
  };

  /// Handle caculateTotalOfAmountHaveMaximumLimit
  const calculateTotalOfAmountHaveMaximumLimit = (quantityHaveFlashSale, quantity, originalPrice, priceValue) => {
    return quantityHaveFlashSale * priceValue + originalPrice;
  };

  const calculateDiscountPricePercentage = (
    flashSaleId,
    isApplyPromotion,
    isDiscountPercent,
    discountValue,
    priceValue,
    originalPrice,
  ) => {
    if (flashSaleId) {
      if (originalPrice > priceValue) {
        setPromotionValue("-" + calculatePercentage(priceValue, originalPrice));
        setIsPromotion(true);
      } else {
        setPromotionValue("");
      }
    } else {
      if (isApplyPromotion) {
        setIsPromotion(true);
      } else {
        setPromotionValue("");
      }
    }
  };

  const getToppingsInitData = (toppings, isIncludedTopping, productDetail, productPrice) => {
    let toppingPrice = 0;
    setProductToppings(toppings);
    getPriceToppingProduct(productDetail, toppings);
    getPriceToppingProductFlashSale(productDetail, toppings, productPrice);
    toppings?.map((topping) => {
      //let toppingValue = isIncludedTopping === false ? topping.originalPrice : topping.priceValue;
      let toppingValue = topping.originalPrice;
      toppingPrice += toppingValue * topping.quantity;
    });
    setTotalPriceTopping(toppingPrice);

    ///Check if has promotion include topping
    checkPromotionIncludeTopping(productDetail, toppingPrice);
  };

  const checkPromotionIncludeTopping = (productDetail, currentTotalPriceTopping) => {
    const isIncludedTopping = productDetail?.isIncludedTopping;
    const isHasPromotion = productDetail?.isHasPromotion;
    if (isIncludedTopping && isHasPromotion && !productDetail?.isFlashSale) {
      let toppingDiscountPrice = (currentTotalPriceTopping * productDetail.discountValue || 1) / 100;
      if (productDetail?.maximumDiscountAmount > 0) {
        toppingDiscountPrice = 0;
      }
      if (toppingDiscountPrice < 1) {
        toppingDiscountPrice = 0;
      }
      setToppingDiscountPrice(toppingDiscountPrice);
    }
  };

  const getSizeInitData = (id, productPrices) => {
    const productPrice = productPrices?.find((productPrice) => productPrice?.id === id);
    setPromotionValue(productPrice?.promotionTag);
    setProductPriceSelected(productPrice);
    setIsPromotion(productPrice?.isApplyPromotion);
  };

  const getOptionsInitData = (currentOptions, productOptions) => {
    let optionsSelected = [];
    const arrOptionLevelIds = currentOptions?.map((o) => o.optionLevelId);
    productOptions?.map((productOption) => {
      let option = productOption?.optionLevels?.find((ol) => arrOptionLevelIds?.includes(ol.id));
      if (option) {
        optionsSelected.push(option);
      } else {
        const optionDefault = productOption?.optionLevels?.find((ol) => ol?.isSetDefault);
        optionsSelected.push(optionDefault);
      }
    });
    setOptionsSelected(optionsSelected);
  };

  const updateQuantityProduct = async (quantity, isIncrease) => {
    if (!isCombo && productPriceSelected) {
      const cartData = JSON.parse(getStorage(localStorageKeys.STORE_CART));
      const outOfStockIndices = cartData?.reduce((acc, item, index) => {
        if (item.isOutOfStock) {
          acc.push(index);
        }
        return acc;
      }, []);
      let verifyOutOfStock = await checkOutOfStockAllProductWhenUpdateCart(
        branchAddress?.id,
        cartData,
        initCurrentIndex,
        quantity,
        outOfStockIndices,
        true,
        productPriceSelected,
      );
      if (verifyOutOfStock) {
        //setIsOutOfStock(true);
        if (isIncrease) {
          const notificationDialog = {
            isShow: true,
            content: translatedData.textOutOfStock,
          };
          dispatch(setNotificationDialog(notificationDialog));
          return;
        }
      } else {
        setIsOutOfStock(false);
      }
    }
    if (quantity >= 1) {
      setQuantityProduct(quantity);
      ///Check IncludedTopping
      if (quantity > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0) {
        getToppingsInitData(productToppings, false, productDetail);
      } else {
        getToppingsInitData(productToppings, true, productDetail);
      }
    }
  };

  const updateQuantityTopping = async (index, quantity, price) => {
    let toppingEdit = productToppings[index];
    const quantityNew = toppingEdit.quantity + quantity;
    toppingEdit = { ...toppingEdit, quantity: quantityNew };
    let toppingsCopy = [...productToppings];
    toppingsCopy.splice(index, 1, toppingEdit);

    const calculateValue = await getDataCalculatePrice(
      productDetail,
      toppingsCopy,
      quantityProduct,
      productPriceSelected,
      branchId,
    );
    setProductToppings(toppingsCopy);
    const currentTotalPriceTopping = totalPriceTopping + price * quantity;
    setTotalPriceTopping(currentTotalPriceTopping);
    handleTotalOfAmount(toppingsCopy, calculateValue, currentTotalPriceTopping);
    ///Check if has promotion include topping
    checkPromotionIncludeTopping(productDetail, currentTotalPriceTopping);
    setPromotionOfProductPriceApplied(calculateValue?.promotions);
  };

  const onChangeSize = async (e) => {
    const productPrice = productPrices?.find((productPrice) => productPrice === e.target.value);

    setProductPriceSelected(productPrice);
    setOldProductPriceSelected(productPriceSelected);
    setIsChangeSizeProduct(true);
    setProductPrice(productPrice?.priceValue);
    setOriginalPrice(productPrice?.originalPrice);
    ///Calculate discount price, percentage
    calculateDiscountPricePercentage(
      productPrice?.flashSaleId,
      productPrice?.isApplyPromotion,
      productPrice?.isDiscountPercent,
      productPrice?.discountValue,
      productPrice?.priceValue,
      productPrice?.originalPrice,
    );

    ///Check IncludedTopping
    getToppingsInitData(productToppings, productPrice?.isIncludedTopping, productDetail, productPrice);
  };

  useEffect(() => {
    if (productPriceSelected && Object.keys(productPriceSelected).length && !isInitData) {
      CheckProductPriceIdOutOfStock(productPriceSelected, branchAddress?.id, true);
    }
  }, [productPriceSelected]);

  async function CheckProductPriceIdOutOfStock(productPriceSelected, branchId, isChangeSize) {
    let verifyOutOfStock = await checkOutOfStockWhenUpdateCart(
      false,
      branchId,
      productPriceSelected,
      quantityProduct,
      isChangeSizeProduct ? oldProductPriceSelected : null,
      isChangeSizeProduct ? initCurrentIndex : null,
    );
    // check outOfStock
    if (verifyOutOfStock) {
      setIsOutOfStock(true);
      if (!isChangeSize) {
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
      }
    } else {
      setIsOutOfStock(false);
    }
  }

  const handleChangeSize = async () => {
    const calculateValue = await getDataCalculatePrice(
      productDetail,
      productToppings,
      quantityProduct,
      productPriceSelected,
      branchId,
    );
    handleTotalOfAmount(productToppings, calculateValue, totalPriceTopping);
    setPromotionValue(productPriceSelected?.promotionTag);
    setPromotionOfProductPriceApplied(calculateValue?.promotions);
  };

  const onChangeOptions = (e, index) => {
    const optionsSelectedCopy = [...optionsSelected];
    optionsSelectedCopy.splice(index, 1, e.target.value);
    setOptionsSelected(optionsSelectedCopy);
  };

  let styleBackground = {};
  if (productDetail?.backgroundType === backgroundTypeEnum.Color) {
    styleBackground = {
      backgroundColor: productDetail?.backgroundColor,
    };
  } else if (productDetail?.backgroundType === backgroundTypeEnum.Image) {
    styleBackground = {
      backgroundImage: `url(${productDetail?.backgroundImage})`,
      backgroundAttachment: "initial",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    };
  }

  const styleTitle = {
    color: colorGroup?.titleColor,
  };

  const styleTitleForPrice = {
    display: "flex",
    marginTop: "12px",
    alignItems: "center",
  };

  const styleText = {
    color: colorGroup?.textColor,
  };

  const styleButton = {
    color: colorGroup?.buttonTextColor,
    backgroundColor: colorGroup?.buttonBackgroundColor,
  };

  //#region Add to cart
  const mappingDataOptions = (options) => {
    const newOptions = options?.map((o) => ({
      id: o?.optionId,
      name: o?.optionName,
      isSetDefault: o?.isSetDefault,
      optionLevelId: o?.id,
      optionLevelName: o?.name,
    }));
    return newOptions;
  };

  const addProductToCart = async () => {
    //Verify Out Of Stock
    if (!isCombo) {
      const cartData = JSON.parse(getStorage(localStorageKeys.STORE_CART));
      const outOfStockIndices = cartData?.reduce((acc, item, index) => {
        if (item.isOutOfStock) {
          acc.push(index);
        }
        return acc;
      }, []);
      let verifyOutOfStock = await checkOutOfStockAllProductWhenUpdateCart(
        branchAddress?.id,
        cartData,
        initCurrentIndex,
        quantityProduct,
        outOfStockIndices,
        true,
        productPriceSelected,
      );
      // Kiểm tra xem outOfStock
      if (verifyOutOfStock) {
        const notificationDialog = {
          isShow: true,
          content: translatedData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        return;
      }
    }

    const _productPrice = { ...productPriceSelected };
    _productPrice.totalOfToppingPrice = totalPriceTopping;
    _productPrice.totalOfToppingOriginalPrice = totalPriceTopping;
    const product = {
      isCombo: false,
      id: productDetail?.id,
      name: productDetail?.name,
      thumbnail: productDetail?.thumbnail,
      notes: messagesForStore,
      productPrice: _productPrice,
      quantity: quantityProduct,
      options: mappingDataOptions(optionsSelected),
      toppings: productToppings,
      dataDetails: dataDetails,
      isFlashSale: productDetail?.isFlashSale,
    };
    updateStoreCart(product);
  };

  const updateStoreCart = (product) => {
    if (isPOS) {
      let posCartItemsNew = [];
      let posCartItems = reduxService.getPOSCartItems();
      if (checkNonEmptyArray(posCartItems)) {
        posCartItemsNew = updateProducts(product, posCartItems);
      } else {
        posCartItemsNew.push(product);
      }
      posCartService.verifyAndUpdateCart(posCartItemsNew);

      // If currentIndex === -1 is Add New
      if (currentIndex === -1) {
        Toast.show({
          messageType: "success",
          message: t("addCartItemToastMessage", "Sản phẩm đã được thêm vào giỏ hàng thành công"),
          icon: <CheckCircleIcon />,
          placement: "top",
          duration: 3,
          className: "toast-message-add-to-cart-theme1",
        });
      } else {
        Toast.show({
          messageType: "success",
          message: t("updateCartItemToastMessage", "Món ăn đã được cập nhật thành công"),
          icon: <CheckCircleIcon />,
          placement: "top",
          duration: 3,
          className: "toast-message-add-to-cart-theme1",
        });
      }
    } else {
      const storeCart = getStorage(localStorageKeys.STORE_CART);
      let objectStoreCart = JSON.parse(storeCart);
      let storeCartNew = [];
      if (objectStoreCart) {
        storeCartNew = updateProducts(product, objectStoreCart);
      } else {
        storeCartNew.push(product);
      }
      dispatch(setCartItems(storeCartNew));
      shoppingCartService.setStoreCartLocalStorage(storeCartNew);
      setStorage(localStorageKeys.STORE_CART, JSON.stringify(storeCartNew));
      setCurrentCartItems([...storeCartNew]);
      if (calculateShoppingCart) {
        calculateShoppingCart();
      }
    }

    onCancel();
  };

  const updateProducts = (product, productList) => {
    if (productList) {
      // If currentIndex === -1 is Add New
      if (currentIndex === -1) {
        productList.push(product);
      } else if (currentIndex >= 0) {
        const currentProduct = productList?.find((_, i) => i === currentIndex);
        productList?.splice(productList?.indexOf(currentProduct), 1, product);
      }
      return productList;
      // }
    } else {
      return [product];
    }
  };

  const getPriceToppingProduct = (productDetail, toppings) => {
    const productToppings = toppings;
    const isHasPromotion = productDetail?.isHasPromotion;
    const isIncludedTopping = productDetail?.isIncludedTopping;
    const isFlashSale = productDetail?.isFlashSale;
    const isDiscountPercent = productDetail?.isDiscountPercent;
    const maximumDiscountAmount = productDetail?.maximumDiscountAmount;
    if (isHasPromotion && isIncludedTopping && !isFlashSale) {
      if (maximumDiscountAmount === 0) {
        if (isDiscountPercent) {
          productToppings?.forEach((item) => {
            item.priceValue =
              item?.originalPrice === item?.priceValue
                ? (item?.priceValue * (100 - productDetail?.discountValue)) / 100
                : item.priceValue;
          });
        } else {
          productToppings?.forEach((item) => {
            item.originalPrice =
              item.originalPrice === item.priceValue
                ? item?.priceValue - productDetail?.discountValue
                : item.originalPrice;
          });
        }
      } else {
        if (isDiscountPercent) {
          productToppings?.forEach((item) => {
            item.priceValueInMaxDiscount = item?.priceValue - (item?.priceValue / 100) * productDetail?.discountValue;
          });
        }
      }
      setProductToppings(productToppings);
    }
  };

  const getPriceToppingProductFlashSale = (productDetail, toppings, productPrice) => {
    const isFlashSale = productDetail?.isFlashSale;
    const isIncludedTopping = productDetail?.isIncludedTopping;
    if (productPrice?.flashSaleId && productPrice?.isIncludedTopping) {
      productToppings?.forEach((item) => {
        delete item?.priceValueInMaxDiscount;
        if (item?.originalPrice >= item?.priceValue) {
          item.priceValue = 0;
        }
      });
      setProductToppings(productToppings);
    }
    // case: The product has flash sale 1 size, the other size has no flash sale
    else if (productPrice !== undefined && !productPrice?.isIncludedTopping && isFlashSale) {
      if (!productPrice?.flashSaleId) {
        if (!isIncludedTopping) {
          productToppings?.forEach((item) => {
            item.priceValue = item?.originalPrice;
          });
        } else {
          handelToppingInPromotionAndFlashSale(
            productDetail?.maximumDiscountAmount,
            productDetail?.isDiscountPercent,
            productDetail?.discountValue,
          );
        }
      } else {
        productToppings?.forEach((item) => {
          delete item?.priceValueInMaxDiscount;
          item.priceValue = item?.originalPrice;
        });
      }
      setProductToppings(productToppings);
    }
  };

  const handelToppingInPromotionAndFlashSale = (maximumDiscountAmount, isDiscountPercent, discountValue) => {
    if (maximumDiscountAmount === 0) {
      if (isDiscountPercent) {
        productToppings?.forEach((item) => {
          item.priceValue = (item?.originalPrice * (100 - discountValue)) / 100;
        });
      } else {
        productToppings?.forEach((item) => {
          item.priceValue = item?.originalPrice ?? item?.priceValue;
        });
      }
    } else {
      if (isDiscountPercent) {
        productToppings?.forEach((item) => {
          item.priceValueInMaxDiscount = item?.originalPrice - (item?.originalPrice / 100) * discountValue;
        });
      } else {
        productToppings?.forEach((item) => {
          item.priceValue = item?.originalPrice ?? item?.priceValue;
        });
      }
    }
  };

  const handleTotalOfAmount = async (productToppings, calculateValue, totalPriceTopping) => {
    const isFlashSaleToppingIncluded = isFlashSaleIncludedTopping();
    if (quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0) {
      const priceAfterMaximumLimit = await calculateAmountAfterMaximumLimit(
        productToppings,
        quantityProduct - productPriceSelected?.maximumLimit,
      );
      if (isFlashSaleToppingIncluded) {
        setTotalOfAmount(
          calculateTotalOfAmountHaveMaximumLimit(
            productPriceSelected?.maximumLimit,
            quantityProduct,
            priceAfterMaximumLimit.sellingPrice,
            productPriceSelected?.priceValue,
          ),
        );
      } else {
        setTotalOfAmount(
          totalPriceTopping * productPriceSelected?.maximumLimit +
            calculateTotalOfAmountHaveMaximumLimit(
              productPriceSelected?.maximumLimit,
              quantityProduct,
              priceAfterMaximumLimit.sellingPrice,
              productPriceSelected?.priceValue,
            ),
        );
      }
    } else {
      setTotalOfAmount(calculateValue?.sellingPrice);
    }

    const totalOriginalPrice = isFlashSaleToppingIncluded
      ? (calculateValue?.originalPrice || 0) + (calculateValue?.totalPriceOfTopping || 0)
      : calculateValue?.originalPrice || 0;
    setTotalOriginalPrice(totalOriginalPrice);
  };

  const calculateAmountAfterMaximumLimit = async (productToppings, quantity) => {
    let productTopping = productToppings.filter((a) => a.quantity >= 1) ?? [];
    let toppingsData = [];
    for (const item of productTopping) {
      let toppingItem = {
        ...item,
        toppingId: item?.toppingId ?? item?.id,
        quantity: item?.quantity,
      };

      toppingsData.push(toppingItem);
    }
    const dataSubmit = {
      productId: productDetail?.id,
      productPriceId: productPriceSelected?.id,
      productCategoryId: productDetail?.productCategoryId,
      isCombo: false,
      quantity: quantity,
      toppings: toppingsData,
      comboTypeId: "",
      comboPricingId: "",
      branchId: branchId,
      isProductAfterMaximumLimit: true,
      isCheckFlashSale: Boolean(productPriceSelected?.flashSaleId),
    };

    let dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    return dataResult.data;
  };

  //#endregion

  const renderSize = () => {
    return (
      <>
        {productPrices?.length > 1 && (
          <div className="selection">
            <span className="header">{translatedData.chooseSize}</span>
            <ProductDetailProductPriceComponent
              productPrices={productPrices}
              productPriceDefault={productPriceSelected}
              onChange={onChangeSize}
            />
          </div>
        )}
      </>
    );
  };

  const renderOptions = () => {
    return (
      <>
        {productOptions?.length > 0 && (
          <>
            {productOptions?.map((option, index) => {
              defaultActiveKey.push(option?.id);
              return (
                <div className="selection">
                  <span className="header">{option?.name}</span>
                  <ProductDetailOptionComponent
                    option={option}
                    onChangeOptions={(e) => onChangeOptions(e, index)}
                    defaultValue={optionsSelected[index]}
                  />
                </div>
              );
            })}
          </>
        )}
      </>
    );
  };

  const handleConfirmNotify = () => {
    let productPriceUpdate = Object.assign(
      {},
      productDetail?.productPrices[productDetail?.defaultProductPriceIndex ?? 0],
    );
    productPriceUpdate.priceValue = productPriceUpdate.originalPrice;
    productPriceUpdate.isApplyPromotion = false;
    productPriceUpdate.flashSaleId = undefined;

    const _productPrice = { ...productPriceUpdate };
    _productPrice.totalOfToppingPrice = totalPriceTopping;
    const product = {
      isCombo: false,
      id: productDetail?.id,
      name: productDetail?.name,
      thumbnail: productDetail?.thumbnail,
      notes: messagesForStore,
      productPrice: _productPrice,
      quantity: quantityProduct,
      options: mappingDataOptions(optionsSelected),
      toppings: productToppings,
      dataDetails: dataDetails,
    };
    updateStoreCart(product);
  };

  const renderTopping = () => {
    return (
      <>
        {productToppings?.length > 0 && (
          <div className="selection">
            <span className="header">{translatedData.addTopping}</span>
            {productToppings?.map((topping, index) => {
              return (
                <ProductDetailToppingComponent
                  maximumQuantityCustom={maximumQuantity}
                  topping={topping}
                  updateQuantityTopping={(quantity, priceValue) => updateQuantityTopping(index, quantity, priceValue)}
                  maximumLimit={productPriceSelected?.maximumLimit}
                  quantityProduct={quantityProduct}
                />
              );
            })}
          </div>
        )}
      </>
    );
  };

  const renderTotalOfAmount = () => {
    if (quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0) {
      return formatTextNumber(totalOfAmount);
    } else {
      const isFlashSale = productDetail?.isFlashSale;
      if (isFlashSale) {
        if (isFlashSaleIncludedTopping()) {
          let totalPriceTopping = 0;
          productToppings?.map((topping) => {
            let toppingValue = topping.priceValue;
            totalPriceTopping += toppingValue * topping.quantity;
          });
          return formatTextNumber(productPrice * quantityProduct + totalPriceTopping);
        } else if (
          productPriceSelected !== undefined &&
          !productPriceSelected?.flashSaleId &&
          !productPriceSelected?.isIncludedTopping
        ) {
          return formatTextNumber(totalOfAmount);
        } else {
          return formatTextNumber((totalPriceTopping + productPrice - toppingDiscountPrice) * quantityProduct);
        }
      } else {
        return formatTextNumber(totalOfAmount);
      }
    }
  };
  return (
    <StyledProductEditDetail config={colorGroup} colorConfig={colorGroup}>
      <div style={{ fontFamily: fontFamily ?? "inherit" }}>
        {!isMobile && <CloseBranchContainer branchId={isPOS ? branchIdPos : branchAddress?.id} />}
        {isCombo ? (
          <EditOrderComboDialogComponent
            currentIndex={currentIndex}
            comboDetailData={{ ...comboData }}
            onCancel={() => onCancel()}
            setCurrentCartItems={(cartItems) => setCurrentCartItems(cartItems)}
            isPOS={isPOS}
            branchIdPos={branchIdPos}
            colorGroup={colorGroup}
            calculateShoppingCart={calculateShoppingCart}
            fontFamily={fontFamily}
          />
        ) : (
          <div
            className="edit-product-cart-detail-container"
            id={theme1ElementRightId.Checkout}
            style={styleBackground}
          >
            <Row className="product-detail-content">
              <Col span={24} xs={24} sm={24} md={24} lg={24} xl={10} xxl={10} className="product-detail-content-left">
                <div className="product-detail-image">
                  {
                    <ProductDetailImagesComponent
                      images={[
                        {
                          imageUrl:
                            productDetail?.thumbnail && productDetail?.thumbnail !== ""
                              ? productDetail.thumbnail
                              : productDefault,
                          imageZoomOutUrl:
                            productDetail?.thumbnail && productDetail?.thumbnail !== ""
                              ? productDetail.thumbnail
                              : productDefaultImage,
                        },
                      ]}
                      isOutOfStock={isOutOfStock}
                      outOfStock={translatedData.outOfStock}
                      isPromotion={isPromotion}
                      promotion={promotionValue}
                    />
                  }
                </div>
              </Col>
              <Col span={24} xs={24} sm={24} md={24} lg={24} xl={14} xxl={14} className="product-detail-content-right">
                <Row id="popup-choose-options">
                  {isMobile && <CloseBranchContainer branchId={isPOS ? branchIdPos : branchAddress?.id} />}
                  <Col xs={24} className="choose-options-header">
                    <CloseIcon onClick={onCancel} />
                  </Col>
                  <Col xs={24} className="product-detail-title h3" style={styleTitle}>
                    {productDetail?.name}
                  </Col>
                  <Col xs={24} className="product-detail-title h3" style={styleTitle}>
                    <ProductDetailRateDescriptionComponent
                      title={translatedData.description}
                      content={productDetail?.description}
                      numberOfReview={productDetail?.numberOfReview}
                      styleTitle={styleTitle}
                      classNameRate={"product-detail-rate"}
                      defaultValueRate={productDetail?.rating}
                      styleContent={styleText}
                    />
                  </Col>
                  {productPriceSelected?.promotionEndTime && (
                    <Col xs={24}>
                      <FnbFlashSaleBannerComponent data={productPriceSelected} endAtZero />
                    </Col>
                  )}
                  {quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0 && (
                    <MaximumLimitFlashSaleNotifyComponent maximumLimit={productPriceSelected?.maximumLimit} />
                  )}

                  {promotionsOfProductPriceApplied?.length > 0 && (
                    <NameAndValuePopoverStoreWeb
                      data={mappingDiscountApplyToPromotionPopupData(promotionsOfProductPriceApplied)}
                      className="popover-promotion-product-detail-theme1"
                    />
                  )}

                  <Col xs={24}>
                    <Row>
                      <Col span={12} xs={13} sm={16} md={16} lg={16} xl={16} xxl={16} style={styleTitleForPrice}>
                        <span className="product-price">{formatTextNumber(productPrice < 0 ? 0 : productPrice)}đ</span>
                        {isPromotion && productPrice < originalPrice && (
                          <span className="product-original-price">{formatTextNumber(originalPrice)}đ</span>
                        )}
                        <div span={8} xs={11} sm={8} md={8} lg={8} xl={8} xxl={8} className="modify-quantity">
                          <Button
                            icon={<PlusOutlined />}
                            className="btn-increase"
                            disabled={quantityProduct >= maximumQuantity || isOutOfStock}
                            onClick={() => updateQuantityProduct(quantityProduct + 1, true)}
                          ></Button>
                          <span className="quantity-product">{quantityProduct}</span>
                          <Button
                            icon={<MinusOutlined />}
                            className="btn-reduce"
                            disabled={quantityProduct <= 1 ? true : false}
                            onClick={() => updateQuantityProduct(quantityProduct - 1, false)}
                          ></Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24} xs={24} className="note">
                    <div className="note-icon-theme1">
                      <NoteIcon className="note-icon" />
                      <div className="border"></div>
                    </div>
                    <div className="input-text-area-theme1">
                      <TextArea
                        className="product-detail-input"
                        placeholder={translatedData.leaveAMessageForTheStore}
                        onChange={(e) => setMessagesForStore(e.target.value)}
                        maxLength={100}
                        value={messagesForStore}
                        autoSize
                      />
                    </div>
                  </Col>
                  <Col span={24} xs={24} className="options">
                    <div className="product-detail-collapse">
                      {renderSize()}
                      {renderOptions()}
                      {renderTopping()}
                    </div>
                  </Col>
                  <Col xs={24}>
                    <div className="quantity-responsive">
                      <div className="text-quanity">
                        <span>{translatedData.quantity}</span>
                      </div>
                      <div className="modify-quantity-for-responsive">
                        <Button
                          icon={<PlusOutlined className="btn-quantity" />}
                          className="btn-increase"
                          disabled={isOutOfStock || quantityProduct >= maximumQuantity}
                          onClick={() => updateQuantityProduct(quantityProduct + 1, true)}
                        ></Button>
                        <span className="quantity-product">{quantityProduct}</span>
                        <Button
                          icon={<MinusOutlined className="btn-quantity" />}
                          className="btn-reduce"
                          disabled={quantityProduct <= 1 ? true : false}
                          onClick={() => updateQuantityProduct(quantityProduct - 1, false)}
                        ></Button>
                      </div>
                    </div>
                    <div className="button-background">
                      <Button
                        disabled={!isUpdateButtonVisible || isOutOfStock}
                        className={`btn-product-detail btn-submit ${isOutOfStock ? "out-of-stock" : ""}`}
                        style={styleButton}
                        onClick={addProductToCart}
                      >
                        <div className="btn-add-to-cart-text" style={{ color: colorGroup?.buttonTextColor }}>
                          {isOutOfStock && translatedData.outOfStock}
                        </div>
                        {!isOutOfStock && (
                          <div className="btn-add-to-cart">
                            <div className="btn-add-to-cart-text" style={{ color: colorGroup?.buttonTextColor }}>
                              {currentIndex === -1 ? translatedData.addProductToCart : translatedData.updateCart}
                            </div>
                            <div>
                              <div className="btn-add-to-cart-price" style={{ color: colorGroup?.buttonTextColor }}>
                                {renderTotalOfAmount() < 0 ? 0 : renderTotalOfAmount()}đ
                              </div>
                              {renderTotalOfAmount() !== formatTextNumber(totalOriginalPrice) && (
                                <div
                                  className="btn-add-to-cart-original-price"
                                  style={{ color: colorGroup?.buttonTextColor }}
                                >
                                  {formatTextNumber(totalOriginalPrice)}đ
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </StyledProductEditDetail>
  );
});
