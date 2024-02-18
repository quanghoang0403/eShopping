import { Drawer, Modal } from "antd";
import { t } from "i18next";
import { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { formatTextNumber } from "../../../../utils/helpers";
import checkout_arrow_down from "../../../assets/icons/checkout-arrow-down.svg";
import checkout_arrow_right from "../../../assets/icons/checkout-arrow-right.svg";
import checkoutDeleteIcon from "../../../assets/icons/checkout-delete.svg";
import productDefaultImage from "../../../assets/images/product-default-img.jpg";
import { EditOrderItem } from "../../../components/edit-order-item/edit-order-item.component";
import "./checkout.product.item.scss";
import { Platform } from "../../../../constants/platform.constants";
export default function CheckOutProductItem(props) {
  const { cartItem, currentIndex, onDeleteProduct, onUpdateCartQuantity, setCurrentCartItems, index } = props;
  const [isShowCombo, setIsShowCombo] = useState(false);
  const [visibleEditProduct, setVisibleEditProduct] = useState(false);

  const isMaxWidth500 = useMediaQuery({ maxWidth: 500 });
  const editOrderRef = useRef();
  if (!cartItem) return <></>;
  const isCombo = cartItem?.isCombo;
  const toppingPrice = isCombo ? cartItem?.totalOfToppingPrice : cartItem?.productPrice?.totalOfToppingPrice;
  const price = isCombo ? cartItem?.originalPrice : cartItem?.productPrice?.originalPrice;
  const priceWithDiscount = isCombo ? cartItem?.sellingPrice : cartItem?.productPrice?.priceValue;
  const discountPercentage = (price - priceWithDiscount) / price;
  const thumbnail = cartItem.thumbnail;
  const backgroundImageStyle = thumbnail
    ? {
        backgroundImage: "url(" + thumbnail + ")",
      }
    : {
        backgroundImage: "url(" + productDefaultImage + ")",
      };
  const total = priceWithDiscount * cartItem?.quantity;

  const renderProductOptions = () => {
    const result = cartItem?.options?.reduce(
      (result, item) => result + item.name + " (" + item.optionLevelName + ") / ",
      "",
    );

    return result;
  };

  const renderProductToppings = () => {
    const result = cartItem?.toppings?.reduce(
      (result, topping) => result + topping.quantity + "x " + topping.name + " / ",
      "",
    );

    return result;
  };

  const handleClose = () => {
    setVisibleEditProduct(false);
  };

  const onClickEditOrderItem = (item) => {
    editOrderRef?.current?.setProductData(item, currentIndex);
    setVisibleEditProduct(true);
  };

  const showCombo = () => {
    setIsShowCombo(!isShowCombo);
  };

  const onShowToastMessage = () => {
    dispatch(setToastMessageUpdateToCart(true));
    setTimeout(() => {
      dispatch(setToastMessageUpdateToCart(false));
    }, 3000);
  };

  return (
    <>
      <div className="product_cart_theme2">
        <div className="box_info">
          <div className="box_product_info">
            <div
              className="product_image"
              style={backgroundImageStyle}
              onClick={() => onClickEditOrderItem(cartItem)}
            ></div>
            <div className="product_info">
              <div className="name" onClick={() => onClickEditOrderItem(cartItem)}>
                {cartItem?.comboTypeId === 0 ? cartItem?.comboPricingName : cartItem?.name}
              </div>
              <div className="description">
                {renderProductOptions()}
                {renderProductToppings()}
              </div>
              {Math.round(discountPercentage * 100) > 0 && (
                <div className="discount">{Math.round(discountPercentage * 100)} %</div>
              )}
            </div>
          </div>
          <div className="box_price">
            <div className="priceWithDiscount">{formatTextNumber(priceWithDiscount + toppingPrice)}đ</div>
            {priceWithDiscount !== price && <div className="price">{formatTextNumber(price + toppingPrice)}đ</div>}
          </div>
          <div className="box_quantity">
            <div className="down" onClick={() => onUpdateCartQuantity(cartItem.id, -1, index)}>
              <span style={{ color: "white", display: "table", margin: "0 auto" }}>-</span>
            </div>
            <div className="quantity">{cartItem?.quantity}</div>
            <div className="up" onClick={() => onUpdateCartQuantity(cartItem.id, 1, index)}>
              <span style={{ color: "white", display: "table", margin: "0 auto" }}>+</span>
            </div>
          </div>
          <div className="box_total">
            <div className="totalAmount">{formatTextNumber(total)}đ</div>
            <div className="delete" onClick={() => onDeleteProduct(cartItem.id, index)}>
              <img src={checkoutDeleteIcon} alt={cartItem.message} style={{ width: 27.5, height: 32.5 }} />
            </div>
            {cartItem?.isCombo && (
              <img
                className="image_show_combo"
                src={isShowCombo ? checkout_arrow_down : checkout_arrow_right}
                alt={cartItem.name}
                onClick={showCombo}
              />
            )}
            {!cartItem?.isCombo && <div className="no_content">&nbsp;</div>}
          </div>
        </div>
        {isShowCombo && cartItem?.isCombo && (
          <div className="box_combo">
            {cartItem?.products?.map((product) => {
              const productOptions = product?.options?.reduce(
                (result, item) => result + item.name + " (" + item.optionLevelName + ") / ",
                "",
              );
              const productToppings = product?.toppings?.reduce(
                (result, topping) => result + topping.quantity + "x " + topping.name + " / ",
                "",
              );
              return (
                <>
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
                </>
              );
            })}
          </div>
        )}
      </div>
      {isMaxWidth500 ? (
        <Drawer
          width={500}
          placement="bottom"
          closeIcon
          open={visibleEditProduct}
          onClose={handleClose}
          title={t("option.selectOption")}
          forceRender={true}
          destroyOnClose={true}
          zIndex={9999}
        >
          <EditOrderItem
            ref={editOrderRef}
            onCancel={handleClose}
            setCurrentCartItems={(cartItems) => {
              setCurrentCartItems(cartItems);
              onShowToastMessage();
            }}
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
          forceRender={true}
          destroyOnClose={true}
          width={"60%"}
          zIndex={9999}
        >
          <EditOrderItem
            ref={editOrderRef}
            onCancel={handleClose}
            setCurrentCartItems={(cartItems) => {
              setCurrentCartItems(cartItems);
              onShowToastMessage();
            }}
            platformId={Platform.StoreWebsite}
          />
        </Modal>
      )}
    </>
  );
}
