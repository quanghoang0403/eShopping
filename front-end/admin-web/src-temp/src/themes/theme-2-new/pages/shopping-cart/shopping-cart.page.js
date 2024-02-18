import { Button, Col, Drawer, Empty, Image, List, Modal, Row, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import { Platform } from "../../../constants/platform.constants";
import branchDataService from "../../../data-services/branch-data.services";
import productDataService from "../../../data-services/product-data.service";
import { store } from "../../../modules/index";
import { setCartItems } from "../../../modules/session/session.actions";
import { setToastMessageMaxDiscount } from "../../../modules/toast-message/toast-message.actions";
import { checkOutOfStockAllProductWhenUpdateCart } from "../../../services/material/check-out-of-stock.service";
import maxDiscountService from "../../../services/max-discount.services";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import { formatTextNumber, getPathByCurrentURL, getStoreConfig } from "../../../utils/helpers";
import { HttpStatusCode } from "../../../utils/http-common";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import { IconBtnPlusCustomize } from "../../assets/icons/BtnPlusCustomizeColor";
import { IconBtnPlusCustomizeDisable } from "../../assets/icons/BtnPlusCustomizeDisable";
import btnMinus from "../../assets/icons/btn-minus.svg";
import cartNote from "../../assets/icons/note-icon.svg";
import emptyCartImage from "../../assets/images/empty-cart.png";
import productImageDefault from "../../assets/images/product-default-img.jpg";
import EditOrderItem from "../../components/edit-order-item/edit-order-item.component";
import FnbDisplayImageComponent from "../../components/fnb-display-image/fnb-display-image.component";
import NotificationDialog from "../../components/notification-dialog/notification-dialog.component";
import OutOfStockLabelBoxComponent from "../../components/out-of-stock-label-box/out-of-stock-label-box.component";
import { EnumPromotion } from "../../constants/enum";
import { EnumDayOfWeek, EnumNextTimeOpenType } from "../../constants/enums";
import PageType from "../../constants/page-type.constants";
import { backgroundTypeEnum, comboTypeEnum } from "../../constants/store-web-page.constants";
import "./shopping-cart-flash-sale.scss";
import "./shopping-cart.page.scss";

export default function ShoppingCartPage({ isDefault, stateConfig, isRefresh, open }) {
  const path = getPathByCurrentURL();
  const history = useHistory();
  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const reduxState = store.getState();
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
  const cartItems = useSelector((state) => state.session.cartItems);
  const dispatch = useDispatch();
  const [cartFromLocalStore, setCartFromLocalStore] = useState([]);
  const [visibleEditProduct, setVisibleEditProduct] = useState(false);
  const [productSelectEdit, setProductSelectEdit] = useState(null);
  const [indexDefault, setIndexDefault] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [styleBody, setStyleBody] = useState({});
  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [isShowDialogOutOfStock, setIsShowDialogOutOfStock] = useState(false);
  const [isShowDialogRemoveFromCart, setIsShowDialogRemoveFromCart] = useState(false);
  const [isPreventCheckout, setIsPreventCheckout] = useState(false);
  const themeConfigReduxState = useSelector((state) => state?.session?.themeConfig);
  const config = themeConfigReduxState;
  const colorGroupsDefault = config?.general?.color?.colorGroups;
  const currentColor = colorGroupsDefault?.length > 0 ? colorGroupsDefault[0] : {};

  const [t] = useTranslation();
  const pageData = {
    yourCart: t("storeWebPage.shoppingCart.yourCart", "Giỏ hàng của bạn"),
    checkOut: t("storeWebPage.shoppingCart.checkOut", "Đặt hàng"),
    items: t("storeWebPage.shoppingCart.items", "món"),
    emptyCart: t("storeWebPage.shoppingCart.emptyCart", "Bạn chưa có món nào trong giỏ hàng"),
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    okay: t("storeWebPage.generalUse.okay", "Okay"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Rất tiếc! Sản phẩm không còn đủ hàng"),
    someProductOutOfStock: t(
      "storeWebPage.productDetailPage.someProductOutOfStock",
      "Rất tiếc! Một số sản phẩm đã hết hàng.",
    ),
    willBeRemoveFromCart: t("storeWebPage.productDetailPage.willBeRemoveFromCart", "Chúng sẽ bị xóa khỏi giỏ hàng!"),
  };

  useEffect(() => {
    setStoreCartDataToLocalStore();
  }, []);

  useEffect(() => {
    if (open) {
      calculateShoppingCart();
    }
  }, [open]);

  useEffect(() => {
    setStoreCartDataToLocalStore();
  }, [cartItems]);

  useEffect(() => {
    if (isRefresh) {
      setStoreCart();
    }
  }, [isRefresh]);

  async function handleConfirmNotify() {
    setIsShowDialogRemoveFromCart(false);
    const newCartItems = [...cartItems];
    const newCarts = shoppingCartService.removeOutOfStockCartItem(newCartItems);
    setStoreCart(newCarts);
    dispatch(setCartItems(newCarts));
    if (newCarts?.length > 0) {
      history.push("/checkout");
    }
  }

  const initBackgroundBody = () => {
    const { pages } = stateConfig;
    let configDetail = pages?.find((x) => x.id === PageType.PRODUCT_DETAIL)?.config?.productDetail;
    let style = {};
    if (configDetail?.backgroundType === backgroundTypeEnum.Color) {
      style = {
        backgroundColor: configDetail?.backgroundColor,
      };
    } else {
      style = {
        backgroundImage: `url(${configDetail?.backgroundImage})`,
        backgroundRepeat: `no-repeat`,
        backgroundPosition: `center`,
        backgroundSize: `100% 100%`,
        backgroundAttachment: "initial",
        borderRadius: "8px",
      };
    }
    setStyleBody({ ...style });
  };

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

  const countCartItems = () => {
    let countItem = 0;
    cartItems?.forEach((e) => {
      countItem = countItem + e.quantity;
    });

    return countItem;
  };

  const setStoreCartDataToLocalStore = () => {
    setCartFromLocalStore(JSON.parse(getStorage(localStorageKeys.STORE_CART)));
    calculatePrice(cartItems);
  };

  const calculatePrice = (cartItems) => {
    let totalPrice = 0;
    cartItems?.forEach((e) => {
      if (!e.isCombo) {
        totalPrice =
          totalPrice +
          e.quantity *
            ((e?.isFlashSale ? e?.productPrice?.priceValue : e?.productPrice?.priceAfterDiscountInStore ?? 0) +
              e.productPrice?.totalOfToppingPrice);
      } else {
        totalPrice = totalPrice + e.quantity * e.sellingPrice + e.totalOfToppingPrice;
      }
    });
    setTotalAmount(totalPrice);
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

  const onChangeProductQuantity = async (isCombo, quantity, index, isIncrease) => {
    if (quantity <= 0) {
      cartFromLocalStore?.splice(index, 1);
    } else {
      if (isIncrease) {
        //Check out of stock
        const cartData = [...cartFromLocalStore];
        const outOfStockIndices = cartData?.reduce((acc, item, index) => {
          if (item.isOutOfStock) {
            acc.push(index);
          }
          return acc;
        }, []);
        const verifyOutOfStock = await checkOutOfStockAllProductWhenUpdateCart(
          branchAddress?.id,
          cartData,
          index,
          quantity,
          outOfStockIndices,
        );
        if (verifyOutOfStock) {
          setIsShowDialogOutOfStock(true);
          return;
        }

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

  const combineOptionTopping = (productPrice, options, toppings) => {
    let result = [];

    if (productPrice?.priceName) {
      result.push(productPrice?.priceName);
    }

    options
      ?.filter((item) => item.isSetDefault === false)
      .forEach((e) => {
        result.push(e.name + " " + e.optionLevelName);
      });
    toppings?.forEach((e) => {
      if (e.quantity > 0) result.push(e.quantity + " x " + e.name);
    });
    return result.join(" | ");
  };

  const onCheckoutCart = async () => {
    const newCartItems = await callApiValidateCartItems();
    if (newCartItems?.length > 0) {
      const hasOutOfStockItem = newCartItems?.some((item) => item.isOutOfStock === true);
      if (hasOutOfStockItem) {
        setIsShowDialogRemoveFromCart(true);
        return;
      }

      const workingHour = await branchDataService.getWorkingHourByBranchIdAsync(branchAddress?.id ?? null);
      const workingHourResult = workingHour?.data;
      if (workingHourResult?.isClosed === true) {
        setIsShowNotifyDialog(true);
        setTimeWorkingHour(workingHourResult?.workingHour?.openTime);
        if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[1].key) {
          setDayOfWeek(EnumNextTimeOpenType[workingHourResult?.workingHour?.nextTimeOpen - 1].name);
        } else if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[2].key) {
          setDayOfWeek(EnumDayOfWeek[workingHourResult?.workingHour?.dayOfWeek].name);
        }
        return;
      }

      if (!isPreventCheckout) {
        if (!isDefault) {
          history.push("/checkout");
        } else {
          window.location.href = `${path}/checkout`;
        }
      }
    }
  };

  const handleClose = () => {
    setVisibleEditProduct(false);
  };

  const onClickEditOrderItem = (item, index) => {
    initBackgroundBody();
    setIndexDefault(index);
    setVisibleEditProduct(true);
    setProductSelectEdit(item);
  };

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
      shoppingCartService?.setStoreCart(cartItems, true);
    }, 200);
  };

  const callApiValidateCartItems = async () => {
    let newCartItems = null;
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

    setIsPreventCheckout(true);
    const cartValidatedResponse = await productDataService.getProductCartItemAsync(cartItemRequest);
    if (cartValidatedResponse.status === HttpStatusCode.Ok) {
      const newItemInCart = shoppingCartService.updateItemInCart(cartValidatedResponse?.data.cartItems);
      dispatch(setCartItems(newItemInCart));
      shoppingCartService.setStoreCartLocalStorage(newItemInCart);
      newCartItems = newItemInCart;
      setIsPreventCheckout(false);
    } else {
      console.error("Xảy ra lỗi ", cartValidatedResponse);
    }
    return newCartItems;
  };

  return (
    <>
      <div className="shopping-cart-popover">
        {cartFromLocalStore && cartFromLocalStore?.length > 0 && (
          <div className="shopping-cart-header">
            <div className="shopping-cart-header-text" style={{ color: currentColor?.titleColor }}>
              {pageData.yourCart.toUpperCase()}{" "}
              <span className="total-item">
                ({countCartItems()} {pageData.items})
              </span>
            </div>
          </div>
        )}

        {(!cartFromLocalStore || cartFromLocalStore?.length <= 0) && (
          <div className="shopping-cart-content-empty">
            <Empty
              image={emptyCartImage}
              imageStyle={{
                height: 109,
              }}
              description={<span>{pageData.emptyCart}</span>}
            ></Empty>
          </div>
        )}

        {cartFromLocalStore && cartFromLocalStore?.length > 0 && (
          <div className="shopping-cart-content">
            <List
              className="list-items"
              bordered
              dataSource={[...cartFromLocalStore]}
              renderItem={(item, index) => (
                <List.Item className="list-items-in-cart">
                  {index > 0 && <hr className="splitter" />}
                  {!item?.isCombo && (
                    <Row className={`content-container ${item?.isOutOfStock === true && "out-of-stock-opacity"}`}>
                      <Col xs={7} sm={7} md={7} lg={5}>
                        <div
                          className={
                            Boolean(item?.productPrice?.flashSaleId)
                              ? "item-image-border-flash-sale"
                              : "item-image-border"
                          }
                          onClick={() => {
                            onClickEditOrderItem(item, index);
                          }}
                        >
                          <OutOfStockLabelBoxComponent isShow={item?.isOutOfStock} isCartItem />

                          {Boolean(item?.productPrice?.flashSaleId) && (
                            <FnbDisplayImageComponent
                              src={item?.thumbnail}
                              isFlashSale={Boolean(item?.isFlashSale)}
                              className="shopping-cart-flash-sale-theme2"
                            />
                          )}
                          {!Boolean(item?.productPrice?.flashSaleId) && (
                            <Image
                              className="item-image"
                              src={item?.thumbnail ?? "error"}
                              alt=""
                              fallback={productImageDefault}
                              preview={false}
                            ></Image>
                          )}
                        </div>
                      </Col>
                      <Col xs={16} sm={16} md={16} lg={18}>
                        <Row>
                          <a>
                            <p
                              style={{ color: currentColor?.textColor }}
                              className="cart-item-name"
                              onClick={() => {
                                onClickEditOrderItem(item, index);
                              }}
                            >
                              {item?.name}
                            </p>
                          </a>
                        </Row>
                        <Row>
                          <span className="cart-item-option">
                            {combineOptionTopping(item?.productPrice, item?.options, item?.toppings)}
                          </span>
                        </Row>
                        <Row>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            {(!item?.isFlashSale &&
                              item?.productPrice?.isApplyPromotion &&
                              item?.productPrice?.originalPrice &&
                              item?.productPrice?.originalPrice !== item?.productPrice?.priceValue && (
                                <Row className="total-original-price">
                                  {formatTextNumber(
                                    (item?.productPrice?.originalPrice ?? 0) +
                                      (item?.productPrice?.totalOfToppingOriginalPrice ?? 0),
                                  )}
                                  đ
                                </Row>
                              )) ||
                              ""}
                            <Row className="total-product-price" style={{ color: currentColor?.titleColor }}>
                              {formatTextNumber(
                                Math.round(
                                  (item?.isFlashSale
                                    ? item?.productPrice?.priceValue
                                    : item?.productPrice?.priceAfterDiscountInStore ?? 0) +
                                    (item?.productPrice?.totalOfToppingPrice ?? 0),
                                ),
                              )}
                              đ
                            </Row>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Row className="quantityGroup">
                              <Col xs={8} sm={8} md={8} lg={8}>
                                <img
                                  className="btnMinus"
                                  src={btnMinus}
                                  alt="minus"
                                  onClick={() => {
                                    if (item?.quantity > 0) {
                                      onChangeProductQuantity(item?.isCombo, item?.quantity - 1, index, false);
                                    }
                                  }}
                                />
                              </Col>
                              <Col xs={8} sm={8} md={8} lg={8}>
                                <div className="item-quantity" style={{ color: currentColor?.textColor }}>
                                  <span>{item?.quantity}</span>
                                </div>
                              </Col>
                              <Col xs={8} sm={8} md={8} lg={8}>
                                <span
                                  className="btnPlus"
                                  alt="plus"
                                  onClick={() => {
                                    if (item?.quantity < 999) {
                                      if (!item?.isOutOfStock) {
                                        onChangeProductQuantity(item?.isCombo, item?.quantity + 1, index, true);
                                      }
                                    }
                                  }}
                                >
                                  {item?.quantity < 999 && (
                                    <IconBtnPlusCustomize color={currentColor?.buttonBackgroundColor} stroke={currentColor?.buttonTextColor} />
                                  )}
                                  {item?.quantity >= 999 && (
                                    <IconBtnPlusCustomizeDisable color={currentColor?.buttonBackgroundColor} stroke={currentColor?.buttonTextColor} />
                                  )}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        {item?.notes && (
                          <Row className="cartMessage">
                            <Col xs={4} sm={4} md={4} lg={3}>
                              <img className="messageIcon" src={cartNote} alt="cart note" />
                            </Col>
                            <Col xs={20} sm={20} md={20} lg={21}>
                              <div className="messageNote">{item?.notes}</div>
                            </Col>
                          </Row>
                        )}
                      </Col>
                    </Row>
                  )}
                  {item?.isCombo && (
                    <Row className={item?.isOutOfStock === true && "out-of-stock-opacity"}>
                      <Col xs={7} sm={7} md={7} lg={5}>
                        <div className="item-image-border">
                          <OutOfStockLabelBoxComponent isShow={item?.isOutOfStock} isCartItem />
                          <Image
                            className="item-image"
                            src={item?.thumbnail ?? "error"}
                            alt=""
                            fallback={productImageDefault}
                            preview={false}
                            onClick={() => {
                              onClickEditOrderItem(item, index);
                            }}
                          ></Image>
                        </div>
                      </Col>
                      <Col xs={16} sm={16} md={16} lg={18}>
                        <Row>
                          {item?.comboTypeId === comboTypeEnum.comboProductPrice.id && (
                            <a>
                              <p
                                style={{ color: currentColor?.textColor }}
                                className="cart-item-name"
                                onClick={() => {
                                  onClickEditOrderItem(item, index);
                                }}
                              >
                                {item?.name}
                              </p>
                            </a>
                          )}
                          {item?.comboTypeId === comboTypeEnum.comboPricing.id && (
                            <a>
                              <p
                                style={{ color: currentColor?.textColor }}
                                className="cart-item-name"
                                onClick={() => {
                                  onClickEditOrderItem(item, index);
                                }}
                              >
                                {item?.comboPricingName ? item?.comboPricingName : item?.name}
                              </p>
                            </a>
                          )}
                        </Row>
                        {item?.products.map((e) => {
                          return (
                            <>
                              <Row>
                                <span style={{ color: currentColor?.textColor }} className="cart-item-name-combo">
                                  {e?.name}
                                </span>
                              </Row>
                              <Row>
                                <span className="cart-item-option">
                                  {combineOptionTopping(e?.productPrice, e?.options, e?.toppings)}
                                </span>
                              </Row>
                            </>
                          );
                        })}
                        <Row>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Row className="total-product-price" style={{ color: currentColor?.titleColor }}>
                              {formatTextNumber(
                                (item?.sellingPrice ?? 0) + (item?.totalOfToppingPrice ?? 0) / item?.quantity,
                              )}
                              đ
                            </Row>
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12}>
                            <Row className="quantityGroup">
                              <Col xs={8} sm={8} md={8} lg={8}>
                                <img
                                  className="btnMinus"
                                  src={btnMinus}
                                  alt="minus"
                                  onClick={() => {
                                    if (item?.quantity > 0) {
                                      onChangeProductQuantity(item?.isCombo, item?.quantity - 1, index, false);
                                    }
                                  }}
                                />
                              </Col>
                              <Col xs={8} sm={8} md={8} lg={8}>
                                <div className="item-quantity" style={{ color: currentColor?.textColor }}>
                                  <span>{item?.quantity}</span>
                                </div>
                              </Col>
                              <Col xs={8} sm={8} md={8} lg={8}>
                                <span
                                  className="btnPlus"
                                  alt="plus"
                                  onClick={() => {
                                    if (item?.quantity < 999) {
                                      if (!item.isOutOfStock) {
                                        onChangeProductQuantity(item?.isCombo, item?.quantity + 1, index, true);
                                      }
                                    }
                                  }}
                                >
                                  {item?.quantity < 999 && (
                                    <IconBtnPlusCustomize color={currentColor?.buttonBackgroundColor} stroke={currentColor?.buttonTextColor} />
                                  )}
                                  {item?.quantity >= 999 && (
                                    <IconBtnPlusCustomizeDisable color={currentColor?.buttonBackgroundColor} stroke={currentColor?.buttonTextColor} />
                                  )}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        {item?.notes && (
                          <Row className="cartMessage">
                            <Col xs={4} sm={4} md={4} lg={3}>
                              <img className="messageIcon" src={cartNote} alt="cart note" />
                            </Col>
                            <Col xs={20} sm={20} md={20} lg={21}>
                              <div className="messageNote">{item?.notes}</div>
                            </Col>
                          </Row>
                        )}
                      </Col>
                    </Row>
                  )}
                </List.Item>
              )}
            />
          </div>
        )}

        {cartFromLocalStore && cartFromLocalStore?.length > 0 && (
          <div className="shopping-cart-footer">
            <Button
              onClick={() => onCheckoutCart()}
              className={
                !cartFromLocalStore || cartFromLocalStore?.length <= 0
                  ? "action-checkout hidden-checkout"
                  : "action-checkout"
              }
              style={{ background: currentColor?.buttonBackgroundColor }}
              disabled={!cartFromLocalStore || cartFromLocalStore?.length <= 0 || isPreventCheckout}
            >
              <div style={{ color: currentColor?.buttonTextColor }} className="total-price-checkout">
                {formatTextNumber(Math.round(totalAmount))}đ
              </div>
              <div style={{ color: currentColor?.buttonTextColor }} className="text-checkout">
                {pageData.checkOut}
              </div>
            </Button>
          </div>
        )}
      </div>

      <div className="edit-order-item">
        {isMaxWidth500 ? (
          <Drawer
            className="drawer-product-cart-detail"
            placement="bottom"
            open={visibleEditProduct}
            onClose={handleClose}
            destroyOnClose={true}
            closable={false}
            style={styleBody}
            height={"85%"}
          >
            <EditOrderItem
              dataEdit={productSelectEdit}
              indexDefault={indexDefault}
              onCancel={handleClose}
              stateConfig={stateConfig}
              calculateShoppingCart={calculateShoppingCart}
              platformId={Platform.StoreWebsite}
            />
          </Drawer>
        ) : (
          <Modal
            className="modal-product-cart-detail"
            open={visibleEditProduct}
            onOk={handleClose}
            onCancel={handleClose}
            footer={(null, null)}
            centered
            destroyOnClose={true}
            width={"60%"}
            style={styleBody}
          >
            <EditOrderItem
              dataEdit={productSelectEdit}
              indexDefault={indexDefault}
              onCancel={handleClose}
              stateConfig={stateConfig}
              calculateShoppingCart={calculateShoppingCart}
              platformId={Platform.StoreWebsite}
            />
          </Modal>
        )}
      </div>
      <NotificationDialog
        open={isShowNotifyDialog}
        title={pageData.notification}
        confirmLoading={false}
        className="checkout-theme1-notify-dialog"
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(pageData.soSorryNotificationWorkingHour, {
                timeWorkingHour: timeWorkingHour,
                dayOfWeek: t(dayOfWeek),
              }),
            }}
          ></span>
        }
        footer={[<Button onClick={() => setIsShowNotifyDialog(false)}>{pageData.iGotIt}</Button>]}
        closable={true}
      />

      {/* Out of stock dialog */}
      <NotificationDialog
        open={isShowDialogOutOfStock}
        title={pageData.notification}
        confirmLoading={false}
        content={pageData.textOutOfStock}
        footer={[<Button onClick={() => setIsShowDialogOutOfStock(false)}>{pageData.iGotIt}</Button>]}
        closable={true}
      />

      {/* Remove item out of stock from cart dialog */}
      <NotificationDialog
        open={isShowDialogRemoveFromCart}
        title={pageData.notification}
        confirmLoading={false}
        content={
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: t(pageData.someProductOutOfStock),
              }}
            ></p>
            <p style={{ marginTop: 12 }}>{pageData.willBeRemoveFromCart}</p>
          </div>
        }
        footer={[<Button onClick={handleConfirmNotify}>{pageData.okay}</Button>]}
        closable={true}
      />
    </>
  );
}
