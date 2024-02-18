import { Col, Row } from "antd";
import { useState } from "react";
import { formatTextNumber, getLabelPromotion } from "../../../../../utils/helpers";
import { ArrowBoldDownIcon, ArrowBoldUpIcon, DeleteIcon, NoteIcon } from "../../../../assets/icons.constants";
import DisplayImageComponent from "../../../../components/display-image/DisplayImageComponent";
import "./CartItemComponent.scss";

function CartItemComponent(props) {
  const { cartItem, onDeleteProduct, onUpdateCartQuantity, onEdit, index } = props;
  const [isShowComboDetail, setIsShowComboDetail] = useState(false);
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
  const isShowOriginalPrice = priceWithDiscount !== price && !cartItem?.isCombo;
  let promotionTitle = "";
  if (cartItem?.isPromotion || cartItem?.productPrice?.isApplyPromotion) {
    promotionTitle =
      "-" +
      getLabelPromotion(
        cartItem?.isFlashSale,
        cartItem?.productPrice?.isPercentDiscount,
        cartItem?.productPrice?.discountValue,
        cartItem?.productPrice?.isApplyPromotion,
        cartItem?.productPrice?.originalPrice,
        cartItem?.productPrice?.priceValue,
        "đ",
        false,
      );
  }

  const sizeName = isCombo ? undefined : cartItem?.productPrice?.priceName;
  const renderProductOptions = (options = []) => {
    const result = options?.map((item) => item.name + ": " + item.optionLevelName)?.join(" / ");
    return result;
  };

  const renderProductToppings = (toppings = []) => {
    const result = toppings
      ?.filter((topping) => topping?.quantity > 0)
      ?.map((topping) => (
        <div className="topping-item">
          <div className="topping-text">{"x" + topping.quantity + " " + topping.name}</div>
          <div className="topping-price">{formatTextNumber(topping?.priceValue)}đ</div>
        </div>
      ));

    return result;
  };

  const showComboDetail = () => {
    setIsShowComboDetail(true);
  };

  const hideComboDetail = () => {
    setIsShowComboDetail(false);
  };

  return (
    <div className="pos-cart-item">
      <div className="pos-cart-item-overall">
        <div className="image" onClick={() => onEdit(cartItem.id, index)}>
          <DisplayImageComponent
            className="product-cart-item-image"
            promotionTag={promotionTitle}
            src={cartItem?.thumbnail}
          />
        </div>
        <Row wrap={false} className="content">
          <Col flex={"auto"} className="info">
            <div className="name text-line-clamp-2" onClick={() => onEdit(cartItem.id, index)}>
              {cartItem?.comboTypeId === 0
                ? cartItem?.dataDetails?.combo?.itemName ?? cartItem?.comboPricingName
                : cartItem?.name ?? cartItem?.dataDetails?.name}
              {sizeName ? " (" + sizeName + ")" : undefined}
            </div>
            <div className="option text-line-clamp-2">{renderProductOptions(cartItem?.options)}</div>
            <div className="topping">{renderProductToppings(cartItem?.toppings)}</div>
            <div className="price">
              <div className="selling-price">{formatTextNumber(priceWithDiscount + toppingPrice)}đ</div>
              {isShowOriginalPrice && (
                <div className="original-price">{formatTextNumber(price + (toppingOriginalPrice ?? 0))}đ</div>
              )}
            </div>
          </Col>
          <Col flex={"none"} className="action">
            <div className="change-quantity-group">
              <div
                className="button-change-quantity down"
                onClick={() => {
                  //If quantity = 1, do nothing
                  if (cartItem.quantity <= 1) {
                    return;
                  }
                  onUpdateCartQuantity(cartItem.id, -1, index);
                }}
              >
                <span>-</span>
              </div>
              <div className="quantity">{cartItem.quantity}</div>
              <div
                className="button-change-quantity up"
                onClick={() => {
                  onUpdateCartQuantity(cartItem.id, 1, index);
                }}
              >
                <span className="quantity-icon">+</span>
              </div>
            </div>
            <div className="active-other">
              <div className="delete" onClick={() => onDeleteProduct(cartItem.id, index)}>
                <DeleteIcon />
              </div>
              {cartItem?.isCombo ? (
                <div className="show-combo-detail">
                  {
                    <>
                      {isShowComboDetail ? (
                        <ArrowBoldUpIcon onClick={hideComboDetail} />
                      ) : (
                        <ArrowBoldDownIcon onClick={showComboDetail} />
                      )}
                    </>
                  }
                </div>
              ) : (
                <div className="show-combo-detail-empty"></div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      {isShowComboDetail && (
        <div className="detail">
          {cartItem?.products?.map((product) => (
            <Row wrap={false} className="item">
              <Col flex={"none"} className="image">
                <DisplayImageComponent className="product-cart-item-image" src={product?.thumbnail} />
              </Col>
              <Col flex={"auto"} className="item-info">
                <div className="name">{product.name}</div>
                <div className="option">{renderProductOptions(product?.options)}</div>
                <div className="topping">{renderProductToppings(product?.toppings)}</div>
              </Col>
            </Row>
          ))}
        </div>
      )}
      {cartItem?.notes && (
        <div className="cart-item-note">
          <NoteIcon className="note-icon" />
          <div>
            <div className="note-text">{cartItem?.notes}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartItemComponent;
