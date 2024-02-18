import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import productDataService from "../../../data-services/product-data.service";
import { store } from "../../../modules/index";
import { qrOrderSelector } from "../../../modules/order/order.reducers";
import { setPOSCartItems, setPackageExpiredInfo } from "../../../modules/session/session.actions";
import { setToastMessageMaxDiscount } from "../../../modules/toast-message/toast-message.actions";
import maxDiscountService from "../../../services/max-discount.services";
import posCartService from "../../../services/pos/pos-cart.services";
import PackageExpiredDialog from "../../../shared/components/package-expired-dialog/package-expired-dialog.component";
import { getStoreConfig } from "../../../utils/helpers";
import { HttpStatusCode } from "../../../utils/http-common";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import CartProductDetailComponent from "../../components/cart-checkout-scan-qrcode/cart-product-detail.component";
import HeaderCartCheckout from "../../components/cart-checkout-scan-qrcode/header-cart-checkout.component";
import { EnumPromotion } from "../../constants/enum";
import DialogCloseBranchContainer from "../../containers/close-branch/dialog-close-branch.container";
import "../shopping-cart/shopping-cart-flash-sale.scss";
import "../shopping-cart/shopping-cart.page.scss";
import "./POSCart.style.scss";

function POSCartPage(props) {
  const { fontFamily } = props;
  const history = useHistory();
  const reduxState = store.getState();
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
  const cartItems = useSelector((state) => state.session.posCartItems);
  const dispatch = useDispatch();
  const [cartFromLocalStore, setCartFromLocalStore] = useState([]);
  const [t] = useTranslation();
  const [isShowNotifyDialogCloseBranch, setIsShowNotifyDialogCloseBranch] = useState(false);
  const reduxQROrder = useSelector(qrOrderSelector);

  const pageData = {
    cart: t("storeWebPage.shoppingCart.cart", "Giỏ hàng"),
    yourCart: t("storeWebPage.shoppingCart.yourCart", "Giỏ hàng của bạn"),
    createOrder: t("storeWebPage.shoppingCart.createOrder", "Tạo đơn hàng"),
    items: t("storeWebPage.shoppingCart.items", "món"),
    emptyCart: t("storeWebPage.shoppingCart.emptyCart", "Bạn chưa có món nào trong giỏ hàng"),
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
  };

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    setStoreCartDataToLocalStore();
    setStoreCart(cartItems);
  }, []);

  useEffect(() => {
    store?.dispatch(setPackageExpiredInfo(null));
    setStoreCartDataToLocalStore();
  }, [cartItems]);

  const mappingOrderCartItem = (cartItem) => {
    return {
      orderItemId: null, //
      productPriceId: cartItem?.productPrice?.id,
      flashSaleId: cartItem?.productPrice?.flashSaleId,
      quantity: cartItem?.quantity,
      notes: cartItem?.notes ?? "",
      options: cartItem?.options?.map((o) => {
        return {
          optionId: o.id,
          optionLevelId: o.optionLevelId,
        };
      }),
      toppings: cartItem?.toppings?.map((t) => {
        return {
          toppingId: t.id,
          quantity: t.quantity,
        };
      }),
      isCombo: cartItem?.isCombo ?? false,
      combo: cartItem?.isCombo
        ? {
            comboId: cartItem?.isCombo ? cartItem?.id : null,
            comboPricingId: cartItem?.comboPricingId,
            comboName: cartItem?.name,
            itemName: cartItem?.comboPricingName,
            thumbnail: cartItem?.thumbnail,
            originalPrice: cartItem?.originalPrice,
            sellingPrice: cartItem?.sellingPrice,
            sellingPriceAfterDiscount: cartItem?.sellingPrice,
            quantity: cartItem?.quantity,
            notes: cartItem?.notes,
            comboItems: cartItem?.products?.map((product) => {
              return {
                productId: product?.id,
                productPriceId: product?.productPrice?.id,
                itemName: product?.name,
                thumbnail: product?.thumbnail,
                quantity: product?.quantity ?? 1,
                note: product?.note,
                options: product?.options?.map((option) => {
                  return {
                    optionId: option?.id,
                    optionLevelId: option?.optionLevelId,
                  };
                }),
                toppings: product?.toppings?.map((topping) => {
                  return {
                    toppingId: topping?.id,
                    quantity: topping?.quantity,
                    priceValue: topping?.priceValue,
                  };
                }),
              };
            }),
          }
        : null,
      productId: !cartItem?.isCombo ? cartItem?.id : null,
    };
  };

  const getOrderInfo = () => {
    const reduxState = store.getState();
    const session = reduxState?.session;
    const requestCartItems = session?.cartItems?.map((item) => mappingOrderCartItem(item));
    const orderInfo = {
      ...session?.orderInfo,
      cartItems: requestCartItems ?? [],
      orderNotes: "",
      deliveryAddress: { ...session?.deliveryAddress },
    };

    return orderInfo;
  };

  const setStoreCartDataToLocalStore = () => {
    setCartFromLocalStore(JSON.parse(getStorage(localStorageKeys.POS_CART)));
  };

  const calculateDiscount = (price, promotion, currentDiscountValue = null) => {
    if (promotion && promotion?.isPercentDiscount) {
      let discountValue = (price * promotion?.percentNumber) / 100;
      if (promotion?.maximumDiscountAmount == 0) {
        return discountValue;
      }

      if (currentDiscountValue) {
        if (currentDiscountValue == promotion?.maximumDiscountAmount) {
          return 0;
        }

        return discountValue >= promotion?.maximumDiscountAmount
          ? promotion?.maximumDiscountAmount - currentDiscountValue
          : discountValue - currentDiscountValue;
      }
      if (promotion?.maximumDiscountAmount > 0) {
        return discountValue >= promotion?.maximumDiscountAmount ? promotion?.maximumDiscountAmount : discountValue;
      }

      return discountValue;
    } else {
      if (currentDiscountValue && currentDiscountValue <= promotion?.maximumDiscountAmount) {
        return promotion?.maximumDiscountAmount - currentDiscountValue;
      }

      return promotion.maximumDiscountAmount;
    }
  };

  const FindMaxPromotion = (promotions, price) => {
    let maxPromotion = null;
    let discountValue = 0;
    for (let i = 0; i < promotions.length; i++) {
      let promotion = promotions[i];
      let maxDiscount = calculateDiscount(price, promotion);
      if (maxDiscount >= discountValue) {
        discountValue = maxDiscount;
        maxPromotion = promotion;
      }
    }
    // Promotion value cannot be greater than product value
    if (discountValue > price) {
      discountValue = price;
    }

    return { maxPromotion, discountValue };
  };

  const onChangeProductQuantity = (isCombo, quantity, index, isIncrease) => {
    if (quantity <= 0) {
      cartFromLocalStore?.splice(index, 1);
    } else {
      if (isIncrease) {
        if (isCombo) {
          cartFromLocalStore[index].totalOfToppingPrice =
            (cartFromLocalStore[index].totalOfToppingPrice / (quantity - 1)) * quantity;
        } else {
          cartFromLocalStore[index].productPrice.totalOfToppingPrice =
            (cartFromLocalStore[index].productPrice?.totalOfToppingPrice / (quantity - 1)) * quantity;
          cartFromLocalStore[index].productPrice.totalOfToppingOriginalPrice =
            (cartFromLocalStore[index].productPrice?.totalOfToppingOriginalPrice / (quantity - 1)) * quantity;
        }
      } else {
        if (isCombo) {
          cartFromLocalStore[index].totalOfToppingPrice =
            (cartFromLocalStore[index].totalOfToppingPrice / (quantity + 1)) * quantity;
        } else {
          cartFromLocalStore[index].productPrice.totalOfToppingPrice =
            (cartFromLocalStore[index].productPrice?.totalOfToppingPrice / (quantity + 1)) * quantity;
          cartFromLocalStore[index].productPrice.totalOfToppingOriginalPrice =
            (cartFromLocalStore[index].productPrice?.totalOfToppingOriginalPrice / (quantity + 1)) * quantity;
        }
      }
      cartFromLocalStore[index].quantity = quantity;
    }

    setStoreCart(cartFromLocalStore);

    /// Handle calculation max discount
    let maximumDiscountAmount = cartFromLocalStore[index]?.productPrice?.maximumDiscountAmount;
    let totalPriceValue = cartFromLocalStore[index]?.quantity * cartFromLocalStore[index]?.productPrice?.priceValue;
    let isIncludedTopping = cartFromLocalStore[index]?.productPrice?.isIncludedTopping;
    // Discount total bill
    if (cartFromLocalStore[index]?.isFlashSale === false && cartFromLocalStore[index]?.isPromotionTotalBill) {
      var totalAmountOriginalPrice = cartFromLocalStore
        ?.filter((cart) => cart.isCombo === false)
        ?.reduce((amount, cartList) => {
          return (
            amount +
            (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
            (cartList?.sellingPrice || 0) * cartList?.quantity
          );
        }, 0);
      const promotions = cartFromLocalStore[index]?.dataDetails?.product?.promotions.filter(
        (p) => p.promotionTypeId === EnumPromotion.DiscountTotal,
      );
      const { maxPromotion } = FindMaxPromotion(promotions, totalAmountOriginalPrice);
      maximumDiscountAmount = maxPromotion?.maximumDiscountAmount;
      isIncludedTopping = maxPromotion?.isIncludedTopping;
      // IsIncludedTopping
      if (maxPromotion?.isIncludedTopping === true) {
        totalAmountOriginalPrice = cartFromLocalStore
          ?.filter((cart) => cart.isCombo === false)
          ?.reduce((amount, cartList) => {
            return (
              amount +
              (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
              (cartList?.sellingPrice || 0) * cartList?.quantity +
              (cartList?.productPrice?.totalOfToppingPrice || 0) * cartList?.quantity +
              (cartList?.totalOfToppingPrice || 0) * cartList?.quantity
            );
          }, 0);
      }
      //Total amount
      totalPriceValue = (totalAmountOriginalPrice * maxPromotion?.percentNumber) / 100;
    } else if (cartFromLocalStore[index]?.isPromotionProductCategory) {
      // Discount product category
      const productCategoryId = cartFromLocalStore[index]?.dataDetails?.product?.productDetail?.productCategoryId;
      let newCartItemsCategory = cartFromLocalStore?.filter(
        (item) =>
          item?.dataDetails?.product?.productDetail?.productCategoryId === productCategoryId && item?.isCombo === false,
      );
      totalAmountOriginalPrice = newCartItemsCategory?.reduce((amount, cartList) => {
        return (
          amount +
          (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
          (cartList?.sellingPrice || 0) * cartList?.quantity
        );
      }, 0);

      const promotionCategories = cartFromLocalStore[index]?.dataDetails?.product?.promotions.filter(
        (p) =>
          p.promotionTypeId === EnumPromotion.DiscountProductCategory &&
          p.listPromotionProductCategory.find((cate) => cate === productCategoryId),
      );
      const { maxPromotion } = FindMaxPromotion(promotionCategories, totalAmountOriginalPrice);
      maximumDiscountAmount = maxPromotion?.maximumDiscountAmount;
      isIncludedTopping = maxPromotion?.isIncludedTopping;
      // IsIncludedTopping
      if (maxPromotion?.isIncludedTopping === true) {
        totalAmountOriginalPrice = newCartItemsCategory?.reduce((amount, cartList) => {
          return (
            amount +
            (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
            (cartList?.sellingPrice || 0) * cartList?.quantity +
            (cartList?.productPrice?.totalOfToppingPrice || 0) * cartList?.quantity +
            (cartList?.totalOfToppingPrice || 0) * cartList?.quantity
          );
        }, 0);
      }
      //Total amount
      totalPriceValue = (totalAmountOriginalPrice * maxPromotion?.percentNumber) / 100;
    }
    const data = {
      isFlashSale: cartFromLocalStore[index]?.isFlashSale,
      isApplyPromotion: cartFromLocalStore[index]?.productPrice?.isApplyPromotion,
      isIncludedTopping: isIncludedTopping,
      isDiscountTotal: cartFromLocalStore[index]?.isPromotionTotalBill,
      totalPriceValue: totalPriceValue,
      maximumDiscountAmount: maximumDiscountAmount,
      quantity: cartFromLocalStore[index]?.quantity,
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
  };

  const onCheckoutCart = async () => {
    history.push("/pos-checkout");
    dispatch(setPOSCartItems(cartFromLocalStore));
    setIsShowNotifyDialogCloseBranch(false);
  };

  function handleCheckWorkingHour(check) {
    setIsShowNotifyDialogCloseBranch(check ? true : false);
  }

  const calculateShoppingCart = () => {
    if (window.callApiValidateCartItems) {
      clearTimeout(window.callApiValidateCartItems);
    }
    window.callApiValidateCartItems = setTimeout(() => {
      callApiValidateCartItems();
    }, 200);
  };

  const setStoreCart = (cartItems) => {
    if (window.callApiValidateCartItems) {
      clearTimeout(window.callApiValidateCartItems);
    }
    window.callApiValidateCartItems = setTimeout(() => {
      posCartService?.setPOSCart(cartItems, true);
    }, 200);
  };

  const callApiValidateCartItems = async () => {
    const storeConfig = getStoreConfig();
    if (!storeConfig) {
      console.error("Không tìm thấy store config!");
    }

    const orderInfo = getOrderInfo();
    const cartItemRequest = {
      cartItems: orderInfo?.cartItems ?? [],
      customerId: orderInfo?.deliveryInfo?.customerId ?? null,
      storeId: storeConfig?.storeId ?? null,
      branchId: branchAddress?.id ?? null,
      skipCheckOrderItems: true,
    };
    const cartValidatedResponse = await productDataService.getProductCartItemAsync(cartItemRequest);
    if (cartValidatedResponse.status === HttpStatusCode.Ok) {
      let newItemInCart = posCartService?.verifyAndUpdateCart(cartValidatedResponse?.data.cartItems, true);
      dispatch(setPOSCartItems(newItemInCart));
      posCartService?.setStoreCartLocalStorage(newItemInCart);
    } else {
      console.error("Xảy ra lỗi ", cartValidatedResponse);
    }
  };

  const addMoreProducts = () => {
    history.push("/pos");
  };

  const onDeleteProduct = (id, cartIndex) => {
    if (!cartFromLocalStore || cartFromLocalStore.length === 0) return;
    let data = [...cartFromLocalStore];
    data.splice(cartIndex, 1);
    dispatch(setPOSCartItems(data));
    setStoreCart(data);
    // calculateShoppingCart(data);
  };

  return (
    <div style={{ fontFamily: fontFamily }}>
      <div className="cart-page" style={{ fontFamily: fontFamily }}>
        <HeaderCartCheckout {...props} isCart title={pageData.cart} />
        <div className="container-cart">
          <CartProductDetailComponent
            {...props}
            isCart={true}
            shoppingCart={cartFromLocalStore}
            addMoreProducts={addMoreProducts}
            onUpdateCartQuantity={onChangeProductQuantity}
            onDeleteProduct={onDeleteProduct}
            branchId={reduxQROrder?.branchId}
          />
          <div className="button-create-order-and-payment">
            <Button
              className="create-order-button"
              onClick={() => handleCheckWorkingHour(true)}
              disabled={cartFromLocalStore?.length === 0}
            >
              {pageData.createOrder}
            </Button>
          </div>
        </div>
        {isShowNotifyDialogCloseBranch && (
          <DialogCloseBranchContainer
            callback={onCheckoutCart}
            onClose={handleCheckWorkingHour}
            open={isShowNotifyDialogCloseBranch}
          />
        )}
      </div>
      <PackageExpiredDialog />
    </div>
  );
}

export default POSCartPage;
