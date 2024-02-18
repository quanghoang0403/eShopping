import { comboType } from "../../constants/combo.constants";
import { EnumAddToCartType } from "../../constants/enums";
import { Platform } from "../../constants/platform.constants";
import comboDataService from "../../data-services/combo-data.service";
import productDataService from "../../data-services/product-data.service";
import { HttpStatusCode } from "../../utils/http-common";
import reduxService from "../redux.services";
import shoppingCartService from "../shopping-cart/shopping-cart.service";
import posCartService from "./pos-cart.services";

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

const updateCartInLocalAndRedux = (product, isCombo, callBack) => {
  let posCartItems = reduxService.getAllData()?.posCartItems;
  let posCartNew = [];
  if (posCartItems && posCartItems?.length > 0) {
    posCartNew = shoppingCartService.mergeProducts(product, posCartItems);
  } else {
    posCartNew.push(product);
  }
  posCartService.setStoreCartLocalStorage(posCartNew);
  posCartService.setPOSCart(posCartNew, false);

  if (callBack) {
    callBack(posCartNew);
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

const mappingToProductLocal = (data, productPriceId) => {
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
    quantity: 1,
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
 * @param {*} data {id, productPriceId}
 * @param {*} type EnumAddToCartType
 * @param {*} branchId
 * @param {*} callBack
 */
const quickAddToCartAsync = async (data, type, branchId, callBack) => {
  let isSuccess = false;
  switch (type) {
    case EnumAddToCartType.ComboPricing:
      const responseGetComboPricing = await getComboPricing(data?.id);
      if (responseGetComboPricing?.status === HttpStatusCode.Ok && responseGetComboPricing?.data?.isSuccess) {
        updateCartInLocalAndRedux(mappingToComboLocal(responseGetComboPricing?.data?.combo), true, callBack);
        isSuccess = true;
      } else {
        isSuccess = false;
      }
      break;

    case EnumAddToCartType.ComboProductPrice:
      const responseGetComboProductPrice = await getComboProductPrice(data?.id);
      if (responseGetComboProductPrice?.status === HttpStatusCode.Ok && responseGetComboProductPrice?.data?.isSuccess) {
        updateCartInLocalAndRedux(mappingToComboLocal(responseGetComboProductPrice?.data?.combo), true, callBack);
        isSuccess = true;
      } else {
        isSuccess = false;
      }
      break;

    case EnumAddToCartType.Product:
      const responseGetProductDetail = await getProductDetail(data?.id, branchId, Platform.POS);
      if (responseGetProductDetail?.status === HttpStatusCode.Ok) {
        updateCartInLocalAndRedux(mappingToProductLocal(responseGetProductDetail?.data), false, callBack);
        isSuccess = true;
      } else {
        isSuccess = false;
      }
      break;

    default:
      break;
  }

  return isSuccess;
};

const getComboDetailAsync = async (id, type) => {
  let response = {};
  switch (type) {
    case EnumAddToCartType.ComboPricing:
      response = await comboDataService.getComboPricingByComboPricingIdAsync(id);
      break;

    case EnumAddToCartType.ComboProductPrice:
      response = await comboDataService.getComboProductPriceByComboIdAsync(id);
      break;

    default:
      break;
  }
  if (response?.status === HttpStatusCode.Ok && response?.data?.isSuccess) {
    return mappingToComboLocal(response?.data?.combo);
  }
  return {};
};

const posAddToCartServices = {
  quickAddToCartAsync,
  getComboDetailAsync,
};

export default posAddToCartServices;
