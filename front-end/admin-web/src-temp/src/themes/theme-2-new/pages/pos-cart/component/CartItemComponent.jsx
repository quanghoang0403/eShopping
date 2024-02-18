import { Drawer, Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Platform } from "../../../../constants/platform.constants";
import { store } from "../../../../modules/index";
import { setToastMessageUpdateToCart } from "../../../../modules/toast-message/toast-message.actions";
import shoppingCartService from "../../../../services/shopping-cart/shopping-cart.service";
import { formatTextNumber } from "../../../../utils/helpers";
import { CheckoutDeleteIcon, MinusQuantityIcon, PlusQuantityIcon } from "../../../assets/icons.constants";
import cartNote from "../../../assets/icons/cart-note.svg";
import EditOrderItem from "../../../components/edit-order-item/edit-order-item.component";
import FnbDisplayImageComponent from "../../../components/fnb-display-image/fnb-display-image.component";
import PageType from "../../../constants/page-type.constants";
import { backgroundTypeEnum } from "../../../constants/store-web-page.constants";
import { currency } from "../../../constants/string.constant";
import "./checkout-order-items.scss";
export default function CheckoutOrderItems(props) {
  const {
    cartItem,
    currentIndex,
    onDeleteProduct,
    onUpdateCartQuantity,
    setCurrentCartItems,
    index,
    storageConfig,
    initDataShoppingCart,
    calculateShoppingCart,
    isCart,
    isPos,
    showUpdateOrderItemPos,
  } = props;
  const [isShowCombo, setIsShowCombo] = useState(false);
  const [visibleEditProduct, setVisibleEditProduct] = useState(false);
  const [styleBody, setStyleBody] = useState({});
  const [productSelectEdit, setProductSelectEdit] = useState(null);
  const [indexDefault, setIndexDefault] = useState(0);

  const isMobile = useMediaQuery({ maxWidth: 740 });
  const dispatch = useDispatch();
  if (!cartItem) return <></>;
  const isCombo = cartItem?.isCombo;
  /**
   * Total Topping price per unit
   */
  const toppingPrice = isCombo
    ? cartItem?.totalOfToppingPrice / cartItem?.quantity
    : cartItem?.productPrice?.totalOfToppingPrice;

  const toppingOriginalPrice = isCombo
    ? cartItem?.totalOfToppingPrice
    : cartItem?.productPrice?.totalOfToppingOriginalPrice;
  const originalPrice = isCombo ? cartItem?.originalPrice : cartItem?.productPrice?.originalPrice;
  const priceWithDiscount = isCombo
    ? cartItem?.sellingPrice
    : Boolean(cartItem?.productPrice?.flashSaleId)
    ? cartItem?.productPrice?.priceValue
    : cartItem?.productPrice?.priceAfterDiscountInStore;
  const originalPriceIncludeTopping = originalPrice + toppingOriginalPrice;
  const priceWithDiscountIncludeTopping =
    (isCombo
      ? cartItem?.sellingPrice
      : Boolean(cartItem?.productPrice?.flashSaleId)
      ? cartItem?.productPrice?.priceValue
      : cartItem?.productPrice?.priceAfterDiscountInStore) + toppingPrice;

  const discountPercentage = (originalPrice - priceWithDiscount) / originalPrice;
  const thumbnail = cartItem.thumbnail;
  const total = ((priceWithDiscount ?? 0) + (toppingPrice ?? 0)) * cartItem?.quantity;
  const handleClose = () => {
    initDataShoppingCart();
    setVisibleEditProduct(false);
    callApiValidateCartItems(false);
  };

  function renderPromotionTag(cartItem) {
    let promotionTag = "";
    if (cartItem?.productPrice?.isApplyPromotion) {
      if (cartItem?.productPrice?.isPercentDiscount) {
        promotionTag = cartItem?.productPrice?.discountValue + "%";
      } else {
        promotionTag = formatTextNumber(cartItem?.productPrice?.discountValue) + "đ";
      }
    }
    return promotionTag;
  }

  const callApiValidateCartItems = async (isCheckChangedData, cartItems, callBack) => {
    let isChangedProductPrice = true;
    if (!cartItems || cartItems?.length === 0) {
      const reduxState = store.getState();
      const session = reduxState?.session;
      cartItems = session?.cartItems ?? [];
    }
    // Get data from redux to verify. Done then save to local storage and redux.
    const dataRequest = {
      cartItems: cartItems,
      isCheckChangedData: isCheckChangedData,
    };
    isChangedProductPrice = shoppingCartService.verifyAndUpdateCart(dataRequest);
    return isChangedProductPrice;
  };

  const onClickEditOrderItem = (item, index) => {
    if (isPos) {
      showUpdateOrderItemPos && showUpdateOrderItemPos();
      return;
    }
    initBackgroundBody();
    setProductSelectEdit(item);
    setIndexDefault(index);
    setVisibleEditProduct(true);
  };

  //Config Edit order item === Config ProductDetail || ComboDetail
  const initBackgroundBody = () => {
    const { pages } = storageConfig;
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
    setStyleBody({ ...style, marginTop: "32px" });
  };
  //Config Edit order item

  const showCombo = () => {
    setIsShowCombo(!isShowCombo);
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageUpdateToCart(true));
    setTimeout(() => {
      dispatch(setToastMessageUpdateToCart(false));
    }, 3000);
  };

  const renderComboItem = () => {
    return (
      cartItem?.isCombo && (
        <div className="box-combo">
          {cartItem?.products?.map((product) => {
            const productOptionsNotDefault = product?.options?.filter((itemOption) => !itemOption?.isSetDefault);
            const productOptions = productOptionsNotDefault?.map((itemOption) => {
              return `${itemOption?.name} (${itemOption?.optionLevelName})`;
            });
            return (
              <>
                <div className="box-combo-item">
                  <div className="product-name text-line-clamp-1">{product.name}</div>
                  <div className="product-option text-line-clamp-1">{productOptions?.join(" , ")}</div>
                  <div className="product-topping">
                    {product?.toppings?.reduce((total, topping) => {
                      return total + topping.quantity;
                    }, 0) > 0 && (
                      <>
                        {product?.toppings?.map((itemTopping) => {
                          return (
                            itemTopping?.quantity > 0 && (
                              <div className="topping-item">
                                <div className="name text-line-clamp-1">{itemTopping?.name}</div>
                                <div>x {itemTopping?.quantity}</div>
                                <div className="price-value">
                                  {formatTextNumber(itemTopping?.priceValue)}
                                  {currency.d}
                                </div>
                              </div>
                            )
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
      )
    );
  };

  const renderCheckoutItemQuantity = () => {
    return (
      <>
        <MinusQuantityIcon
          className="quantity-icon"
          onClick={() => {
            if (cartItem?.quantity > 1) {
              isCart
                ? onUpdateCartQuantity(cartItem?.isCombo, cartItem?.quantity - 1, index, false)
                : onUpdateCartQuantity(cartItem?.id, -1, index);
            } else {
              onUpdateCartQuantity(cartItem?.isCombo, cartItem?.quantity - 1, index, false);
            }
          }}
        />
        <div className="quantity">{cartItem?.quantity}</div>
        <PlusQuantityIcon
          className="quantity-icon"
          onClick={() =>
            isCart
              ? onUpdateCartQuantity(cartItem?.isCombo, cartItem?.quantity + 1, index, true)
              : onUpdateCartQuantity(cartItem?.id, 1, index)
          }
        />
      </>
    );
  };

  const renderItemOptions = () => {
    const productOptionsNotDefault = cartItem?.options?.filter((itemOption) => !itemOption?.isSetDefault);
    const options = productOptionsNotDefault?.map((itemOption) => {
      return `${itemOption?.name} (${itemOption?.optionLevelName})`;
    });
    return options?.join(" , ");
  };

  const renderItemToppings = () => {
    return (
      cartItem?.toppings?.reduce((total, topping) => {
        return total + topping.quantity;
      }, 0) > 0 && (
        <div className="toppings">
          {cartItem?.toppings?.map((itemTopping) => {
            return (
              itemTopping?.quantity > 0 && (
                <div className="topping-item">
                  <div className="name text-line-clamp-1">{itemTopping?.name}</div>
                  <div>x {itemTopping?.quantity}</div>
                  <div className="price-value">
                    <div className="topping-price-col">
                      <span>
                        {formatTextNumber(itemTopping?.priceValue)}
                        {currency.d}
                      </span>
                      {itemTopping?.priceValue < itemTopping?.originalPrice && (
                        <span className="topping-original-price">
                          {formatTextNumber(itemTopping?.originalPrice)}
                          {currency.d}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      )
    );
  };

  const renderItemPrice = () => {
    return (
      <div className="order-item-price">
        <div className="price-after-discount">
          {formatTextNumber(Math.round(priceWithDiscountIncludeTopping))}
          {currency.d}
        </div>
        {!isCombo && !cartItem?.isFlashSale && originalPrice !== 0 && originalPrice > priceWithDiscount && (
          <div className="price">
            {formatTextNumber(originalPriceIncludeTopping)}
            {currency.d}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile ? (
        <>
          <div className="checkout-order-item-theme-2">
            <div className="order-item-image" onClick={() => onClickEditOrderItem(cartItem, index)}>
              <FnbDisplayImageComponent src={thumbnail} isFlashSale={Boolean(cartItem?.productPrice?.flashSaleId)} />
            </div>
            <div className="order-item">
              <div className="order-item-info">
                <div className="name text-line-clamp-2" onClick={() => onClickEditOrderItem(cartItem, index)}>
                  {cartItem?.name}{" "}
                  {cartItem?.productPrice?.priceName !== undefined ? "(" + cartItem?.productPrice?.priceName + ")" : ""}
                </div>
                <CheckoutDeleteIcon className="delete-icon" onClick={() => onDeleteProduct(cartItem.id, index)} />
              </div>
              {cartItem?.productPrice?.isApplyPromotion && (
                <div className="discount">{renderPromotionTag(cartItem)}</div>
              )}
              {renderItemPrice()}
              <div className="options">{renderItemOptions()}</div>
              {renderItemToppings()}
              {renderComboItem()}
              <div className="order-item-quantity-total">
                <div className="order-item-quantity">{renderCheckoutItemQuantity()}</div>
                <div className="order-item-total">
                  <div className="total-amount">
                    {formatTextNumber(Math.round(total))}
                    {currency.d}
                  </div>
                </div>
              </div>
              {cartItem?.notes && (
                <div className="cartMessageCheckout">
                  <img className="messageIconCheckout" src={cartNote} alt="cart note" />
                  <div className="messageNoteCheckout">{cartItem?.notes}</div>
                </div>
              )}
            </div>
          </div>
          <Drawer
            className="drawer-product-cart-detail"
            placement="bottom"
            open={visibleEditProduct}
            onClose={handleClose}
            destroyOnClose={true}
            closable={false}
            style={styleBody}
          >
            <EditOrderItem
              dataEdit={productSelectEdit}
              indexDefault={indexDefault}
              onCancel={handleClose}
              stateConfig={storageConfig}
              calculateShoppingCart={calculateShoppingCart}
              platformId={Platform.POS}
            />
          </Drawer>
        </>
      ) : (
        <>
          <div className="checkout-order-item-theme-2">
            <div className="order-item">
              <div className="order-item-info">
                <div className="order-item-image" onClick={() => onClickEditOrderItem(cartItem, index)}>
                  <FnbDisplayImageComponent
                    src={thumbnail}
                    isFlashSale={!isPos ? Boolean(cartItem?.isFlashSale) : false}
                  />
                </div>
                <div className="name-info">
                  <div className="name text-line-clamp-2" onClick={() => onClickEditOrderItem(cartItem, index)}>
                    {cartItem?.name}{" "}
                    {cartItem?.productPrice?.priceName !== undefined
                      ? "(" + cartItem?.productPrice?.priceName + ")"
                      : ""}
                  </div>
                  {cartItem?.productPrice?.isApplyPromotion && (
                    <div className="discount">{renderPromotionTag(cartItem)}</div>
                  )}

                  <div className="options">{renderItemOptions()}</div>
                </div>
              </div>
              {renderItemPrice()}
              <div className="order-item-quantity">{renderCheckoutItemQuantity()}</div>
              <div className="order-item-total">
                <div className="total-amount">
                  {formatTextNumber(Math.round(total))}
                  {currency.d}
                </div>
                <CheckoutDeleteIcon className="delete-icon" onClick={() => onDeleteProduct(cartItem.id, index)} />
              </div>
            </div>
            {renderItemToppings()}
            {renderComboItem()}
            {cartItem?.notes && (
              <div className="cartMessageCheckout">
                <img className="messageIconCheckout" src={cartNote} alt="cart note" />
                <div className="messageNoteCheckout">{cartItem?.notes}</div>
              </div>
            )}
          </div>
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
              stateConfig={storageConfig}
              calculateShoppingCart={calculateShoppingCart}
              platformId={Platform.POS}
            />
          </Modal>
        </>
      )}
    </>
  );
}
