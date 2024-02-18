import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "../../../../../constants/platform.constants";
import { formatDate, formatTextNumber, getLabelPromotion, roundNumber } from "../../../../../utils/helpers";
import { DeliveryHeaderIcon, InStoreIcon, TakeAwayIcon } from "../../../../assets/icons.constants";
import { IconPickupCustomize } from "../../../../assets/icons/PickupDeliveryIcon";
import FnbDisplayImageComponent from "../../../../components/fnb-display-image/fnb-display-image.component";
import { EnumOrderStatusStoreWeb, enumOrderType } from "../../../../constants/enum";
import { DateFormat } from "../../../../constants/string.constant";
import ReOrderComponent from "./components/re-order-component";
import OrderButtonComponent from "./order-button.component";
import "./order-card.component.scss";
import OrderStatusComponent from "./order-status.component";

export default function OrderCardComponent(props) {
  const { data, navigateToOrderDetail, onRefesh } = props;
  const [isReOrder, setIsReOrder] = useState(false);
  const [t] = useTranslation();
  const [orderDetailData, setOrderDetailData] = useState();
  const [isLoadingReOrder, setIsLoadingReOrder] = useState(false);
  const [isQRCodeInstore, setIsQRCodeInstore] = useState(null);
  const translateData = {
    items: t("orderStatus.items", "Items"),
    cash: t("paymentMethod.cash", "Cash"),
    moMo: t("paymentMethod.moMo", "MoMo"),
    atm: t("paymentMethod.atm", "ATM"),
    bankTransfer: t("paymentMethod.bankTransfer", "Bank transfer"),
    isCash: "Cash",
    isMoMo: "MoMo",
    isATM: "ATM",
    isBankTransfer: "Bank Transfer",
    COD: "COD",
    otherPayment: "Other Payment",
    totalAmount: t("orderStatus.totalAmount", "Total amount"),
    toPickup: t("checkOutPage.toPickup", "Tự lấy hàng"),
    delivery: t("checkOutPage.delivery", "Giao hàng"),
    inStore: t("storeWebPage.profilePage.inStore", "Note"),
    takeAway: t("storeWebPage.profilePage.takeAway", "Note"),
    onlineDelivery: t("storeWebPage.profilePage.onlineDelivery", "Note"),
    platform: t("storeWebPage.profilePage.platform", "Platform"),
  };
  const firstOrderItem = data?.orderItems[0];
  useEffect(() => {
    if (
      data?.orderTypeId == 0 &&
      (data?.platformId?.toLowerCase() === Platform.StoreWebsite.toLowerCase() ||
        data?.platformId?.toLowerCase() === Platform.StoreMobileApp.toLowerCase())
    ) {
      setIsQRCodeInstore(true);
    } else {
      setIsQRCodeInstore(false);
    }
  }, [data]);

  const translatePayment = (data) => {
    switch (data.toLowerCase()) {
      case translateData.isCash.toLowerCase():
        return translateData.cash;
      case translateData.COD.toLowerCase():
        return translateData.COD;
      case translateData.isMoMo.toLowerCase():
        return translateData.moMo;
      case translateData.isBankTransfer.toLowerCase():
        return translateData.bankTransfer;
      default:
        return translateData.atm;
    }
  };

  const renderToppings = (toppings) => {
    if (!toppings) {
      return <></>;
    }

    let render = toppings?.map((topping) => (
      <>
        <Col xs={11} sm={13} className="topping topping-name">
          {topping?.toppingName}
        </Col>
        <Col xs={3} sm={2} className="topping topping-quantity">
          x{topping?.quantity}
        </Col>
        <Col xs={10} sm={9} className="topping topping-price">
          <div className="topping-price-col">
            <span className="topping-price-value">{formatTextNumber(topping?.priceAfterDiscount)}đ</span>
            {topping?.priceAfterDiscount < topping?.originalPrice && (
              <span className="topping-original-price">{formatTextNumber(topping?.originalPrice)}đ</span>
            )}
          </div>
        </Col>
      </>
    ));
    return render;
  };

  const renderOptions = (options) => {
    if (!options) {
      return <></>;
    }

    let render = options?.map((option) => option?.optionName + ` (${option?.optionLevelName})`);
    render = render.toString().replace(",", ", ");
    return (
      <>
        <Col xs={24} className="option option-name">
          {render}
        </Col>
      </>
    );
  };

  const renderCombo = (comboItems) => {
    let render = comboItems?.map((item) => (
      <>
        <Col xs={24} className="combo-item-name">
          {item?.fullName}
        </Col>
        {renderOptions(item?.orderItemOptions)}
        {renderToppings(item?.orderItemToppings)}
      </>
    ));
    return render;
  };

  return (
    <div className="order-card">
      <Row className="order-card-header">
        <Col xs={24} sm={12} className="order-card-header-left">
          <div className="icon">
            {data?.orderTypeId === enumOrderType.ONLINE_DELIVERY && <DeliveryHeaderIcon />}
            {data?.orderTypeId === enumOrderType.PICK_UP && <IconPickupCustomize />}
            {data?.orderTypeId === enumOrderType.INSTORE && <InStoreIcon />}
            {data?.orderTypeId === enumOrderType.DELIVERY && <DeliveryHeaderIcon />}
            {data?.orderTypeId === enumOrderType.TAKE_AWAY && <TakeAwayIcon />}
          </div>
          <div className="order-info">
            <div>
              <span className="my-order-delivery-name" onClick={() => navigateToOrderDetail(data?.id)}>
                {data?.orderTypeId === enumOrderType.ONLINE_DELIVERY && translateData.delivery}
                {data?.orderTypeId === enumOrderType.PICK_UP && translateData.toPickup}
                {data?.orderTypeId === enumOrderType.INSTORE && translateData.inStore}
                {data?.orderTypeId === enumOrderType.DELIVERY && translateData.delivery}
                {data?.orderTypeId === enumOrderType.TAKE_AWAY && translateData.takeAway}
              </span>
              <span className="my-order-code" onClick={() => navigateToOrderDetail(data?.id)}>
                #{data?.stringCode}
              </span>
            </div>
            <span className="my-order-status">
              <OrderStatusComponent statusId={data?.statusId} />
            </span>
          </div>
        </Col>
        <Col xs={24} sm={12} className="order-card-header-right">
          <div className="order-info">
            <span className="platform">{data?.platform}</span>
            <span className="time-order">{formatDate(data?.createdTime, DateFormat.HH_MM__DD_MM_YYYY_)}</span>
          </div>
        </Col>
      </Row>
      <div className="order-card-content">
        <div className="order-item-image">
          <FnbDisplayImageComponent src={firstOrderItem?.thumbnail} />
        </div>
        <div className="order-item-content">
          <Row className="order-item-info">
            <Col xs={24} sm={13} className="order-item-name">
              <div className="mobile-order-item-image">
                <FnbDisplayImageComponent src={firstOrderItem?.thumbnail} />
              </div>
              <div className="mobile-order-item-name">{firstOrderItem?.name}</div>
            </Col>
            <Col xs={12} sm={2} className="order-item-quantity">
              {firstOrderItem?.quantity}
            </Col>
            <Col xs={12} sm={9} className="order-item-price">
              <div>
                <span className="selling-price">
                  {formatTextNumber(roundNumber(firstOrderItem?.totalPriceAfterDiscount))}đ
                </span>
                {firstOrderItem?.priceAfterDiscount < firstOrderItem?.originalPrice && (
                  <div className="original-price--percent-discount">
                    <span className="original-price">
                      {formatTextNumber(firstOrderItem?.originalPrice * firstOrderItem?.quantity)}đ
                    </span>
                  </div>
                )}
              </div>
            </Col>
            {firstOrderItem?.isCombo ? (
              <>{renderCombo(firstOrderItem?.orderComboItem?.orderComboProductPriceItems)}</>
            ) : (
              <>
                {renderOptions(firstOrderItem?.orderItemOptions)}
                {renderToppings(firstOrderItem?.orderItemToppings)}
              </>
            )}
          </Row>
        </div>
      </div>
      {data?.statusId === EnumOrderStatusStoreWeb.ToConfirm ||
      data?.statusId === EnumOrderStatusStoreWeb.Completed ||
      data?.statusId === EnumOrderStatusStoreWeb.Canceled ? (
        <>
          <Row className="order-card-total">
            <Col xs={24} sm={12} className="total-order-items">
              {data?.orderItems?.length} {translateData.items} - {translatePayment(data?.paymentMethod)}
            </Col>
            <Col xs={24} sm={12} className="total-price">
              {translateData.totalAmount}:{" "}
              <div className="total-amount">{formatTextNumber(roundNumber(data?.totalPrices))}đ</div>
            </Col>
          </Row>
          {!isQRCodeInstore && (
            <div className="order-card-footer">
              <OrderButtonComponent
                statusId={data?.statusId}
                data={data}
                onClick={() => {
                  setIsReOrder(true);
                  setOrderDetailData(data);
                  setIsLoadingReOrder(true);
                }}
                isLoading={isLoadingReOrder}
                orderId={data?.id}
                onRefesh={onRefesh}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <Row className="order-card-total border-radius-bottom">
            <Col xs={24} sm={12} className="total-order-items">
              {data?.orderItems?.length} {translateData.items} - {translatePayment(data?.paymentMethod)}
            </Col>
            <Col xs={24} sm={12} className="total-price">
              {translateData.totalAmount}:{" "}
              <div className="total-amount">{formatTextNumber(roundNumber(data?.totalPrices))}đ</div>
            </Col>
          </Row>
        </>
      )}
      {isReOrder ? (
        <ReOrderComponent
          orderDetailData={orderDetailData}
          onClosed={() => {
            setIsLoadingReOrder(false);
            setIsReOrder(false);
          }}
          t={t}
        />
      ) : null}
    </div>
  );
}
