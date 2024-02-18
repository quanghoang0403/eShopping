import { Drawer, Modal } from "antd";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Platform } from "../../../../constants/platform.constants";
import { formatTextNumber, getLabelPromotion } from "../../../../utils/helpers";
import { NoteIcon } from "../../../assets/icons.constants";
import checkout_arrow_down from "../../../assets/icons/checkout-arrow-down.svg";
import checkout_arrow_up from "../../../assets/icons/checkout-arrow-up.svg";
import deleteicon from "../../../assets/icons/delete.svg";
import productDefaultImage from "../../../assets/images/product-default-img.jpg";
import ImgDefault from "../../../assets/images/product-default.png";
import FnbDisplayImageCheckoutComponent from "../../../components/fnb-display-image-checkout/fnb-display-image-checkout.component";
import "./checkout.product.item.scss";
import { EditOrderProductDialogComponent } from "./edit-order-product-dialog.component";
export default function CheckOutProductItem(props) {
  const {
    cartItem,
    currentIndex,
    onDeleteProduct,
    onUpdateCartQuantity,
    setCurrentCartItems,
    index,
    calculateShoppingCart,
    setNote,
    onShowToastMessageUpdateCartItem,
    colorGroup,
  } = props;

  const [t] = useTranslation();
  const editOrderRef = useRef();
  const isMaxWidth575 = useMediaQuery({ maxWidth: 575 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isShowCombo, setIsShowCombo] = useState(false);
  const [modalKey, setModalKey] = useState(true);

  const [isShowDetail, setIsShowDetail] = useState(false);

  const translatedData = {
    leaveAMessageForTheStore: t("storeWebPage.generalUse.leaveAMessageForTheStore", "leaveAMessageForTheStore"),
    outOfStock: t("storeWebPage.productDetailPage.outOfStock", "outOfStock"),
  };
  if (!cartItem) return <></>;
  const isCombo = cartItem?.isCombo;
  const toppingPrice = isCombo ? cartItem?.totalOfToppingPrice : cartItem?.productPrice?.totalOfToppingPrice;
  const toppingOriginalPrice = isCombo
    ? cartItem?.totalOfToppingPrice
    : cartItem?.productPrice?.totalOfToppingOriginalPrice;
  const price = isCombo ? cartItem?.originalPrice : cartItem?.productPrice?.originalPrice;
  const priceWithDiscount = isCombo
    ? cartItem?.sellingPrice
    : cartItem?.isFlashSale
    ? cartItem?.productPrice?.priceValue
    : cartItem?.productPrice?.priceAfterDiscountInStore;
  const thumbnail = cartItem.thumbnail;
  const backgroundImageStyle = thumbnail
    ? {
        backgroundImage: "url(" + thumbnail + ")",
      }
    : {
        backgroundImage: "url(" + productDefaultImage + ")",
      };

  const maxQuantity = 1000;
  const promotionTitle = getLabelPromotion(
      cartItem?.isFlashSale,
      cartItem?.productPrice?.isPercentDiscount,
      cartItem?.productPrice?.discountValue,
      cartItem?.productPrice?.isApplyPromotion,
      cartItem?.productPrice?.originalPrice,
      cartItem?.productPrice?.priceValue,
      "đ",
      false,
    );
  const sizeName = isCombo ? undefined : cartItem?.productPrice?.priceName;
  const renderProductOptions = () => {
    const newOptions = cartItem?.options?.filter((e) => e.isSetDefault == false);
    const result = newOptions?.map((item) => item.name + " (" + item.optionLevelName + ")")?.join(" / ");
    return result;
  };

  const renderProductToppings = () => {
    const result = cartItem?.toppings
      ?.filter((topping) => topping?.quantity > 0)
      ?.map((topping) => topping.quantity + "x " + topping.name)
      ?.join(" / ");
    return result;
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalKey(!modalKey);
  };

  const onClickProductCartItem = (item) => {
    editOrderRef?.current?.setProductData(item, currentIndex);
    setIsModalVisible(true);
  };

  const showDetail = () => {
    setIsShowDetail(!isShowDetail);
  };

  return (
    <>
      <div className="product_cart_theme1">
        <div className={`box_info ${cartItem?.isOutOfStock ? "out-of-stock" : ""}`}>
          <div className="box_product_info">
            <div
              className={`product_image${cartItem?.isFlashSale ? " flash-sale-border" : ""}`}
              onClick={() => onClickProductCartItem(cartItem)}
            >
              <FnbDisplayImageCheckoutComponent
                src={
                  cartItem?.thumbnail == null || cartItem?.thumbnail.trim() === "" ? ImgDefault : cartItem?.thumbnail
                }
                isFlashSale={cartItem?.isFlashSale}
                flashSaleTitle={promotionTitle}
                outOfStockText={cartItem?.isOutOfStock ? translatedData.outOfStock : null}
              />
            </div>
            <div className="product_info">
              <div className="name text-line-clamp-2" onClick={() => onClickProductCartItem(cartItem)}>
                {cartItem?.comboTypeId === 0
                  ? cartItem?.dataDetails?.combo?.name || cartItem?.comboPricingName
                  : cartItem?.name || cartItem?.dataDetails?.name}
                {sizeName && ` (${sizeName})`}
              </div>
              <div className="description text-line-clamp-2">
                {renderProductOptions()}
                {renderProductToppings()}
              </div>
              <div className="price_box">
                <div className="priceWithDiscount">{formatTextNumber(priceWithDiscount + toppingPrice)}đ</div>
                {priceWithDiscount !== price && !cartItem?.isCombo && !cartItem?.isFlashSale && (
                  <div className="price">{formatTextNumber(price + (toppingOriginalPrice ?? 0))}đ</div>
                )}
              </div>
            </div>
          </div>
          <div className={`box_quantity`}>
            <div className="change-quantity-group">
              <div
                className="down"
                onClick={() => {
                  //If quantity = 1, do nothing
                  if (cartItem.quantity <= 1) {
                    return;
                  }
                  onUpdateCartQuantity(cartItem.id, -1, index, false);
                }}
              >
                <span>-</span>
              </div>
              <div className="quantity">{cartItem.quantity}</div>
              <div
                className="up"
                onClick={() => {
                  if (cartItem.quantity >= maxQuantity || cartItem?.isOutOfStock) return;
                  onUpdateCartQuantity(cartItem.id, 1, index, true);
                }}
              >
                <span className="quantity-icon">+</span>
              </div>
            </div>
            <div className="delete" onClick={() => onDeleteProduct(cartItem.id, index)}>
              <img src={deleteicon} alt={cartItem.message} style={{ width: 26, height: 31 }} />
            </div>
            {cartItem?.isCombo && (
              <img
                className="image_show_combo"
                src={isShowDetail ? checkout_arrow_up : checkout_arrow_down}
                alt={cartItem.name}
                onClick={showDetail}
              />
            )}
          </div>
        </div>
        {isShowDetail && (
          <>
            {cartItem?.isCombo && (
              <div className="box_combo">
                {cartItem?.products?.map((product) => {
                  const productOptions = product?.options
                    ?.map((item) => item.name + " (" + item.optionLevelName + ")")
                    ?.join(" / ");
                  const productToppings = product?.toppings
                    ?.filter((topping) => topping?.quantity > 0)
                    ?.map((topping) => topping.quantity + "x " + topping.name)
                    ?.join(" / ");
                  return (
                    <div className="box_combo_item">
                      <img
                        className="product_image"
                        src={product.thumbnail ? product.thumbnail : productDefaultImage}
                        alt={product.name}
                      />
                      <div className="box_product">
                        <div className="product_name">{product.name}</div>
                        <div className="product_options">
                          {productOptions}
                          {productToppings}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        <div>
          {cartItem?.notes && (
            <div className="cartMessage">
              <div>
                <NoteIcon className="messageIcon" />
              </div>
              <div>
                <div className="messageNote">{cartItem?.notes}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMaxWidth575 ? (
        <Drawer
          width={500}
          placement="bottom"
          closeIcon
          open={isModalVisible}
          onClose={handleCancel}
          forceRender={true}
          destroyOnClose={true}
          zIndex={9999}
        >
          <EditOrderProductDialogComponent
            colorGroup={colorGroup}
            ref={editOrderRef}
            onCancel={handleCancel}
            setCurrentCartItems={(cartItems) => {
              setCurrentCartItems(cartItems);
              onShowToastMessageUpdateCartItem();
            }}
            calculateShoppingCart={calculateShoppingCart}
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
          zIndex={9999}
          key={modalKey}
        >
          <EditOrderProductDialogComponent
            colorGroup={colorGroup}
            ref={editOrderRef}
            onCancel={handleCancel}
            setCurrentCartItems={(cartItems) => {
              setCurrentCartItems(cartItems);
              onShowToastMessageUpdateCartItem();
            }}
            calculateShoppingCart={calculateShoppingCart}
            platformId={Platform.StoreWebsite}
          />
        </Modal>
      )}
    </>
  );
}
