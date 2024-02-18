import materialDataService from "../../data-services/material-data.service";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";

export async function checkOutOfStockWhenQuickAdd(isCombo, branchId, product, quantityProduct) {
  if (isCombo) {
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);
    const productCollect = objectStoreCart?.find(
      (item) => item?.id === product?.comboId || item?.comboPricingId === product?.comboId,
    );
    const productPriceIds = productCollect?.dataDetails?.comboProductPrices?.map(
      (productPrice) => productPrice.productPriceId,
    );
    //Case 1: combo exist in the cart
    if (productPriceIds) {
      const input = {
        branchId: branchId,
        productPrices: productPriceIds?.map((productPriceId) => ({
          productPriceId,
          quantity: productCollect?.quantity ? productCollect?.quantity + quantityProduct : quantityProduct,
        })),
      };

      let dataResult = await materialDataService.materialCheckProductPriceId(input);

      const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
      return outOfStock;
    } else {
      //Case 2: combo does not exist in the cart
      let productPriceIdsWithoutCart = product?.comboPricingProducts?.map(
        (productPrice) => productPrice.productPriceId,
      );
      if (!productPriceIdsWithoutCart) {
        productPriceIdsWithoutCart = product?.comboProductPrices?.map((productPrice) => productPrice.productPriceId);
      }
      if (productPriceIdsWithoutCart) {
        const input = {
          branchId: branchId,
          productPrices: productPriceIdsWithoutCart?.map((productPriceId) => ({
            productPriceId,
            quantity: quantityProduct ?? 1,
          })),
        };
        let dataResult = await materialDataService.materialCheckProductPriceId(input);

        const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
        return outOfStock ? true : false;
      }
      return false;
    }
  } else {
    let input = {
      branchId: branchId,
      productPrices: getListProductPricesOfProductsInCart(product, quantityProduct),
    };

    let dataResult = await materialDataService.materialCheckProductPriceId(input);

    const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
    return outOfStock ? true : false;
  }
}

/**
 * Bug 31782
 * @param {*} product
 * @param {*} quantityProduct
 * @returns
 */
function getListProductPricesOfProductsInCart(product, quantityProduct) {
  const storeCart = getStorage(localStorageKeys.STORE_CART);
  let objectStoreCart = JSON.parse(storeCart);
  let listProductPriceIds = [];

  if (objectStoreCart?.length > 0) {
    listProductPriceIds = objectStoreCart?.map((item) => {
      return {
        productPriceId: item.productPrice?.id,
        quantity: item.quantity,
      };
    });
  }

  const cartProduct = objectStoreCart?.find((item) => item.productPrice?.id === product);
  if (cartProduct) {
    listProductPriceIds = objectStoreCart?.map((item) => {
      return {
        productPriceId: item.productPrice?.id,
        quantity: item.quantity + (item.productPrice?.id === product ? quantityProduct : 0),
      };
    });
  } else {
    listProductPriceIds.push({
      productPriceId: product,
      quantity: (cartProduct?.quantity ? cartProduct?.quantity : 0) + (quantityProduct ?? 1),
    });
  }

  return listProductPriceIds;
}

export async function checkOutOfStockAllProductWhenUpdateCart(
  branchId,
  cartData,
  cartIndex,
  quantityProduct,
  outOfStockIndices,
) {
  const productPriceIds = cartData?.reduce((acc, item, index) => {
    if (item?.isCombo) {
      item?.dataDetails?.comboProductPrices?.forEach((product) => {
        acc.push({
          productPriceId: product?.productPriceId,
          quantity: item?.quantity + (index === cartIndex ? 1 : 0),
        });
      });
    } else {
      acc.push({
        productPriceId: item?.productPrice.id,
        quantity: item?.quantity + (index === cartIndex ? 1 : 0),
      });
    }
    return acc;
  }, []);
  const input = {
    branchId: branchId,
    productPrices: productPriceIds,
  };
  let dataResult = await materialDataService.materialCheckProductPriceId(input);

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

export async function checkOutOfStockWhenUpdateCart(isCombo, branchId, cartData, quantityProduct) {
  if (!isCombo) {
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);
    const product = objectStoreCart?.find((item) => item.productPrice?.id == cartData?.productPrice?.id);
    let input = {
      branchId: branchId,
      productPrices: [
        {
          productPriceId: product?.productPrice?.id,
          quantity: quantityProduct,
        },
      ],
    };

    let dataResult = await materialDataService.materialCheckProductPriceId(input);

    const selectedProduct = dataResult?.data?.find((item) => item.productPriceId === product?.productPrice?.id);
    return selectedProduct?.outOfStock ? true : false;
  } else {
    const storeCart = getStorage(localStorageKeys.STORE_CART);
    let objectStoreCart = JSON.parse(storeCart);
    const product = objectStoreCart.find((item) => item?.id == cartData?.id);
    const productPriceIds = product?.dataDetails?.comboProductPrices?.map(
      (productPrice) => productPrice.productPriceId,
    );
    if (productPriceIds) {
      const input = {
        branchId: branchId,
        productPrices: productPriceIds?.map((productPriceId) => ({
          productPriceId,
          quantity: quantityProduct,
        })),
      };

      let dataResult = await materialDataService.materialCheckProductPriceId(input);

      const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
      return outOfStock;
    } else {
      return false;
    }
  }
}

export async function checkProductPriceIdOutOfStockAsync(branchId, productPriceId, quantityProduct) {
  let input = {
    branchId: branchId,
    productPrices: [
      {
        productPriceId: productPriceId,
        quantity: quantityProduct,
      },
    ],
  };
  let dataResult = await materialDataService.materialCheckProductPriceId(input);

  const selectedProduct = dataResult?.data?.find((item) => item.productPriceId === productPriceId);
  if (selectedProduct?.outOfStock) {
    return true;
  } else {
    return false;
  }
}

export async function checkListProductPriceIdOutOfStock(branchId, productPriceIds, quantityProduct) {
  const input = {
    branchId: branchId,
    productPrices: productPriceIds.map((productPriceId) => ({
      productPriceId,
      quantity: quantityProduct,
    })),
  };

  let dataResult = await materialDataService.materialCheckProductPriceId(input);

  const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
  return outOfStock;
}

export async function checkOutOfStockWhenAddCombo(branchId, comboId, quantityProduct) {
  const storeCart = getStorage(localStorageKeys.STORE_CART);
  let objectStoreCart = JSON.parse(storeCart);
  const cartProduct = objectStoreCart?.find((item) => item?.id == comboId);
  const productPriceIds = cartProduct?.dataDetails?.comboProductPrices?.map(
    (productPrice) => productPrice.productPriceId,
  );
  if (productPriceIds) {
    const input = {
      branchId: branchId,
      productPrices: productPriceIds?.map((productPriceId) => ({
        productPriceId,
        quantity: cartProduct?.quantity ? cartProduct?.quantity + quantityProduct : quantityProduct,
      })),
    };

    let dataResult = await materialDataService.materialCheckProductPriceId(input);

    const outOfStock = dataResult?.data?.some((item) => item.outOfStock === true);
    return outOfStock;
  } else {
    return false;
  }
}
