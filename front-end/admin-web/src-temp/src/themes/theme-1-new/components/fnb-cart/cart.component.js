import { Button, Drawer, Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import styled from "styled-components";
import { Platform } from "../../../constants/platform.constants";
import branchDataService from "../../../data-services/branch-data.services";
import { store } from "../../../modules/index";
import { setCartItems, setNotificationDialog } from "../../../modules/session/session.actions";
import {
  setToastMessageAddUpdateProductToCart,
  setToastMessageMaxDiscount,
} from "../../../modules/toast-message/toast-message.actions";
import { checkOutOfStockAllProductWhenUpdateCart } from "../../../services/material/check-out-of-stock.service";
import maxDiscountService from "../../../services/max-discount.services";
import shoppingCartService from "../../../services/shopping-cart/shopping-cart.service";
import { calculatePercentage, formatTextNumber } from "../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../utils/localStorage.helpers";
import { CheckTitleCartIcon, MinusQuantityIcon, PlusQuantityIcon } from "../../assets/icons.constants";
import NoteIcon from "../../assets/icons/note.svg";
import productDefaultImage from "../../assets/images/product-default.png";
import FnbDisplayImageCheckoutComponent from "../../components/fnb-display-image-checkout/fnb-display-image-checkout.component";
import NotificationDialog from "../../components/notification-dialog/notification-dialog.component";
import { EnumDayOfWeek, EnumNextTimeOpenType, EnumPromotion } from "../../constants/enums";
import { EditOrderProductDialogComponent } from "../../pages/checkout/components/edit-order-product-dialog.component";
import ConfirmationDialog from "../confirmation-dialog/confirmation-dialog.component";
import "./cart.component.scss";
import "./shopping-cart-flash-sale.scss";

export function CartComponent(props) {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const editOrderRef = useRef();
  const history = useHistory();
  const reduxState = store.getState();
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;
  const [currentCartItems, setCurrentCartItems] = useState(JSON.parse(getStorage(localStorageKeys.STORE_CART)));
  const cartItemsInRedux = useSelector((state) => state.session.cartItems);
  const generalConfig = useSelector((state) => state.session?.themeConfig?.general);
  const colorConfig = generalConfig?.color?.colorGroups?.find((x) => x.id === generalConfig?.header?.colorGroupId);
  const colorGroupDefault = generalConfig?.color?.colorGroups[0];
  const translateData = {
    yourCart: t("shoppingCart.yourCart", "Your cart"),
    checkout: t("shoppingCart.checkout", "Checkout"),
    youDontHaveAnyItemsInYourCart: t(
      "shoppingCart.youDontHaveAnyItemsInYourCart",
      "You don't have any items in your cart",
    ),
    updateCartItemToastMessage: t("updateCartItemToastMessage", "Món ăn đã được cập nhật thành công"),
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
    textOutOfStockRemove: t(
      "storeWebPage.productDetailPage.textOutOfStockRemove",
      "So sorry! Some product has been out of stock. They will be removed from the cart!",
    ),
    okay: t("form.okay"),
    notification: t("loginPage.notification"),
    textOutOfStock: t("storeWebPage.productDetailPage.textOutOfStock", "Sorry! Product is not enough of stock"),
  };
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(true);
  const [isShowNotifyDialog, setIsShowNotifyDialog] = useState(false);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [isShowMessageOutOfStock, setIsShowMessageOutOfStock] = useState(false);
  const [initProductData, setInitProductData] = useState(null);
  const [initCurrentIndex, setInitCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentCartItems(cartItemsInRedux);
  }, [cartItemsInRedux]);

  useEffect(() => {
    if (props.isShowCart) {
      // Get cart in redux to calculate then update cart in redex, local storage
      setStoreCart();
    }
  }, [props.isShowCart]);

  useEffect(() => {
    calculateTotalAmount(currentCartItems);
  }, [currentCartItems]);

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

  const onShowToastMessageUpdateCartItem = () => {
    dispatch(
      setToastMessageAddUpdateProductToCart({
        icon: null,
        message: translateData.updateCartItemToastMessage,
      }),
    );
  };

  async function handleConfirmNotify() {
    setIsShowMessageOutOfStock(false);
    let newCartItems = [...currentCartItems];
    const newCarts = shoppingCartService.removeOutOfStockCartItem(newCartItems);
    setStoreCart(newCarts);
    dispatch(setCartItems(newCarts));
    if (newCarts?.length > 0) {
      history.push("/checkout");
    }
  }

  const onChangeProductQuantity = async (quantity, index, isIncrease) => {
    if (isIncrease) {
      //Check out of stock
      const cartData = [...currentCartItems];
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
        const notificationDialog = {
          isShow: true,
          content: translateData.textOutOfStock,
        };
        dispatch(setNotificationDialog(notificationDialog));
        return;
      }
    }
    let newCartItems = [...currentCartItems];
    if (quantity <= 0) {
      newCartItems.splice(index, 1);
    } else {
      newCartItems[index].quantity = quantity;
    }

    // Calculate then update cart in redex, local storage
    setStoreCart(newCartItems);

    /// Handle calculation max discount
    let maximumDiscountAmount = newCartItems[index]?.productPrice?.maximumDiscountAmount;
    let totalPriceValue = newCartItems[index]?.quantity * newCartItems[index]?.productPrice?.priceValue;
    let isIncludedTopping = newCartItems[index]?.productPrice?.isIncludedTopping;
    // Discount total bill
    if (newCartItems[index]?.isFlashSale === false && newCartItems[index]?.isPromotionTotalBill) {
      var totalAmountOriginalPrice = newCartItems
        ?.filter((cart) => cart.isCombo === false)
        ?.reduce((amount, cartList) => {
          return (
            amount +
            (cartList?.productPrice?.originalPrice || 0) * cartList?.quantity +
            (cartList?.sellingPrice || 0) * cartList?.quantity
          );
        }, 0);
      const promotions = newCartItems[index]?.dataDetails?.promotions.filter(
        (p) => p.promotionTypeId === EnumPromotion.DiscountTotal,
      );
      const { maxPromotion } = FindMaxPromotion(promotions, totalAmountOriginalPrice);
      maximumDiscountAmount = maxPromotion?.maximumDiscountAmount;
      isIncludedTopping = maxPromotion?.isIncludedTopping;
      // IsIncludedTopping
      if (maxPromotion?.isIncludedTopping === true) {
        totalAmountOriginalPrice = newCartItems
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
    } else if (newCartItems[index]?.isPromotionProductCategory) {
      // Discount product category
      const productCategoryId = newCartItems[index]?.dataDetails?.product?.productDetail?.productCategoryId;
      let newCartItemsCategory = newCartItems?.filter(
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

      const promotionCategories = newCartItems[index]?.dataDetails?.promotions.filter(
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
      isFlashSale: newCartItems[index]?.isFlashSale,
      isApplyPromotion: newCartItems[index]?.productPrice?.isApplyPromotion,
      isIncludedTopping: isIncludedTopping,
      isDiscountTotal: newCartItems[index]?.isPromotionTotalBill,
      totalPriceValue: totalPriceValue,
      isDiscountPercent: newCartItems[index]?.productPrice?.isDiscountPercent,
      maximumDiscountAmount: maximumDiscountAmount,
      quantity: newCartItems[index]?.quantity,
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

  const calculateTotalAmount = (newCartItems) => {
    setTotalAmount(
      newCartItems?.reduce((amount, cartList) => {
        return (
          amount +
          (cartList?.isFlashSale
            ? cartList?.productPrice?.priceValue
            : cartList?.productPrice?.priceAfterDiscountInStore || 0) *
            cartList?.quantity +
          (cartList?.sellingPrice || 0) * cartList?.quantity +
          (cartList?.productPrice?.totalOfToppingPrice || 0) * cartList?.quantity +
          (cartList?.totalOfToppingPrice || 0) * cartList?.quantity
        );
      }, 0),
    );
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalKey(!modalKey);
  };

  const onClickProductCartItem = (item, index) => {
    setInitProductData(item);
    setInitCurrentIndex(index);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCartCheckout = async () => {
    const hasOutOfStockItem = currentCartItems?.some((item) => item.isOutOfStock === true);
    if (hasOutOfStockItem) {
      setIsShowMessageOutOfStock(true);
    } else {
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
      //The checkout page will check login if user not loggin yet
      history.push("/checkout");
      dispatch(setToastMessageAddUpdateProductToCart(null));
    }
  };

  const setStoreCart = (cartItems) => {
    if (window.setStoreCart) {
      clearTimeout(window.setStoreCart);
    }
    window.setStoreCart = setTimeout(() => {
      shoppingCartService?.setStoreCart(cartItems, true);
    }, 200);
  };
  const StyledCartComponent = styled.div`
    .cart-theme1-container {
      .cart-item-list {
        .cart-item {
          .cart-item-detail {
            .cart-detail {
              .cart-product-name {
                color: ${colorGroupDefault?.textColor};
              }
              .cart-product-name-combo {
                color: ${colorGroupDefault?.textColor};
              }
            }
            .cart-price-quantity {
              .cart-price {
                .price-after-discount {
                  color: ${colorGroupDefault?.titleColor};
                }
              }
              .cart-item-quantity {
                .item-quantity {
                  color: ${colorGroupDefault?.textColor};
                }
              }
            }
          }
        }
      }
      .cart-checkout {
        background-color: ${colorGroupDefault?.buttonBackgroundColor};
        color: ${colorGroupDefault?.buttonTextColor};
        border: ${colorGroupDefault?.buttonBorderColor} 1px solid;
      }
    }
  `;
  const StyledTitleCart = styled.div`
    svg {
      background: linear-gradient(${colorGroupDefault?.buttonTextColor}, ${colorGroupDefault?.buttonTextColor}) 50% 50%/50% 50%
        no-repeat;
      path {
        fill: ${colorGroupDefault?.buttonBackgroundColor};
      }
    }
  `;

  return (
    <StyledCartComponent className="cart-component">
      {currentCartItems?.length > 0 ? (
        <div className="cart-theme1-container">
          <div className="cart-item-list">
            <StyledTitleCart className="title-cart">
              <CheckTitleCartIcon /> <span style={{ color: colorGroupDefault?.titleColor }}>{translateData.yourCart}</span>
            </StyledTitleCart>
            {currentCartItems?.map((item, index) => {
              return (
                <div className="cart-item">
                  {!Boolean(item?.productPrice?.flashSaleId) && (
                    <div className="image">
                      <img
                        className="item-thumbnail"
                        src={item?.thumbnail || productDefaultImage}
                        alt=""
                        onClick={() => {
                          onClickProductCartItem(item, index);
                        }}
                      />
                      {item?.isOutOfStock && <div className="out-of-stock-badge">{translateData.outOfStock}</div>}
                    </div>
                  )}
                  {Boolean(item?.productPrice?.flashSaleId) && (
                    <div
                      className={`product_image${item?.isFlashSale ? " flash-sale-border" : ""}`}
                      onClick={() => {
                        onClickProductCartItem(item, index);
                      }}
                    >
                      <FnbDisplayImageCheckoutComponent
                        src={item?.thumbnail}
                        isFlashSale={Boolean(item?.isFlashSale)}
                        isPromotion={Boolean(item?.isPromotion || Boolean(item?.isFlashSale))}
                        promotionTitle={calculatePercentage(
                          item?.productPrice?.priceValue,
                          item?.productPrice?.originalPrice,
                        )}
                        outOfStockText={item?.isOutOfStock == true ? translateData.outOfStock : null}
                        flashSaleTitle={calculatePercentage(
                          item?.productPrice?.priceValue,
                          item?.productPrice?.originalPrice,
                        )}
                        isCart={true}
                      />
                    </div>
                  )}
                  {item?.isCombo ? (
                    <div className="cart-item-detail">
                      <div className="cart-detail">
                        <p
                          className="cart-product-name text-line-clamp-2"
                          onClick={() => {
                            onClickProductCartItem(item, index);
                          }}
                        >
                          {item?.comboPricingName || item?.name}
                        </p>
                        {item?.products?.map((item) => {
                          return (
                            <>
                              <p className="cart-product-name-combo">{item?.name}</p>
                              <p className="cart-option">
                                {item?.options?.map((itemOption, index) => {
                                  return (
                                    <span key={index}>
                                      {itemOption?.isSetDefault ||
                                        `${itemOption?.name} (${itemOption?.optionLevelName})`}
                                    </span>
                                  );
                                })}
                              </p>
                              {item?.toppings?.reduce((total, itemTopping) => {
                                return total + itemTopping?.quantity;
                              }, 0) > 0 && (
                                <p className="cart-topping">
                                  {item?.toppings?.map((itemTopping) => {
                                    return (
                                      itemTopping?.quantity > 0 && (
                                        <>
                                          {itemTopping?.quantity} x {itemTopping?.name}
                                          <br />
                                        </>
                                      )
                                    );
                                  })}
                                </p>
                              )}
                            </>
                          );
                        })}
                      </div>
                      <div className={`cart-price-quantity ${item?.isOutOfStock ? "out-of-stock" : ""}`}>
                        <div className="cart-price">
                          <span className="price-after-discount">
                            {formatTextNumber((item?.sellingPrice ?? 0) + (item?.totalOfToppingPrice ?? 0))}đ
                          </span>
                        </div>
                        <div className="cart-item-quantity">
                          <div className="btn-minus">
                            <MinusQuantityIcon
                              className="btn-icon"
                              onClick={() => {
                                if (item?.quantity > 0) {
                                  onChangeProductQuantity(item?.quantity - 1, index, false);
                                }
                              }}
                            />
                          </div>
                          <div className="item-quantity">
                            <span>{item?.quantity}</span>
                          </div>
                          <div
                            className={`btn-plus ${
                              item?.quantity < 999 && !item.isOutOfStock ? "" : "btn-plus-disabled"
                            }`}
                          >
                            <PlusQuantityIcon
                              className="btn-icon"
                              onClick={() => {
                                if (item?.quantity < 999 && !item?.isOutOfStock) {
                                  onChangeProductQuantity(item?.quantity + 1, index, true);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {item?.notes && (
                        <div className="cartMessage">
                          <div>
                            <img className="messageIcon" src={NoteIcon} alt="cart note" />
                          </div>
                          <div>
                            <div className="messageNote">{item?.notes}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="cart-item-detail">
                      <div className="cart-detail">
                        <p
                          className="cart-product-name text-line-clamp-2"
                          onClick={() => {
                            onClickProductCartItem(item, index);
                          }}
                        >
                          {item?.name}
                          {item?.productPrice?.priceName && ` (${item?.productPrice?.priceName})`}
                        </p>
                        <p className="cart-option">
                          {item?.options?.map((itemOption) => {
                            return (
                              <span>
                                {itemOption?.isSetDefault || `${itemOption?.name} (${itemOption?.optionLevelName})`}
                              </span>
                            );
                          })}
                        </p>
                        {item?.toppings?.reduce((total, topping) => {
                          return total + topping.quantity;
                        }, 0) > 0 && (
                          <p className="cart-topping">
                            {item?.toppings?.map((itemTopping) => {
                              return (
                                itemTopping?.quantity > 0 && (
                                  <>
                                    {itemTopping?.quantity} x {itemTopping?.name}
                                    <br />
                                  </>
                                )
                              );
                            })}
                          </p>
                        )}
                      </div>
                      <div className={`cart-price-quantity ${item?.isOutOfStock ? "out-of-stock" : ""}`}>
                        <div className="cart-price">
                          <span className="price-after-discount">
                            {formatTextNumber(
                              (item?.isFlashSale
                                ? item?.productPrice?.priceValue
                                : item?.productPrice?.priceAfterDiscountInStore ?? 0) +
                                (item?.productPrice?.totalOfToppingPrice ?? 0),
                            )}
                            đ
                          </span>
                          {item?.productPrice?.originalPrice !== item?.productPrice?.priceAfterDiscountInStore &&
                            item?.productPrice?.originalPrice !== 0 &&
                            !item?.isFlashSale && (
                              <span className="price">
                                {formatTextNumber(
                                  (item?.productPrice?.originalPrice ?? 0) +
                                    (item?.productPrice?.totalOfToppingOriginalPrice ?? 0),
                                )}
                                đ
                              </span>
                            )}
                        </div>
                        <div className="cart-item-quantity">
                          <div className="btn-minus">
                            <MinusQuantityIcon
                              className="btn-icon"
                              onClick={() => {
                                if (item?.quantity > 0) {
                                  onChangeProductQuantity(item?.quantity - 1, index, false);
                                }
                              }}
                            />
                          </div>
                          <div className="item-quantity">
                            <span>{item?.quantity}</span>
                          </div>
                          <div
                            className={`btn-plus ${
                              item?.quantity < 999 && !item?.isOutOfStock ? "" : "btn-plus-disabled"
                            }`}
                          >
                            <PlusQuantityIcon
                              className="btn-icon"
                              onClick={() => {
                                if (item?.quantity < 999 && !item?.isOutOfStock) {
                                  onChangeProductQuantity(item?.quantity + 1, index, true);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {item?.notes && (
                        <div className="cartMessage">
                          <div>
                            <img className="messageIcon" src={NoteIcon} alt="cart note" />
                          </div>
                          <div>
                            <div className="messageNote">{item?.notes}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="cart-checkout" onClick={() => handleCartCheckout()}>
            {translateData.checkout} ({formatTextNumber(totalAmount)}đ)
          </div>
        </div>
      ) : (
        <div className="no-cart-theme1-container">
          <div className="no-product-in-cart">
            <img src="/images/default-theme/no-product-in-cart.png" />
            <span>{translateData.youDontHaveAnyItemsInYourCart}</span>
          </div>
        </div>
      )}
      {isMaxWidth575 ? (
        <Drawer
          width={500}
          placement="bottom"
          closeIcon
          open={isModalVisible}
          onClose={handleCancel}
          forceRender={true}
          destroyOnClose={true}
          zIndex={1001}
        >
          <EditOrderProductDialogComponent
            isModalVisible={isModalVisible}
            initProductData={initProductData}
            initCurrentIndex={initCurrentIndex}
            onCancel={handleCancel}
            setCurrentCartItems={(cartItems) => {
              setCurrentCartItems(cartItems);
              onShowToastMessageUpdateCartItem();
            }}
            colorGroup={colorConfig}
            calculateShoppingCart={setStoreCart}
            platformId={Platform.StoreWebsite}
          />
        </Drawer>
      ) : (
        <Modal
          width={1400}
          className="modal-product-cart-detail"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={(null, null)}
          centered
          forceRender={true}
          destroyOnClose={true}
          zIndex={1001}
          key={modalKey}
        >
          <EditOrderProductDialogComponent
            isModalVisible={isModalVisible}
            initProductData={initProductData}
            initCurrentIndex={initCurrentIndex}
            onCancel={handleCancel}
            colorGroup={colorConfig}
            setCurrentCartItems={(cartItems) => {
              setCurrentCartItems(cartItems);
              onShowToastMessageUpdateCartItem();
            }}
            calculateShoppingCart={setStoreCart}
            platformId={Platform.StoreWebsite}
          />
        </Modal>
      )}
      <ConfirmationDialog
        open={isShowNotifyDialog}
        title={translateData.notification}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(translateData.soSorryNotificationWorkingHour, {
                timeWorkingHour: timeWorkingHour,
                dayOfWeek: t(dayOfWeek),
              }),
            }}
          ></span>
        }
        footer={[
          <Button className="btn-got-it" onClick={() => setIsShowNotifyDialog(false)}>
            {translateData.iGotIt}
          </Button>,
        ]}
        className="notification-time-out-working-hours"
        closable={false}
        maskClosable={true}
      />
      <NotificationDialog
        open={isShowMessageOutOfStock}
        title={translateData.notification}
        className="checkout-theme1-notify-dialog"
        content={translateData.textOutOfStockRemove}
        footer={[<Button onClick={handleConfirmNotify}>{translateData.okay}</Button>]}
        closable={true}
      />
    </StyledCartComponent>
  );
}
