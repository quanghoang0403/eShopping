import { Button, Col, Collapse, Image, Input, Row } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { EnumVerifyProductPromotionType } from "../../../constants/enums";
import flashSaleDataService from "../../../data-services/flash-sale-data.service";
import productDataService from "../../../data-services/product-data.service";
import { setCartItems, setNotificationDialog } from "../../../modules/session/session.actions";
import { setToastMessageUpdateToCart } from "../../../modules/toast-message/toast-message.actions";
import {
  checkOutOfStockAllProductWhenUpdateCart,
  checkOutOfStockWhenUpdateCart,
} from "../../../services/material/check-out-of-stock.service";
import orderService from "../../../services/orders/order-service";
import posCartService from "../../../services/pos/pos-cart.services";
import reduxService from "../../../services/redux.services";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import {
  calculatePercentage,
  checkNonEmptyArray,
  formatTextNumber,
  mappingDiscountApplyToPromotionPopupData,
} from "../../../utils/helpers";
import { HttpStatusCode } from "../../../utils/http-common";
import { getStorage, localStorageKeys, setStorage } from "../../../utils/localStorage.helpers";
import { CheckoutIcon, DecreaseQuantityProductIcon, IncreaseQuantityProductIcon } from "../../assets/icons.constants";
import { ReactComponent as NoteIconBlur } from "../../assets/icons/note-icon-blur.svg";
import { ReactComponent as NoteIcon } from "../../assets/icons/note-icon.svg";
import productImageDefault from "../../assets/images/product-img-default.png";
import NotificationDialog from "../../components/notification-dialog/notification-dialog.component";
import ProductDetailImagesComponent from "../../components/product-detail-images-component/product-detail-images.component";
import { EnumFlashSaleResponseCode } from "../../constants/enums";
import PageType from "../../constants/page-type.constants";
import { CloseBranchContainer } from "../../containers/close-branch/close-branch.container";
import { productDetailDefault } from "../../pages/product-detail/default-data";
import FnbFlashSaleBannerComponent from "../fnb-flash-sale-banner/fnb-flash-sale-banner.component";
import { MaximumLimitFlashSaleNotifyComponent } from "../maximum-limit-flash-sale-notify/maximum-limit-flash-sale-notify.component";
import NameAndValuePopoverStoreWeb from "../name-and-value-popup-store-web/NameAndValuePopoverStoreWeb";
import OutOfStockLabelBoxComponent from "../out-of-stock-label-box/out-of-stock-label-box.component";
import ProductDetailDescriptionComponent from "../product-detail-description-component/product-detail-description.component";
import { ProductDetailOptionComponent } from "../product-detail-option.component/product-detail-option.component";
import ProductDetailProductPriceComponent from "../product-detail-product-price.component/product-detail-product-price.component";
import ProductDetailRateComponent from "../product-detail-rate-component/product-detail-rate.component";
import { ProductDetailToppingComponent } from "../product-detail-topping.component/product-detail-topping.component";
import EditOrderComboComponent from "./edit-order-combo.component";
import "./edit-order-item.style.scss";
export default function EditOrderItem(props) {
  const {
    onCancel,
    setCurrentCartItems,
    dataEdit,
    indexDefault, // If indexDefault == -1 then it will see details and add new
    stateConfig,
    calculateShoppingCart,
    isPos = false,
    branchIdPos,
    platformId,
    fontFamily,
  } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [isInitData, setIsInitData] = useState(true);
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
  const [totalOriginalPriceProduct, setTotalOriginalPriceProduct] = useState(0);
  const [messagesForStore, setMessagesForStore] = useState("");
  const [dataDetails, setDataDetails] = useState(null);
  const [isCombo, setIsCombo] = useState(null);
  const [comboData, setComboData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isDiscountPercent, setIsDiscountPercent] = useState(false);
  const [thumbnail, setThumbnail] = useState([]);
  const [colorGroupBody, setColorGroupBody] = useState({});
  const [totalPriceOfProduct, setTotalPriceOfProduct] = useState(0);
  const [priceAfterDiscountDefault, setPriceAfterDiscountDefault] = useState(0);
  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const [maximumLimitFlashSale, setMaximumLimitFlashSale] = useState(0);
  const [totalOfAmount, setTotalOfAmount] = useState([]);
  const [isFlashSaleAfterMaximumLimit, setFlashSaleAfterMaximumLimit] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [promotionTag, setPromotionTag] = useState("");
  const [promotionsOfProductPriceApplied, setPromotionOfProductPriceApplied] = useState([]);

  const maximumQuantity = 999;
  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const numberColBtnAdd = isMaxWidth500 ? 18 : 24;
  const branchAddress = isPos ? { id: branchIdPos } : reduxService.getAllData()?.deliveryAddress?.branchAddress;
  const cartItems = useSelector((state) => state.session.cartItems);
  const { TextArea } = Input;

  const translatedData = {
    noteAMessageForTheStore: t("storeWebPage.editOrderItem.noteAMessageForTheStore"),
    description: t("storeWebPage.generalUse.description"),
    maybeYouLike: t("storeWebPage.generalUse.maybeYouLike"),
    review: t("storeWebPage.generalUse.review", "Review"),
    thereAreCurrentlyNoReviews: t("storeWebPage.generalUse.thereAreCurrentlyNoReviews"),
    chooseOptions: t("storeWebPage.productDetailPage.chooseOptions"),
    updateCart: t("storeWebPage.generalUse.updateCart", "Update the cart"),
    updateCartMobie: t("storeWebPage.editOrderItem.updateCart", "Update the cart"),
    btnAddToCart: t("storeWebPage.productDetailPage.addProductToCart"),
    notYetReview: t("storeWebPage.productDetailPage.notReview"),
    reviewTitle: t("storeWebPage.productDetailPage.reviewTitle"),
    notePlaceholder: t("theme.checkout.note"),
    selectSize: t("storeWebPage.editOrderItem.selectSize"),
    selectOption: t("storeWebPage.editOrderItem.selectOption"),
    selectTopping: t("storeWebPage.editOrderItem.selectTopping"),
    okay: t("storeWebPage.generalUse.okay"),
    notification: t("storeWebPage.generalUse.notification"),
    flashSaleEndNotification: t("storeWebPage.flashSale.flashSaleEndNotification"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    cancel: t("storeWebPage.editOrderItem.cancel", "Cancel"),
  };
  useEffect(() => {
    initBackgroundBody();
    initData();
  }, []);

  useEffect(() => {
    initData();
  }, [dataEdit]);

  //#region Checkout of stock
  useEffect(() => {
    if (!isCombo && productPriceSelected) {
      checkOutOfStock(productPriceSelected, branchAddress?.id, quantityProduct, true, true);
    }
  }, [productPriceSelected]);

  async function checkOutOfStock(productPriceSelected, branchId, quantity, isInitData, isChangeSize) {
    const verifyOutOfStock = await checkOutOfStockWhenUpdateCart(
      false,
      branchId,
      productPriceSelected,
      quantity,
      isChangeSizeProduct ? oldProductPriceSelected : null,
      isChangeSizeProduct ? currentIndex : null,
    );
    if (verifyOutOfStock) {
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
      content: translatedData.textOutOfStock,
      buttonText: translatedData.iGotIt,
    };
    dispatch(setNotificationDialog(notificationDialog));
  }
  //#endregion

  useEffect(() => {
    if (window.updateQuantityProduct) {
      clearTimeout(window.updateQuantityProduct);
    }
    window.updateQuantityProduct = setTimeout(async () => {
      if (quantityProduct >= 1 && quantityProduct <= maximumQuantity && !isInitData) {
        let priceValue = 0;
        let productTopping = productToppings?.filter((a) => a.quantity >= 1);
        let calculateValue = await getDataCalculatePrice(
          productDetail,
          productTopping,
          quantityProduct,
          productPriceSelected,
          branchAddress?.id,
        );
        priceValue = calculateValue?.sellingPrice;

        /// Handle total of amount
        handleTotalOfAmount(productToppings, calculateValue, priceValue);
        setPromotionOfProductPriceApplied(calculateValue?.promotions);
      }
    }, 500);
  }, [quantityProduct]);

  useEffect(() => {
    const isFlashSale = productDetail?.isFlashSale;
    const isIncludedTopping = productDetail?.isIncludedTopping;
    if (isFlashSaleIncludedTopping()) {
      productToppings?.forEach((item) => {
        delete item?.priceValueInMaxDiscount;
        if (item.originalPrice >= item?.priceValue) {
          item.priceValue = 0;
        }
      });
    } else if (productPriceSelected !== undefined && !productPriceSelected?.isIncludedTopping && isFlashSale) {
      if (!productPriceSelected?.flashSaleId) {
        if (!isIncludedTopping) {
          productToppings?.forEach((item) => {
            if (item.originalPrice !== item?.priceValue) {
              item.priceValue = item?.originalPrice;
            }
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
    }
    setProductToppings(productToppings);
  }, [productPriceSelected]);

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

  const initBackgroundBody = () => {
    const { pages, general } = stateConfig;
    const configProductDetail = pages?.find((x) => x.id === PageType.PRODUCT_DETAIL)?.config?.productDetail;

    let colorGroup = general?.color?.colorGroups?.find((a) => a.id === configProductDetail?.colorGroupId);

    setColorGroupBody({ ...colorGroup });
  };

  const initData = () => {
    setCurrentIndex(indexDefault);
    if (dataEdit) {
      setIsCombo(dataEdit.isCombo);
      if (dataEdit.isCombo) {
        setComboData(dataEdit);
      } else if (dataEdit?.id) {
        let productData = {};
        let _promotionId = "";
        let _promotionType = EnumVerifyProductPromotionType.NotPromotion;
        if (dataEdit?.isFlashSale) {
          _promotionType = EnumVerifyProductPromotionType.FlashSale;
          _promotionId = dataEdit?.productPrice?.flashSaleId;
        } else if (dataEdit?.productPrice?.isApplyPromotion) {
          _promotionType = EnumVerifyProductPromotionType.Discount;
          _promotionId = dataEdit?.productPrice?.promotionId;
        }
        orderService
          .verifyProduct(
            dataEdit?.id,
            branchAddress,
            _promotionId,
            _promotionType,
            dataEdit?.productPrice?.id,
            platformId,
            !isPos,
          )
          .then((response) => {
            if (response?.status === HttpStatusCode.Ok) {
              productData.product = response?.data?.product;
              productData.promotions = response?.data?.product?.promotions;
              dataEdit.dataDetails = productData;
              getProductData(dataEdit);
            } else {
              getProductData(dataEdit);
            }
          })
          .catch((response) => {
            // To do
          });
      } else {
        getProductData(productDetailDefault);
      }
    }
  };

  /// Handle caculateTotalOfAmountHaveMaximumLimit
  const calculateTotalOfAmountHaveMaximumLimit = (quantityHaveFlashSale, quantity, originalPrice, priceValue) => {
    return quantityHaveFlashSale * priceValue + originalPrice;
  };

  const isFlashSaleIncludedTopping = () => {
    return productPriceSelected?.flashSaleId && productPriceSelected?.isIncludedTopping;
  };

  const handleTotalOfAmount = async (productToppings, calculateValue, priceValue) => {
    let totalPriceOfTopping = productToppings?.reduce(
      (totalTopping, currentTopping) => totalTopping + currentTopping?.originalPrice * currentTopping?.quantity,
      0,
    );
    // Is Flash Sale
    if (quantityProduct > maximumLimitFlashSale && maximumLimitFlashSale > 0) {
      const priceAfterMaximumLimit = await calculateAmountAfterMaximumLimit(
        productToppings,
        quantityProduct - maximumLimitFlashSale,
      );
      if (isFlashSaleIncludedTopping()) {
        setTotalPriceOfProduct(
          calculateTotalOfAmountHaveMaximumLimit(
            maximumLimitFlashSale,
            quantityProduct,
            priceAfterMaximumLimit.sellingPrice,
            calculateValue?.sellingPriceNotYetHaveQuantity,
          ),
        );
      } else {
        setTotalPriceOfProduct(
          totalPriceOfTopping * maximumLimitFlashSale +
            calculateTotalOfAmountHaveMaximumLimit(
              maximumLimitFlashSale,
              quantityProduct,
              priceAfterMaximumLimit.sellingPrice,
              calculateValue?.sellingPriceNotYetHaveQuantity,
            ),
        );
      }
    } else {
      if (productPriceSelected?.flashSaleId) {
        setTotalPriceOfProduct(priceValue + totalPriceOfTopping * quantityProduct);
      } else {
        // priceValue = ( price + topping ) * quantity
        setTotalPriceOfProduct(priceValue);
      }
    }
    setTotalOfAmount(calculateValue.sellingPrice);
    const isFlashSaleToppingIncluded = isFlashSaleIncludedTopping();
    const totalOriginalPrice = isFlashSaleToppingIncluded
      ? calculateValue?.originalPrice + calculateValue?.totalPriceOfTopping
      : calculateValue?.originalPrice;
    setTotalOriginalPriceProduct(totalOriginalPrice);
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
      branchId: branchAddress?.id,
      isProductAfterMaximumLimit: true,
      isCheckFlashSale: Boolean(productPriceSelected?.flashSaleId),
    };

    let dataResult = await productDataService.calculatingPriceOfTheProduct(dataSubmit);
    return dataResult.data;
  };

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

  const getProductData = async (data) => {
    await setDataDetails(data?.dataDetails);
    const productDetail = data?.dataDetails?.product?.productDetail;
    if (productDetail) {
      const { productOptions, productPrices } = productDetail;
      setProductDetail(productDetail);
      setProductOptions(productOptions);
      setProductToppings(data?.dataDetails?.product?.productToppings);
      setProductPrices(productPrices);
      setIsDiscountPercent(productDetail?.isDiscountPercent);

      ///Data changed

      const { quantity, productPrice, toppings, options, branchId } = data;
      setOriginalPrice(productPrice?.originalPrice);
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
      getToppingsInitData(
        toppingsMapping,
        productDetail?.isFlashSale ? productPrice?.isIncludedTopping : productDetail?.isIncludedTopping,
        data?.dataDetails?.product,
      );
      getSizeInitData(productPrice?.id, productPrices);
      getOptionsInitData(options, productOptions);
      setMessagesForStore(data?.notes);
      setThumbnail([{ imageUrl: productDetail?.thumbnail }]);

      setPriceAfterDiscountDefault(productPrice?.priceValue);
      // The main price of the product.
      // This price will reset when the user handle add, edit or delete options of the current product
      const sellingPrice = (productPrice?.priceValue + productPrice?.totalOfToppingPrice) * quantity;
      setTotalPriceOfProduct(sellingPrice);
    }
    if (!data?.productPrice?.flashSaleId) {
      setFlashSaleAfterMaximumLimit(true);
    }
    setIsInitData(false);
  };

  const getToppingsInitData = (toppings, isIncludedTopping, product) => {
    let toppingPrice = 0;
    setProductToppings(toppings);
    getPriceToppingProduct(product, toppings);
    toppings?.map((topping) => {
      let toppingValue = isIncludedTopping === false ? topping.originalPrice : topping.priceValue;
      toppingPrice += toppingValue * topping.quantity;
    });
    setTotalPriceTopping(toppingPrice);
  };

  const getSizeInitData = (id, productPrices) => {
    const productPrice = productPrices?.find((productPrice) => productPrice?.id === id);
    setProductPriceSelected(productPrice);
    setProductPrice(productPrice?.priceValue);
    setOriginalPrice(productPrice?.originalPrice);
    setMaximumLimitFlashSale(productPrice?.maximumLimit);
    setPromotionTag(productPrice?.promotionTag);
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
    if (quantity >= 1 && quantity <= maximumQuantity) {
      const cartData = JSON.parse(getStorage(localStorageKeys.STORE_CART));
      const outOfStockIndices = cartData?.reduce((acc, item, index) => {
        if (item.isOutOfStock) {
          acc.push(index);
        }
        return acc;
      }, []);
      const isOutOfStock = await checkOutOfStockAllProductWhenUpdateCart(
        branchAddress?.id,
        cartData,
        currentIndex,
        quantity,
        outOfStockIndices,
        true,
        productPriceSelected,
      );
      if (isIncrease && isOutOfStock === true) {
        showNotificationOutOfStock();
        return;
      }

      setQuantityProduct(quantity);
      ///Check IncludedTopping
      if (quantity > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0) {
        getToppingsInitData(productToppings, false);
      } else {
        getToppingsInitData(productToppings, true);
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
      branchAddress?.id,
    );
    /// Handle total of amount
    handleTotalOfAmount(toppingsCopy, calculateValue, calculateValue?.sellingPrice);

    setProductToppings(toppingsCopy);
    setTotalPriceTopping(totalPriceTopping + price * quantity);
    setTotalOfAmount(calculateValue.sellingPrice);
    setPromotionOfProductPriceApplied(calculateValue?.promotions);
  };

  const onChangeSize = async (e) => {
    const productPrice = productPrices?.find((productPrice) => productPrice.id === e.target.value);
    setProductPriceSelected(productPrice);
    setOldProductPriceSelected(productPriceSelected);
    setIsChangeSizeProduct(true);
    ///Check IncludedTopping
    getToppingsInitData(productToppings, productPrice?.isIncludedTopping);
  };

  const handleChangeSize = async () => {
    const calculateValue = await getDataCalculatePrice(
      productDetail,
      productToppings,
      quantityProduct,
      productPriceSelected,
      branchAddress?.id,
    );
    /// Handle total of amount
    handleTotalOfAmount(productToppings, calculateValue, calculateValue?.sellingPrice);

    setProductPrice(productPriceSelected?.priceValue);
    setOriginalPrice(productPriceSelected?.originalPrice);
    setPriceAfterDiscountDefault(productPriceSelected.priceValue);
    setTotalOfAmount(calculateValue.sellingPrice);

    setPromotionTag(productPriceSelected?.promotionTag);
    setPromotionOfProductPriceApplied(calculateValue?.promotions);
  };

  useEffect(() => {
    if (productPriceSelected && Object.keys(productPriceSelected).length && !isInitData) {
      handleChangeSize();
    }
  }, [productPriceSelected]);

  const onChangeOptions = (e, index) => {
    const optionsSelectedCopy = [...optionsSelected];
    optionsSelectedCopy.splice(index, 1, e.target.value);
    setOptionsSelected(optionsSelectedCopy);
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

  const addProductToCart = () => {
    const product = {
      isCombo: false,
      id: productDetail?.id,
      name: productDetail?.name,
      thumbnail: productDetail?.thumbnail,
      notes: messagesForStore,
      productPrice: { ...productPriceSelected, totalOfToppingPrice: totalPriceTopping },
      quantity: quantityProduct,
      options: mappingDataOptions(optionsSelected),
      toppings: productToppings,
      dataDetails: dataDetails,
      branchId: branchAddress?.id,
      isFlashSale: productDetail?.isFlashSale,
    };
    updateStoreCart(product);
  };

  const updateStoreCart = (product) => {
    if (isPos) {
      let posCartItemsNew = [];
      let posCartItems = reduxService.getPOSCartItems();
      if (checkNonEmptyArray(posCartItems)) {
        posCartItemsNew = mergeProducts(product, posCartItems);
      } else {
        posCartItemsNew.push(product);
      }
      posCartService.verifyAndUpdateCart(posCartItemsNew);
    } else {
      const storeCart = getStorage(localStorageKeys.STORE_CART);
      let objectStoreCart = JSON.parse(storeCart);
      let storeCartNew = [];
      if (objectStoreCart) {
        storeCartNew = mergeProducts(product, objectStoreCart);
      } else {
        storeCartNew.push(product);
      }

      if (setCurrentCartItems) {
        setCurrentCartItems(storeCartNew); // push to props
      }
      dispatch(setCartItems(storeCartNew));
      setStorage(localStorageKeys.STORE_CART, JSON.stringify(storeCartNew));
      setStoreCart(storeCartNew);
    }
    if (calculateShoppingCart) {
      calculateShoppingCart();
    }
    onCancel();
  };

  const mergeProducts = (product, productList) => {
    if (productList) {
      // If index == -1 then it will see details and add new
      if (currentIndex === -1) {
        productList.push(product);
        return productList;
      } else if (currentIndex >= 0) {
        let index = productList.findIndex((productItem) => {
          return shoppingCartService.compareProduct(product, productItem);
        });
        if (index >= 0 && index !== currentIndex) {
          let productListNew = productList;
          productListNew[index].quantity += product?.quantity;
          const currentProduct = productList?.find((_, i) => i === currentIndex);
          productListNew?.splice(productList?.indexOf(currentProduct), 1);
          return productListNew;
        } else {
          if (currentIndex >= 0) {
            const currentProduct = productList?.find((_, i) => i === currentIndex);
            productList?.splice(productList?.indexOf(currentProduct), 1, product);
          }
          return productList;
        }
      }
    } else {
      return [product];
    }
  };

  const getPriceToppingProduct = (product, toppings) => {
    const productToppings = toppings;
    const isHasPromotion = product?.productDetail?.isHasPromotion;
    const isIncludedTopping = product?.productDetail?.isIncludedTopping;
    const isFlashSale = product?.productDetail?.isFlashSale;
    const isDiscountPercent = product?.productDetail?.isDiscountPercent;
    const maximumDiscountAmount = product?.productDetail?.maximumDiscountAmount;
    if (isHasPromotion && isIncludedTopping && !isFlashSale) {
      if (maximumDiscountAmount === 0) {
        if (isDiscountPercent) {
          productToppings?.forEach((item) => {
            item.priceValue = item?.originalPrice - (item?.originalPrice / 100) * product?.productDetail?.discountValue;
          });
        } else {
          productToppings?.forEach((item) => {
            item.priceValue =
              item?.originalPrice - product?.productDetail?.discountValue < 0
                ? 0
                : item?.originalPrice - product?.productDetail?.discountValue;
          });
        }
      } else {
        if (isDiscountPercent) {
          productToppings?.forEach((item) => {
            item.priceValueInMaxDiscount =
              item?.priceValue - (item?.priceValue / 100) * product?.productDetail?.discountValue;
          });
        }
      }
      setProductToppings(productToppings);
    }
  };

  //#endregion
  const StyledProductPrice = styled.div`
    .product-price-quantity,
    .product-price-btn-increase {
      svg > rect {
        fill: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }
    }
    .btn-add-to-cart-text {
      svg > path {
        fill: ${colorGroupBody?.buttonTextColor ?? "#ffffff"};
      }
    }
    .product-price-quantity {
      color: ${colorGroupBody?.textColor ?? "#282828"};
    }
  `;
  const StyledSelectCollapse = styled.div`
    .group-multiple-price,
    .group-product-option,
    .group-product-topping {
      span.ant-collapse-header-text {
        color: ${colorGroupBody?.titleColor ?? "#959595"};
      }
      .price-name,
      .option-name,
      .topping-name,
      .topping-quantity-value {
        color: ${colorGroupBody?.textColor ?? "#282828s"};
      }
    }
    .ant-radio-button-wrapper {
      .dot-select-product-option,
      .container-radio-option {
        color: ${colorGroupBody?.textColor ?? "#ffffff"};
      }

      .ant-radio-button-checked {
        background-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
        border: 1px solid ${colorGroupBody?.buttonBorderColor ?? "#db4d29"};
      }
    }
    .ant-radio-button-wrapper-checked {
      .dot-select-product-option,
      .container-radio-option {
        color: ${colorGroupBody?.buttonTextColor ?? "#ffffff"};
      }
    }
    .topping-quantity-btn-increase {
      svg > rect {
        fill: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }
    }
    .ant-radio-inner {
      border: 1px solid #a5abde;
    }
    .radio-style {
      .ant-radio-wrapper .ant-radio {
        border: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
        .ant-radio-inner {
          border: 1px solid #a5abde;
        }
      }

      .ant-radio-wrapper {
        .ant-radio {
          .ant-radio-inner {
            border: 1px solid #a5abde !important;
          }
        }

        .ant-radio-checked {
          .ant-radio-inner {
            border: 1px solid ${colorGroupBody?.buttonBackgroundColor} !important;
          }
        }
      }

      .ant-radio-wrapper .ant-radio-inner::after {
        background-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }

      .ant-radio-wrapper .ant-radio-checked .ant-radio-inner:after {
        border-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }

      .ant-radio-wrapper .ant-radio-checked .ant-radio-inner {
        border-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }

      .ant-radio-wrapper:hover .ant-radio,
      .ant-radio-wrapper:hover .ant-radio-inner,
      .ant-radio:hover .ant-radio-inner,
      .ant-radio-input:focus + .ant-radio-inner {
        border-color: ${colorGroupBody?.buttonBackgroundColor ?? "#db4d29"};
      }
    }
  `;

  const renderSize = () => {
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
        <CollapsePanel header={translatedData.selectSize} key="1">
          <ProductDetailProductPriceComponent
            productPrices={productPrices}
            productPriceDefault={productPriceSelected}
            onChange={onChangeSize}
            isStyleHorizontal={true}
          />
        </CollapsePanel>
      </Collapse>
    );
  };

  const renderOptions = () => {
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
        <CollapsePanel header={translatedData.selectOption} key="1">
          <div className="group-product-option-content">
            {productOptions.map((option, index) => {
              return (
                <ProductDetailOptionComponent
                  option={option}
                  onChangeOptions={(e) => onChangeOptions(e, index)}
                  defaultValue={optionsSelected[index]}
                  isStyleHorizontal={true}
                  iconPrefix={"dot-select-product-option"}
                />
              );
            })}
          </div>
        </CollapsePanel>
      </Collapse>
    );
  };

  const renderTopping = () => {
    return (
      <Collapse defaultActiveKey={["1"]} expandIconPosition="end" className="group-collapse">
        <CollapsePanel header={translatedData.selectTopping} key="1">
          <div className="group-product-topping-content">
            {productToppings?.map((topping, index) => {
              return (
                <ProductDetailToppingComponent
                  maximumQuantityCustom={maximumQuantity}
                  topping={topping}
                  updateQuantityTopping={(quantity, priceValue) => updateQuantityTopping(index, quantity, priceValue)}
                  iconPlus={<IncreaseQuantityProductIcon />}
                  iconMinus={<DecreaseQuantityProductIcon />}
                  isStyleHorizontal={true}
                  maximumLimit={productPriceSelected?.maximumLimit}
                  quantityProduct={quantityProduct}
                />
              );
            })}
          </div>
        </CollapsePanel>
      </Collapse>
    );
  };

  const getPriceFormat = (number) => {
    let convertNumber = parseFloat(number);
    if (convertNumber >= 0) {
      return (
        <>
          {formatTextNumber(convertNumber)}
          <>đ</>
        </>
      );
    }
    return "";
  };

  const renderTotalOfAmount = () => {
    if (quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0) {
      return formatTextNumber(totalPriceOfProduct);
    } else {
      if (isFlashSaleIncludedTopping()) {
        let totalPriceTopping = 0;
        productToppings?.map((topping) => {
          let toppingValue = topping.priceValue;
          totalPriceTopping += toppingValue * topping.quantity;
        });
        return formatTextNumber(productPrice * quantityProduct + totalPriceTopping);
      } else if (productPriceSelected?.flashSaleId && !productPriceSelected?.isIncludedTopping) {
        return formatTextNumber(totalOfAmount + totalPriceTopping * quantityProduct ?? 0);
      } else {
        return formatTextNumber(totalOfAmount ?? 0);
      }
    }
  };

  const handleConfirmNotify = () => {
    let productPriceUpdate = Object.assign(
      {},
      productDetail?.productPrices[productDetail?.defaultProductPriceIndex ?? 0],
    );
    productPriceUpdate.priceValue = productPriceUpdate.originalPrice;
    productPriceUpdate.isApplyPromotion = false;
    productPriceUpdate.flashSaleId = undefined;

    const product = {
      isCombo: false,
      id: productDetail?.id,
      name: productDetail?.name,
      thumbnail: productDetail?.thumbnail,
      notes: messagesForStore,
      productPrice: { ...productPriceUpdate, totalOfToppingPrice: totalPriceTopping },
      quantity: quantityProduct,
      options: mappingDataOptions(optionsSelected),
      toppings: productToppings,
      dataDetails: dataDetails,
      branchId: branchAddress?.id,
    };
    updateStoreCart(product);
    setIsShowNotifyDialog(false);
  };

  const checkProductAndAddToCart = async () => {
    if (isOutOfStock) {
      return;
    }
    let allAreApplicable = true;
    if (isPos) {
      addProductToCart();
    } else {
      if (productDetail?.isFlashSale && productPriceSelected?.isApplyPromotion) {
        const verifyFlashSaleRequest = {
          branchId: branchAddress?.id,
          productPriceId: productPriceSelected.id,
          quantity: quantityProduct,
          flashSaleId: productPriceSelected.flashSaleId,
        };
        const flashSaleVerifyResult = await flashSaleDataService.verifyProductFlashSaleAsync(verifyFlashSaleRequest);
        allAreApplicable = flashSaleVerifyResult?.data?.allAreApplicable;
        if (!allAreApplicable && flashSaleVerifyResult?.data?.responseCode !== EnumFlashSaleResponseCode.overLimited) {
          //Show notification if flashsale is inActive
          setIsShowNotifyDialog(true);
        } else {
          addProductToCart();
        }
      } else {
        addProductToCart();
      }
    }
    onShowToastMessage();
  };

  const setStoreCart = (cartItems) => {
    if (window.callApiValidateCartItems) {
      clearTimeout(window.callApiValidateCartItems);
    }
    window.callApiValidateCartItems = setTimeout(() => {
      shoppingCartService?.setStoreCart(cartItems, true);
    }, 200);
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageUpdateToCart(true));
    setTimeout(() => {
      dispatch(setToastMessageUpdateToCart(false));
    }, 3000);
  };

  return (
    <>
      <CloseBranchContainer branchId={isPos ? branchIdPos : branchAddress?.id} />
      {isCombo ? (
        <EditOrderComboComponent
          {...props}
          currentIndex={currentIndex}
          comboDetailData={{ ...comboData }}
          stateConfig={stateConfig}
          isPos={isPos}
          branchIdPos={branchIdPos}
          onCancel={onCancel}
          branchAddress={branchAddress}
        />
      ) : (
        <section className="edit-order-theme-pho-viet-section" style={{ fontFamily: fontFamily }}>
          {/* Section product detail */}
          <div className="detail-center">
            <div className="edit-order-theme-pho-viet-section-group">
              {isMaxWidth500 ? (
                <>
                  {productPriceSelected?.promotionEndTime && (
                    <FnbFlashSaleBannerComponent endTime={productPriceSelected?.promotionEndTime} endAtZero={true} />
                  )}
                  <Row gutter={[24, 24]}>
                    <Col sm={9} xs={9}>
                      {originalPrice !== priceAfterDiscountDefault && !productDetail?.isFlashSale && promotionTag && (
                        <div className="discount-edit-order">
                          <span className="discount-text">{promotionTag}</span>
                        </div>
                      )}
                      <div className="border-image-thumnail">
                        <Image
                          src={thumbnail[0]?.imageUrl ?? "error"}
                          className={`product-image ${isOutOfStock && "out-of-stock-opacity"}`}
                          fallback={productImageDefault}
                          preview={false}
                        />
                      </div>
                    </Col>
                    <Col sm={15} xs={15}>
                      <>
                        <h3 className="product-name text-line-clamp-2" style={{ color: colorGroupBody?.textColor }}>
                          {productDetail?.name}
                        </h3>

                        <ProductDetailDescriptionComponent
                          isViewMore={true}
                          classNameDescription={"product-description"}
                          idDescription={"product-description"}
                          content={productDetail?.description}
                          styleContent={{ color: colorGroupBody?.textColor }}
                        />
                        <StyledProductPrice>
                          <div className="product-price">
                            <div className="product-price-left">
                              {originalPrice !== priceAfterDiscountDefault && (
                                <span className="product-price-original">{getPriceFormat(originalPrice)}</span>
                              )}
                              <span className="product-price-discount" style={{ color: colorGroupBody?.titleColor }}>
                                {getPriceFormat(productPrice)}
                              </span>
                            </div>
                          </div>
                        </StyledProductPrice>
                        {!productDetail?.isFlashSale && (
                          <ProductDetailRateComponent
                            classNameTotalReview={"total-review"}
                            defaultValueRate={productDetail?.rating}
                            numberOfReview={productDetail?.numberOfReview}
                            groupRateStart={"group-star-rate"}
                          />
                        )}
                        <StyledProductPrice>
                          <div className="product-price">
                            <div className="product-price-right">
                              <div
                                className={`product-price-btn-decrease ${
                                  quantityProduct <= 1 ? "prevent-click" : "active-click"
                                }`}
                                hidden={quantityProduct <= 0}
                                onClick={() => updateQuantityProduct(quantityProduct - 1)}
                              >
                                <DecreaseQuantityProductIcon />
                              </div>
                              <span className="product-price-quantity">{quantityProduct}</span>
                              <div
                                className={`product-price-btn-increase ${isOutOfStock && "btn-out-of-stock-disabled"}`}
                                hidden={quantityProduct >= maximumQuantity}
                                onClick={() => (isOutOfStock ? null : updateQuantityProduct(quantityProduct + 1, true))}
                              >
                                <IncreaseQuantityProductIcon />
                              </div>
                            </div>
                          </div>
                        </StyledProductPrice>
                      </>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className={`edit-order-theme-pho-viet-section-left "non-padding-left"`}>
                  {thumbnail?.length > 1 ? (
                    <ProductDetailImagesComponent
                      images={[
                        {
                          imageUrl:
                            productDetail?.thumbnail && productDetail?.thumbnail !== ""
                              ? productDetail.thumbnail
                              : productImageDefault,
                        },
                      ]}
                      isLoop={true}
                      isNavigation={true}
                      isPromotion={originalPrice !== priceAfterDiscountDefault}
                      promotion={
                        isDiscountPercent
                          ? productDetail?.discountValue + "%"
                          : getPriceFormat(productDetail?.discountValue ?? productDetail?.discountPrice)
                      }
                      classPromotion={"discount-edit-order"}
                    />
                  ) : (
                    <>
                      {originalPrice !== priceAfterDiscountDefault && (
                        <div className="discount-edit-order">
                          <span className="discount-text">
                            {productPriceSelected?.flashSaleId
                              ? calculatePercentage(priceAfterDiscountDefault, originalPrice)
                              : promotionTag
                              ? promotionTag
                              : ""}
                          </span>
                        </div>
                      )}
                      <div className="border-image-thumnail">
                        <OutOfStockLabelBoxComponent isShow={isOutOfStock} smallSize />
                        <Image
                          src={
                            productDetail?.thumbnail && productDetail?.thumbnail !== ""
                              ? productDetail.thumbnail
                              : productImageDefault
                          }
                          className={`product-image ${isOutOfStock && "out-of-stock-opacity"}`}
                          preview={false}
                        />
                      </div>
                      <div className="image-sub-group">
                        <Image
                          className="image-sub"
                          src={
                            productDetail?.thumbnail && productDetail?.thumbnail !== ""
                              ? productDetail.thumbnail
                              : productImageDefault
                          }
                          preview={false}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              <div className="edit-order-theme-pho-viet-section-right">
                {!isMaxWidth500 && (
                  <>
                    <div className="custom-margin-top">
                      {productPriceSelected?.promotionEndTime && (
                        <FnbFlashSaleBannerComponent
                          endTime={productPriceSelected?.promotionEndTime}
                          endAtZero={true}
                        />
                      )}
                    </div>
                    <h3 className="product-name text-line-clamp-2" style={{ color: colorGroupBody?.textColor }}>
                      {productDetail?.name}
                    </h3>

                    <ProductDetailRateComponent
                      classNameTotalReview={"total-review"}
                      defaultValueRate={productDetail?.rating}
                      numberOfReview={productDetail?.numberOfReview}
                      groupRateStart={"group-star-rate"}
                    />
                    <ProductDetailDescriptionComponent
                      isViewMore={true}
                      classNameDescription={"product-description"}
                      idDescription={"product-description"}
                      content={productDetail?.description}
                      styleContent={{ color: colorGroupBody?.textColor }}
                    />

                    {promotionsOfProductPriceApplied?.length > 0 && (
                      <NameAndValuePopoverStoreWeb
                        data={mappingDiscountApplyToPromotionPopupData(promotionsOfProductPriceApplied)}
                        className="popover-promotion-product-detail-theme2"
                      />
                    )}

                    <StyledProductPrice>
                      <div className="product-price">
                        <div className="product-price-left">
                          {originalPrice !== priceAfterDiscountDefault && (
                            <span className="product-price-original">{getPriceFormat(originalPrice)}</span>
                          )}
                          <span className="product-price-discount" style={{ color: colorGroupBody?.titleColor }}>
                            {getPriceFormat(productPrice)}
                          </span>
                        </div>
                        <div className="product-price-right">
                          <div
                            className={`product-price-btn-decrease ${
                              quantityProduct <= 1 ? "prevent-click" : "active-click"
                            }`}
                            hidden={quantityProduct <= 0}
                            onClick={() => updateQuantityProduct(quantityProduct - 1)}
                          >
                            <DecreaseQuantityProductIcon />
                          </div>
                          <span className="product-price-quantity">{quantityProduct}</span>
                          <div
                            className={`product-price-btn-increase ${isOutOfStock && "btn-out-of-stock-disabled"}`}
                            hidden={quantityProduct >= maximumQuantity}
                            onClick={() => (isOutOfStock ? null : updateQuantityProduct(quantityProduct + 1, true))}
                          >
                            <IncreaseQuantityProductIcon />
                          </div>
                        </div>
                      </div>
                    </StyledProductPrice>
                  </>
                )}
                {quantityProduct > productPriceSelected?.maximumLimit && productPriceSelected?.maximumLimit > 0 && (
                  <MaximumLimitFlashSaleNotifyComponent maximumLimit={productPriceSelected?.maximumLimit} />
                )}
                <div className="select-edit-order">
                  <StyledSelectCollapse>
                    {productPrices?.length > 1 && <div className="group-multiple-price">{renderSize()}</div>}
                    {productOptions?.length > 0 && <div className="group-product-option">{renderOptions()}</div>}
                    {productToppings?.length > 0 && <div className="group-product-topping">{renderTopping()}</div>}
                  </StyledSelectCollapse>
                </div>
                <div className="input-note-edit-order">
                  {messagesForStore ? <NoteIcon className="note-icon" /> : <NoteIconBlur className="note-icon" />}
                  <TextArea
                    className="product-note"
                    name={["note-product"]}
                    placeholder={translatedData.noteAMessageForTheStore}
                    onChange={(e) => setMessagesForStore(e.target.value)}
                    value={messagesForStore}
                    maxLength={100}
                    autoSize
                  />
                </div>
                <Row className="total-cart">
                  {isMaxWidth500 && (
                    <Col xs={5} sm={5} md={5} lg={5} style={{ marginRight: 12 }}>
                      <div className="btn-add-cancel" onClick={onCancel}>
                        {translatedData.cancel}
                      </div>
                    </Col>
                  )}
                  <Col xs={numberColBtnAdd} sm={numberColBtnAdd} md={numberColBtnAdd} lg={numberColBtnAdd}>
                    <div
                      className="btn-add-to-cart"
                      onClick={checkProductAndAddToCart}
                      style={{
                        opacity: isOutOfStock ? 0.5 : 1,
                        cursor: isOutOfStock ? "not-allowed" : "pointer",
                        background: colorGroupBody?.buttonBackgroundColor,
                        color: colorGroupBody?.buttonTextColor,
                        borderColor: colorGroupBody?.buttonBorderColor,
                      }}
                    >
                      <div className="btn-add-to-cart-price">
                        {renderTotalOfAmount() !== formatTextNumber(totalOriginalPriceProduct) && (
                          <div className="btn-add-to-cart-origin-price-value">
                            {getPriceFormat(totalOriginalPriceProduct)}
                          </div>
                        )}
                        <div className="btn-add-to-cart-price-value">
                          {renderTotalOfAmount() < 0 ? 0 : renderTotalOfAmount()}đ
                        </div>
                      </div>
                      <StyledProductPrice>
                        <div className="btn-add-to-cart-text">
                          {currentIndex === -1
                            ? translatedData.btnAddToCart
                            : isMaxWidth500
                            ? translatedData.updateCartMobie
                            : translatedData.updateCart}

                          <CheckoutIcon className="icon-check-out" style={{ fill: colorGroupBody?.buttonTextColor }} />
                        </div>
                      </StyledProductPrice>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <NotificationDialog
            open={isShowNotifyDialog}
            title={translatedData.notification}
            onConfirm={handleConfirmNotify}
            confirmLoading={false}
            className="checkout-theme1-notify-dialog"
            content={translatedData.flashSaleEndNotification}
            footer={[<Button onClick={handleConfirmNotify}>{translatedData.okay}</Button>]}
            closable={true}
          />
        </section>
      )}
    </>
  );
}
