import { t } from "i18next";
import { comboType } from "../constants/combo.constants";
import { EnumAddToCartType } from "../constants/enums";
import comboDataService from "../data-services/combo-data.service";
import flashSaleDataService from "../data-services/flash-sale-data.service";
import productDataService from "../data-services/product-data.service";
import { store } from "../modules";
import { setNotificationDialog } from "../modules/session/session.actions";
import shoppingCartService from "../services/shopping-cart/shopping-cart.service";
import { formatTextNumber, roundNumber } from "../utils/helpers";
import { HttpStatusCode } from "../utils/http-common";
import { getStorage, localStorageKeys } from "../utils/localStorage.helpers";
import { checkOutOfStockWhenQuickAdd } from "./material/check-out-of-stock.service";
import { setToastMessageAddToCart } from "../modules/toast-message/toast-message.actions";
import { Platform } from "../constants/platform.constants";

const getOptionsSelected = (options) => {
  let optionsSelected = [];
  if (options) {
    options.map((productOption) => {
      let option = productOption?.optionLevels?.find((option) => option?.isSetDefault);
      if (option) {
        optionsSelected.push(option);
      } else {
        optionsSelected.push("");
      }
    });
  }
  return optionsSelected;
};

const mappingDataOptions = (options, isComboPricingProducts) => {
  const newOptions = options?.map((o) => ({
    id: isComboPricingProducts ? o?.id : o?.optionId,
    name: isComboPricingProducts ? o?.name : o?.optionName,
    isSetDefault: isComboPricingProducts
      ? o?.optionLevels?.find((x) => x.isSetDefault === true)?.isSetDefault
      : o?.isSetDefault,
    optionLevelId: isComboPricingProducts ? o?.optionLevels?.find((x) => x.isSetDefault === true)?.id : o?.id,
    optionLevelName: isComboPricingProducts ? o?.optionLevels?.find((x) => x.isSetDefault === true)?.name : o?.name,
  }));
  return newOptions;
};

const mappingDataToppings = (toppings) => {
  const newOptions = toppings?.map((t) => ({
    id: t?.toppingId,
    name: t?.name,
    priceValue: t?.priceValue,
    originalPrice: t?.priceValue,
    quantity: t.quantity,
  }));
  return newOptions;
};

const compareProduct = (firstProduct, secondProduct) => {
  let isTheSame = false;
  if (
    firstProduct?.id === secondProduct?.id &&
    firstProduct?.productPrice?.id === secondProduct?.productPrice?.id &&
    firstProduct?.options?.every((firstOption) => {
      return secondProduct?.options?.some(
        (secondOption) =>
          firstOption?.id === secondOption?.id && firstOption?.optionLevelId === secondOption?.optionLevelId,
      );
    }) &&
    firstProduct?.toppings?.length === secondProduct?.toppings?.length &&
    firstProduct?.toppings?.every((firstTopping) => {
      return secondProduct?.toppings?.some(
        (secondTopping) => secondTopping?.id === firstTopping?.id && secondTopping?.quantity === firstTopping?.quantity,
      );
    })
  ) {
    isTheSame = true;
  }
  return isTheSame;
};

const calculatorOriginalPriceComboSpecific = (comboProductPrices) => {
  const originalPrice = comboProductPrices?.reduce((a, v) => (a = a + v.priceValue), 0);
  return originalPrice;
};

const calculatePercent = (sellingPrice, originalPrice, isComboProductPrice, comboProductPrices) => {
  if (isComboProductPrice) {
    return formatTextNumber(
      roundNumber(100 - (sellingPrice / calculatorOriginalPriceComboSpecific(comboProductPrices)) * 100, 0),
    );
  } else {
    return formatTextNumber(roundNumber(100 - (sellingPrice / originalPrice) * 100, 0));
  }
};

const handleCheckHaveFlashSaleAsync = async (productPriceId, flashSaleId, isFlashSale, branchAddress) => {
  if (isFlashSale === true) {
    const verifyFlashSaleRequest = {
      branchId: branchAddress?.id,
      productPriceId,
      quantity: 1,
      flashSaleId,
    };
    const flashSaleVerifyResult = await flashSaleDataService.verifyProductFlashSaleAsync(verifyFlashSaleRequest);
    const allAreApplicable = flashSaleVerifyResult?.data?.allAreApplicable;
    if (allAreApplicable === false) {
      return false;
    }
    return true;
  } else {
    return true;
  }
};

const handleProductAddToCart = async (isCheckFlashSaleAddToCart, item, productPrice, callBackCartItem) => {
  var res = await productDataService.getToppingsByProductIdAsync(item?.id);
  if (res) {
    const _productPrice = productPrice;
    _productPrice.totalOfToppingPrice = 0;
    _productPrice.totalOfToppingOriginalPrice = 0;
    _productPrice.maximumDiscountAmount = item?.maximumDiscountAmount;
    if (isCheckFlashSaleAddToCart) {
      _productPrice.flashSaleId = undefined;
      _productPrice.flashSaleQuantity = undefined;
      _productPrice.maximumLimit = undefined;
      _productPrice.promotionEndTime = undefined;
      _productPrice.isApplyPromotion = false;
      _productPrice.priceValue = _productPrice.originalPrice;
    } else {
      _productPrice.originalPrice =
        _productPrice.originalPrice === 0 ? _productPrice.priceValue : _productPrice.originalPrice;
    }

    const product = {
      isCombo: false,
      id: item?.id,
      name: item?.name,
      thumbnail: item?.thumbnail,
      message: "",
      productPrice: _productPrice,
      quantity: 1,
      isFlashSale: isCheckFlashSaleAddToCart === true ? false : item?.isFlashSale,
      options: mappingDataOptions(getOptionsSelected(item?.productOptions)),
      toppings: mappingDataToppings(res.data.productToppings),
      dataDetails: {
        product: {
          productDetail: {
            ...item,
          },
        },
      },
    };
    shoppingCartService.updateStoreCart(product, callBackCartItem);
  }
};

const addComboToCart = (item, comboData, callBackCartItem) => {
  let _productList = [];
  let _productPricesList = [];
  let _toppings = [];
  let _options = [];
  var dataComboMap =
    comboData?.comboTypeId === comboType.comboPricing.id ? item?.comboPricingProducts : item?.comboProductPrices;
  dataComboMap?.map((item, index) => {
    let itemProduct = item?.productPrice?.product;
    _options.push(itemProduct?.productOptions);
    _toppings.push(itemProduct?.productToppings ?? []);
    let _product = {
      id: item?.productPrice?.productId,
      name: itemProduct?.name,
      thumbnail: itemProduct?.thumbnail,
      productPrice: {
        id: item?.productPriceId,
        priceName: item?.productPrice?.priceName,
        priceValue: item?.productPrice?.priceValue,
        product: item?.productPrice?.product,
        isApplyPromotion: false,
        isIncludedTopping: false,
        originalPrice: 0,
        totalOfToppingPrice: 0,
      },
      options: mappingDataOptions(_options[index], true),
      toppings: mappingDataToppings(_toppings[index]),
    };
    _productList.push(_product);
    _productPricesList.push({
      productPriceId: item?.productPriceId,
      priceName: item?.productPrice?.priceName,
      priceValue: item?.productPrice?.priceValue,
      productPrice: item?.productPrice,
    });
  });
  let comboProductPrice =
    comboData?.comboTypeId === comboType.comboPricing.id ? _productPricesList : item?.comboProductPrices;
  let percentDiscount =
    comboData?.comboTypeId === comboType.comboPricing.id
      ? calculatePercent(item?.sellingPrice, item?.originalPrice, false)
      : calculatePercent(item?.sellingPrice, item?.originalPrice, true, comboProductPrice);
  let comboPrevData = comboData?.comboTypeId === comboType.comboPricing.id ? comboData : item;
  let dataDetailCombo = {
    ...comboPrevData,
    isCombo: true,
    comboPricingName: item?.comboName,
    comboProductPrices: comboProductPrice,
    percentDisount: percentDiscount,
    combo: {
      name: comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.name ?? item?.comboName : item.name,
    },
  };
  const combo = {
    isCombo: true,
    id: comboData?.comboTypeId === comboType.comboPricing.id ? item?.comboId : item.id,
    name: comboData?.comboTypeId === comboType.comboPricing.id ? item?.customName : item.name,
    comboPricingId: comboData?.comboTypeId === comboType.comboPricing.id ? item.id : null,
    comboPricingName: item?.comboName,
    thumbnail: comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.thumbnail : item?.thumbnail,
    message: "",
    comboTypeId: comboData?.comboTypeId === comboType.comboPricing.id ? comboData.comboTypeId : item.comboTypeId,
    products: _productList,
    quantity: 1,
    originalPrice: item?.originalPrice,
    sellingPrice: item?.sellingPrice,
    totalOfToppingPrice: 0,
    dataDetails: dataDetailCombo,
  };
  shoppingCartService.updateStoreCart(combo, callBackCartItem);
};

const addProductToCart = async (
  isCombo,
  item,
  productPrice,
  isCheckFlashSaleAddToCart,
  branchAddress,
  setIsShowFlashSaleInActive,
  setCallBackAddToCartFunction,
  callBackCartItem,
) => {
  if (isCheckFlashSaleAddToCart === true) {
    await handleProductAddToCart(isCheckFlashSaleAddToCart, item, productPrice, callBackCartItem);
  } else {
    if (isCombo) {
      addComboToCart(item, productPrice, callBackCartItem);
    } else {
      /// Handle check flash sale
      const checkFlashSale = await handleCheckHaveFlashSaleAsync(
        productPrice?.id,
        item?.flashSaleId,
        item?.isFlashSale,
        branchAddress,
      );
      if (checkFlashSale === false) {
        setIsShowFlashSaleInActive(true);
        setCallBackAddToCartFunction({
          isCombo,
          item,
          productPrice,
          isCheckFlashSaleAddToCart: true,
        });
        return;
      }
      var res = await productDataService.getToppingsByProductIdAsync(item?.id);
      if (res) {
        const _productPrice = productPrice;
        _productPrice.totalOfToppingPrice = 0;
        _productPrice.totalOfToppingOriginalPrice = 0;
        const product = {
          isCombo: false,
          id: item?.id,
          name: item?.name,
          thumbnail: item?.thumbnail,
          message: "",
          productPrice: {
            ..._productPrice,
            totalOfToppingPrice: _productPrice?.totalOfToppingPrice ?? 0,
            totalOfToppingOriginalPrice: _productPrice?.totalOfToppingOriginalPrice ?? 0,
          },
          isFlashSale: checkFlashSale,
          quantity: 1,
          options: mappingDataOptions(getOptionsSelected(item?.productOptions)),
          toppings: mappingDataToppings(res.data.productToppings),
          dataDetails: {
            product: {
              productDetail: {
                ...item,
              },
            },
          },
        };
        shoppingCartService.updateStoreCart(product, callBackCartItem);
      }
    }
  }
};

const getComboPricing = async (comboPricingId) => {
  const comboDetail = await comboDataService.getComboPricingByComboPricingIdAsync(comboPricingId);
  return comboDetail;
};

const getComboProductPrice = async (comboId) => {
  const comboDetail = await comboDataService.getComboProductPriceByComboIdAsync(comboId);
  return comboDetail;
};

const getProductDetail = async (productId, branchId, platformId) => {
  return await productDataService.getProductDetailByIdAsync(productId, platformId, branchId);
};

const verifyProductFlashSale = async (verifyFlashSaleRequest) => {
  return await flashSaleDataService.verifyProductFlashSaleAsync(verifyFlashSaleRequest);
};

const updateCartInLocalAndRedux = (product, isCombo, callBack) => {
  const storeCart = getStorage(localStorageKeys.STORE_CART);
  let objectStoreCart = JSON.parse(storeCart);
  let storeCartNew = [];
  if (objectStoreCart && objectStoreCart?.length > 0) {
    storeCartNew = shoppingCartService.mergeProducts(product, objectStoreCart);
  } else {
    storeCartNew.push(product);
  }
  shoppingCartService.setStoreCartLocalStorage(storeCartNew);

  shoppingCartService.setStoreCart(storeCartNew, false);

  if (callBack) {
    callBack(storeCartNew);
  }
};

const mappingToOptionsLocal = (options) => {
  const newOptions = options?.map((o) => ({
    id: o?.optionId,
    name: o?.optionName,
    isSetDefault: o?.isSetDefault,
    optionLevelId: o?.id,
    optionLevelName: o?.name,
  }));
  return newOptions;
};

const mappingToToppingsLocal = (toppings) => {
  const newOptions = toppings?.map((t) => ({
    id: t?.toppingId,
    name: t?.name,
    priceValue: t?.priceValue,
    originalPrice: t?.priceValue,
    quantity: t.quantity,
  }));
  return newOptions;
};

const mappingToComboLocal = (comboData) => {
  let _productList = [];
  comboData?.comboProductPrices?.map((item, index) => {
    let itemProduct = item?.productPrice?.product;
    let _product = {
      id: item?.productPrice?.productId,
      name: itemProduct?.name,
      thumbnail: itemProduct?.thumbnail,
      productPrice: {
        id: item?.productPriceId,
        priceName: item?.priceName,
        priceValue: item?.priceValue,
      },
      options: mappingToOptionsLocal(getOptionsSelected(itemProduct?.productOptions)),
      toppings: mappingToToppingsLocal(itemProduct?.productToppings),
    };
    _productList.push(_product);
  });

  const combo = {
    isCombo: true,
    id: comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.comboId : comboData?.id,
    name: comboData?.comboTypeId === comboType.comboPricing.id ? comboData?.comboPricingName : comboData?.name,
    comboPricingId: comboData?.comboPricingId,
    comboPricingName: comboData?.comboPricingName,
    thumbnail: comboData?.thumbnail,
    notes: "",
    comboTypeId: comboData?.comboTypeId,
    products: _productList,
    quantity: 1,
    originalPrice: comboData?.originalPrice,
    sellingPrice: comboData?.sellingPrice,
    totalOfToppingPrice: 0,
    dataDetails: comboData,
  };

  return combo;
};

const mappingToProductLocal = (data, productPriceId, quantity = 1) => {
  const productDetail = data?.productDetail;
  let indexProductPrice = productDetail?.defaultProductPriceIndex;
  if (productPriceId) {
    indexProductPrice = productDetail?.productPrices?.findIndex((item) => item?.id === productPriceId);
  }
  if (!indexProductPrice || indexProductPrice === -1) {
    indexProductPrice = 0;
  }
  const productPrice = productDetail?.productPrices[indexProductPrice];
  productPrice.totalOfToppingPrice = 0;
  productPrice.totalOfToppingOriginalPrice = 0;

  const product = {
    isCombo: false,
    id: productDetail?.id,
    name: productDetail?.name,
    thumbnail: productDetail?.thumbnail,
    message: "",
    productPrice: productPrice,
    isFlashSale: productDetail?.isFlashSale,
    quantity: quantity,
    options: mappingToOptionsLocal(getOptionsSelected(productDetail?.productOptions)),
    toppings: mappingToToppingsLocal(data?.productToppings),
    dataDetails: {
      product: {
        ...data,
      },
    },
  };
  return product;
};

/**
 *
 * @param {*} data {id, productPriceId, isFLashSale, flashSaleId}
 * @param {*} type EnumAddToCartType
 * @param {*} branchId
 * @param {*} callBack
 */
const quickAddToCart = async (data, type, branchId, callBack, checkFlashSaleApplicable) => {
  ///Check out of stock before quick add
  let isOutOfStock = null;
  if (type === EnumAddToCartType.Product) {
    isOutOfStock = await checkOutOfStockWhenQuickAdd(false, branchId, data?.productPriceId, 1);
  } else {
    const comboParam = {
      comboId: data?.id,
      comboPricingProducts:
        data?.comboPricingProducts?.length > 0 ? data?.comboPricingProducts : data?.comboProductPrices,
    };
    isOutOfStock = await checkOutOfStockWhenQuickAdd(true, branchId, comboParam, 1);
  }
  //Verify Out Of Stock
  if (callBack) {
    callBack(isOutOfStock);
  }
  if (isOutOfStock === true) {
    const notificationDialog = {
      isShow: true,
      content: t("storeWebPage.productDetailPage.textOutOfStock", "Rất tiếc! Sản phẩm không còn đủ hàng"),
    };
    store.dispatch(setNotificationDialog(notificationDialog));
    return;
  }

  switch (type) {
    case EnumAddToCartType.ComboPricing:
      getComboPricing(data?.id)
        .then((response) => {
          if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
            updateCartInLocalAndRedux(mappingToComboLocal(response?.data?.combo), true, callBack);
          } else {
            // To do
          }
        })
        .catch((response) => {
          // To do
        });
      break;

    case EnumAddToCartType.ComboProductPrice:
      getComboProductPrice(data?.id)
        .then((response) => {
          if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
            updateCartInLocalAndRedux(mappingToComboLocal(response?.data?.combo), true, callBack);
          } else {
            // To do
          }
        })
        .catch((response) => {
          // To do
        });
      break;

    case EnumAddToCartType.Product:
      if (data?.isFlashSale) {
        const verifyFlashSaleRequest = {
          branchId: branchId,
          productPriceId: data?.productPriceId,
          quantity: 1,
          flashSaleId: data?.flashSaleId,
        };
        verifyProductFlashSale(verifyFlashSaleRequest)
          .then((response) => {
            if (response?.status === HttpStatusCode.Ok) {
              if (checkFlashSaleApplicable) {
                checkFlashSaleApplicable(
                  response?.data?.allAreApplicable,
                  response?.data?.responseCode,
                  response?.data?.product,
                );
              } else {
                updateCartInLocalAndRedux(
                  mappingToProductLocal(response?.data?.product, verifyFlashSaleRequest?.productPriceId),
                  false,
                  callBack,
                );
              }
            } else {
              // To do
            }
          })
          .catch((response) => {
            // To do
          });
      } else {
        getProductDetail(data?.id, branchId, Platform.StoreWebsite)
          .then((response) => {
            if (response?.status === HttpStatusCode.Ok) {
              updateCartInLocalAndRedux(mappingToProductLocal(response?.data), false, callBack);
            } else {
              // To do
            }
          })
          .catch((response) => {
            // To do
            window.location.reload();
          });
      }
      break;

    default:
      break;
  }
  onShowToastMessageAddToCart();
};

const onShowToastMessageAddToCart = () => {
  store.dispatch(setToastMessageAddToCart(true));
  setTimeout(() => {
    store.dispatch(setToastMessageAddToCart(false));
  }, 3000);
};

const quickAddToCartQrProducts = (data, callBack, checkFlashSaleApplicable) => {
  updateCartInLocalAndRedux(mappingToProductLocal(data, null, data?.quantity), false, callBack);
};

const productComboAddToCartServices = {
  addProductToCart,
  quickAddToCart,
  updateCartInLocalAndRedux,
  mappingToProductLocal,
  quickAddToCartQrProducts,
};

export default productComboAddToCartServices;
