import materialDataService from "../../data-services/material-data.service";
import { EnumComboType } from "../../theme/constants/enums";
import { isNonEmptyArray } from "../../utils/helpers";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";

export async function checkOutOfStockWhenQuickAdd(isCombo, branchId, product, quantityProduct) {
  if (isCombo === true) {
    const comboIdNew = product?.comboTypeId === EnumComboType.Flexible ? product?.comboId : product?.id;
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);

    const productPriceIds =
      objectStoreCart?.reduce((acc, item, index) => {
        if (item?.isCombo) {
          const comboId =
            item?.dataDetails?.comboTypeId === EnumComboType.Flexible
              ? item?.dataDetails?.comboId
              : item?.dataDetails?.id;
          item?.dataDetails?.comboProductPrices?.forEach((product) => {
            acc.push({
              index: index, // index of item in cart
              comboId: comboId,
              productPriceId: product?.productPriceId,
              quantity: comboId === comboIdNew ? item?.quantity + 1 : item?.quantity, // plus quantity when item's index and click item's index matching
            });
          });
        } else {
          acc.push({
            index: index, // index of item in cart
            productPriceId: item?.productPrice.id,
            quantity: item.productPrice?.id === product ? item?.quantity + 1 : item?.quantity, // plus quantity when item's index and click item's index matching
          });
        }
        return acc;
      }, []) ?? [];

    let checkComboContaintInCart = objectStoreCart
      ?.filter((item) => item.isCombo)
      ?.find((item) => item.id === comboIdNew);
    if (!checkComboContaintInCart) {
      const maxIndex = productPriceIds?.reduce((max, item) => (item.index > max ? item.index : max), -1) ?? -1;
      const comboProduct = product?.comboProductPrices ?? product?.comboPricingProducts;
      const comboPricingNew = comboProduct?.map((product) => {
        return {
          index: maxIndex + 1, // index of item in cart
          comboId: comboIdNew,
          productPriceId: product?.productPriceId,
          quantity: 1, // plus quantity when item's index and click item's index matching
        };
      });
      if (isNonEmptyArray(comboPricingNew)) {
        productPriceIds.push(...comboPricingNew);
      }
    }
    const request = {
      branchId: branchId,
      productPrices: productPriceIds,
    };
    const dataResult = await materialDataService.checkInventoryAsync(request);
    const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
    return outOfStock;
  } else {
    let input = {
      branchId: branchId,
      productPrices: getListProductPricesOfProductsInCart(product, quantityProduct, false),
    };

    const dataResult = await materialDataService.checkInventoryAsync(input);

    const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true && item.productPriceId === product);
    return outOfStock ? true : false;
  }
}

/**
 * Bug 31782
 * @param {*} product
 * @param {*} quantityProduct
 * @param {*} isUpdateCart
 * @returns
 */
function getListProductPricesOfProductsInCart(
  product,
  quantityProduct,
  isUpdateCart,
  oldProductPriceSelected,
  initCurrentIndex,
) {
  const storeCart = getStorage(localStorageKeys.STORE_CART);
  let objectStoreCart = JSON.parse(storeCart);
  const productPriceIds = objectStoreCart?.reduce((acc, item, index) => {
    if (item?.isCombo) {
      const { comboId } = item?.dataDetails;
      item?.dataDetails?.comboProductPrices?.forEach((product) => {
        acc.push({
          index: index, // index of item in cart
          comboId: comboId,
          productPriceId: product?.productPriceId,
          quantity: item?.quantity, // plus quantity when item's index and click item's index matching
        });
      });
    } else {
      if (index === initCurrentIndex) {
        if (item?.productPrice.id != oldProductPriceSelected?.id && item?.productPrice.id != product) {
          acc.push({
            index: index, // index of item in cart
            productPriceId: item?.productPrice.id,
            quantity:
              item.productPrice?.id === product && !isUpdateCart ? item?.quantity + quantityProduct : item?.quantity, // plus quantity when item's index and click item's index matching
          });
        } else {
          acc.push({
            index: index, // index of item in cart
            productPriceId: product,
            quantity: quantityProduct, // plus quantity when item's index and click item's index matching
          });
        }
      } else {
        acc.push({
          index: index, // index of item in cart
          productPriceId: item?.productPrice.id,
          quantity:
            item.productPrice?.id === product && !isUpdateCart ? item?.quantity + quantityProduct : item?.quantity, // plus quantity when item's index and click item's index matching
        });
      }
    }
    return acc;
  }, []);
  const checkProductInCart = objectStoreCart
    ?.filter((item) => !item.isCombo)
    ?.find((item) => item.productPrice?.id === product);
  if (!checkProductInCart && !oldProductPriceSelected) {
      const maxIndex = productPriceIds?.reduce((max, item) => (item.index > max ? item.index : max), -1);
      if (isNonEmptyArray(productPriceIds)) {
          productPriceIds.push({
              index: maxIndex + 1, // index of item in cart
              productPriceId: product,
              quantity: quantityProduct, // plus quantity when item's index and click item's index matching
          });
      }
  }
  return productPriceIds;
}

// update cart
export async function checkOutOfStockAllProductWhenUpdateCart(
  branchId,
  cartData,
  cartIndex,
  quantityProduct,
  outOfStockIndices,
  isViewEditOrder,
  productPriceSelected,
) {
  const productPriceIds = cartData?.reduce((acc, item, index) => {
    if (item?.isCombo) {
      const { comboId } = item?.dataDetails;
      item?.dataDetails?.comboProductPrices?.forEach((product) => {
        acc.push({
          index: index, // Index of item in cart
          comboId: comboId, // Combo ID (if applicable)
          productPriceId: product?.productPriceId,
          quantity: item?.quantity + (index === cartIndex ? 1 : 0),
        });
      });
    } else {
      if (index === cartIndex) {
        if (productPriceSelected?.id === item?.productPrice.id) {
          acc.push({
            index: index,
            productPriceId: item?.productPrice.id,
            quantity: isViewEditOrder
              ? index === cartIndex
                ? quantityProduct
                : item?.quantity
              : item?.quantity + (index === cartIndex ? 1 : 0),
          });
        } else {
          if (productPriceSelected) {
            acc.push({
              index: index,
              productPriceId: productPriceSelected?.id,
              quantity: isViewEditOrder
                ? index === cartIndex
                  ? quantityProduct
                  : item?.quantity
                : item?.quantity + (index === cartIndex ? 1 : 0),
            });
          } else {
            acc.push({
              index: index,
              productPriceId: item?.productPrice.id,
              quantity: isViewEditOrder
                ? index === cartIndex
                  ? quantityProduct
                  : item?.quantity
                : item?.quantity + (index === cartIndex ? 1 : 0),
            });
          }
        }
      } else {
        acc.push({
          index: index,
          productPriceId: item?.productPrice.id,
          quantity: isViewEditOrder
            ? index === cartIndex
              ? quantityProduct
              : item?.quantity
            : item?.quantity + (index === cartIndex ? 1 : 0),
        });
      }
    }
    return acc;
  }, []);

  const request = {
    branchId: branchId,
    productPrices: productPriceIds,
  };
  const dataResult = await materialDataService.checkInventoryAsync(request);
  if (outOfStockIndices?.length > 0) {
    const hasOutOfStock = dataResult?.data?.some(
      (item, index) => item.outOfStock === true && !outOfStockIndices.includes(index),
    );
    return hasOutOfStock;
  } else {
    const outOfStock = dataResult?.data?.some((item) => item?.outOfStock === true);
    return outOfStock;
  }
}

export async function checkOutOfStockWhenUpdateCart(
  isCombo,
  branchId,
  cartData,
  quantityProduct,
  oldProductPriceSelected,
  initCurrentIndex,
) {
  if (!isCombo) {
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);
    const product = objectStoreCart?.find((item) => item.productPrice?.id === cartData?.id);
    const request = {
      branchId: branchId,
      productPrices: getListProductPricesOfProductsInCart(
        cartData?.id,
        quantityProduct,
        true,
        oldProductPriceSelected,
        initCurrentIndex,
      ),
    };

    const dataResult = await materialDataService.checkInventoryAsync(request);
    const selectedProduct = dataResult?.data?.find(
      (item) => item.productPriceId === product?.productPrice?.id || item.productPriceId === cartData?.id,
    );
    return initCurrentIndex
      ? dataResult?.data[initCurrentIndex]?.outOfStock
      : selectedProduct?.outOfStock
      ? true
      : false;
  } else {
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);
    const product = objectStoreCart.find((item) => item?.id === cartData?.id);
    const productPriceIds = product?.dataDetails?.comboProductPrices?.map(
      (productPrice) => productPrice.productPriceId,
    );
    if (productPriceIds) {
      const request = {
        branchId: branchId,
        productPrices: productPriceIds?.map((productPriceId) => ({
          comboId: product?.comboId,
          productPriceId,
          quantity: quantityProduct,
        })),
      };

      const dataResult = await materialDataService.checkInventoryAsync(request);
      const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
      return outOfStock;
    } else {
      return false;
    }
  }
}

export async function checkProductPriceIdOutOfStockAsync(branchId, productPriceId, quantityProduct) {
  const request = {
    branchId: branchId,
    productPrices: [
      {
        productPriceId: productPriceId,
        quantity: quantityProduct,
      },
    ],
  };
  const dataResult = await materialDataService.checkInventoryAsync(request);
  const selectedProduct = dataResult?.data?.find((item) => item.productPriceId === productPriceId);
  if (selectedProduct?.outOfStock) {
    return true;
  } else {
    return false;
  }
}

export async function checkListProductPriceIdOutOfStock(branchId, productPriceIds, quantityProduct) {
  const request = {
    branchId: branchId,
    productPrices: productPriceIds.map((productPriceId) => ({
      productPriceId,
      quantity: quantityProduct,
    })),
  };

  const dataResult = await materialDataService.checkInventoryAsync(request);
  const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
  return outOfStock;
}

export async function checkOutOfStockWhenAddCombo(branchId, comboId, quantityProduct) {
  const storeCart = getStorage(localStorageKeys.STORE_CART);
  let objectStoreCart = JSON.parse(storeCart);
  const cartProduct = objectStoreCart?.find((item) => item?.id === comboId);
  const productPriceIds = cartProduct?.dataDetails?.comboProductPrices?.map(
    (productPrice) => productPrice.productPriceId,
  );
  if (productPriceIds) {
    const request = {
      branchId: branchId,
      productPrices: productPriceIds?.map((productPriceId) => ({
        comboId: comboId,
        productPriceId,
        quantity: cartProduct?.quantity ? cartProduct?.quantity + quantityProduct : quantityProduct,
      })),
    };

    const dataResult = await materialDataService.checkInventoryAsync(request);
    const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
    return outOfStock;
  } else {
    return false;
  }
}
