import { Collapse, Popover } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { posDiscountCodesSelector } from "../../../../../modules/order/order.reducers";
import { setDiscountCodes } from "../../../../../modules/session/session.actions";
import posCartService from "../../../../../services/pos/pos-cart.services";
import { formatTextCurrency, formatTextNumber } from "../../../../../utils/helpers";
import {
  OrderDetailArrowDownIcon,
  OrderDetailArrowUpIcon,
  RemoveDiscountCodeIcon,
} from "../../../../assets/icons.constants";
import { enumOrderType } from "../../../../constants/enum";
import CheckOutDiscounts from "../checkout-discounts";
import CheckOutTaxes from "../checkout-taxes";
import { ReactComponent as ArrowDownIcon } from "./arrow-down-icon.svg";
import "./checkout-summary.style.scss";
export const CheckoutSummary = forwardRef((props, ref) => {
  const { isDefault, calculateShoppingCart, isPos } = props;
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const cartValidated = useSelector((state) => state?.session?.orderInfo?.cartValidated ?? null);
  const shippingFee = useSelector((state) => state?.session?.orderInfo?.shippingFee ?? null);
  const discountCodes = useSelector((state) => state?.session?.discountCodes ?? []); // Todo use
  const discountCodesPos = useSelector(posDiscountCodesSelector); // Todo use
  const listDiscountCode = isPos ? discountCodesPos : discountCodes;
  const deliveryAddress = useSelector((state) => state?.session?.deliveryAddress);
  const [isShowFeeAndTax, setIsShowFeeAndTax] = useState(false);
  const [isShowDiscount, setIsShowDiscount] = useState(false);
  const calTotalAmount = (value1, value2) => {
    const v1 = value1 ?? 0;
    const v2 = value2 ?? 0;
    return v1 + v2;
  };

  const orderInfo = {
    totalItem: cartValidated?.cartItems?.length,
    subTotal: cartValidated?.originalPrice ?? "N/A",
    customerDiscountAmount: cartValidated?.customerDiscountAmount ?? "N/A",
    discount: cartValidated?.totalDiscountAmount ?? "N/A",
    feeTax: calTotalAmount(cartValidated?.totalFee, cartValidated?.totalTax),
    total:
      calTotalAmount(
        cartValidated?.totalPriceAfterDiscount,
        deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && !isPos ? shippingFee : 0,
      ) ?? "N/A",
    pointUser: cartValidated?.calculateCustomerLoyaltyPoint?.pointUsed,
  };
  const [iShowIconFeeTax, setIShowIconFeeTax] = useState(true);
  const hasDiscounts =
    (cartValidated?.promotionsSummary && cartValidated?.promotionsSummary?.length > 0) ||
    cartValidated?.customerDiscountAmount > 0 ||
    cartValidated?.calculateCustomerLoyaltyPoint?.pointUsed > 0 ||
    cartValidated?.cartItems?.filter((x) => x.isFlashSale).length > 0;
  const hasTaxes = cartValidated?.taxes && cartValidated?.taxes?.length > 0;
  const hasFees = cartValidated?.fees && cartValidated?.fees?.length > 0;

  const taxes = useSelector((state) => state?.session?.orderInfo?.cartValidated?.taxes ?? []);
  const fees = useSelector((state) => state?.session?.orderInfo?.cartValidated?.fees ?? []);
  const shouldShowIconFeeTax = taxes.some((tax) => tax.value > 0) || fees.some((fee) => fee.value > 0);

  useEffect(() => {
    setIShowIconFeeTax(shouldShowIconFeeTax);
  }, [shouldShowIconFeeTax]);

  const collapseText = `Discount, Fee and tax information here`;
  const panelStyle = {
    background: "#F9F9F9",
    border: "none",
  };
  const fontweightchange = isDefault ? 600 : 400;
  const translatedData = {
    subTotal: t("checkOutPage.subTotal", "Subtotal"),
    item: t("checkOutPage.items", "items"),
    discount: t("checkOutPage.discount", "Discount"),
    feeTax: t("checkOutPage.feeAndTax", "Fee & Tax"),
    total: t("checkOutPage.total", "Total"),
    shippingFee: t("checkOutPage.shippingFee", "Shipping Fee"),
  };

  useImperativeHandle(ref, () => ({}));

  function handleRemoveDiscountCode(discountCode) {
    if (isPos) {
      posCartService.removeDiscountCode(discountCode);
    } else {
      const index = discountCodes?.indexOf(discountCode);
      if (index !== -1) {
        discountCodes.splice(index, 1);
        dispatch(setDiscountCodes(discountCodes));
      }
    }
    calculateShoppingCart();
  }

  return (
    <div className="theme2-checkout-summary">
      <div className="checkout-summary-container">
        {/* Subtotal */}
        <div className="sub-total">
          <span>{`${translatedData.subTotal} (${orderInfo?.totalItem ?? "0"} ${translatedData.item})`}</span>
          <span>{formatTextNumber(orderInfo?.subTotal)}đ</span>
        </div>

        {/* Discount */}
        <Collapse className="checkout-summary-detail-collapse" ghost>
          <Collapse.Panel
            collapsible="disabled"
            header={
              <div className="discount">
                <div className="text-box">
                  <span style={{ fontWeight: fontweightchange }}>{translatedData.discount}</span>
                  {hasDiscounts && (
                    <div className="icon-box">
                      <Popover
                        placement="top"
                        content={<CheckOutDiscounts isPos={isPos} />}
                        trigger="click"
                        open={isShowDiscount}
                        onOpenChange={(isShowDiscount) => setIsShowDiscount(isShowDiscount)}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        showArrow={false}
                        overlayClassName="checkout-discount-popover"
                      >
                        {!isShowDiscount ? <OrderDetailArrowDownIcon /> : <OrderDetailArrowUpIcon />}
                      </Popover>
                    </div>
                  )}
                </div>

                <span>-{formatTextNumber(Math.round(orderInfo?.discount))}đ</span>
              </div>
            }
            style={panelStyle}
            showArrow={false}
          >
            <p>{collapseText}</p>
          </Collapse.Panel>
        </Collapse>

        {listDiscountCode && (
          <div className="discount-code-tags">
            {listDiscountCode?.map((item) => {
              return (
                <div className="discount-code-tag">
                  {item}
                  <div className="remove-icon" onClick={() => handleRemoveDiscountCode(item)}>
                    <RemoveDiscountCodeIcon />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fee & tax */}
        <Collapse className="checkout-summary-detail-collapse" ghost>
          <Collapse.Panel
            collapsible="disabled"
            header={
              <div className="fee-tax">
                <div className="text-box">
                  <span style={{ fontWeight: fontweightchange }}>{translatedData.feeTax}</span>
                  {(hasTaxes || hasFees) && (
                    <div className="icon-box">
                      <Popover
                        placement="bottom"
                        content={<CheckOutTaxes originalPrice={cartValidated?.originalPrice} />}
                        trigger="click"
                        open={isShowFeeAndTax}
                        onOpenChange={(isShowFeeAndTax) => setIsShowFeeAndTax(isShowFeeAndTax)}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        showArrow={false}
                      >
                        {iShowIconFeeTax && <ArrowDownIcon />}
                      </Popover>
                    </div>
                  )}
                </div>

                <span>{formatTextCurrency(orderInfo?.feeTax)}</span>
              </div>
            }
            style={panelStyle}
            showArrow={false}
          >
            <p>{collapseText}</p>
          </Collapse.Panel>
        </Collapse>

        {deliveryAddress?.orderType === enumOrderType.ONLINE_DELIVERY && !isPos && (
          <div className="shipping-fee">
            <span style={{ fontWeight: fontweightchange }}>{translatedData.shippingFee}</span>
            <span>{formatTextNumber(shippingFee)} đ</span>
          </div>
        )}
        <div className="line"></div>

        {/* Total */}
        <div className="total">
          <span>{translatedData.total}</span>
          <span>{formatTextNumber(Math.round(orderInfo?.total + orderInfo?.feeTax))}đ</span>
        </div>
      </div>
    </div>
  );
});
