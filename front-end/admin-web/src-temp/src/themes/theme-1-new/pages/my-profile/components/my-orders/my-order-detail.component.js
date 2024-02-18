import { Button, Col, Popover, Row, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router";
import branchDataService from "../../../../../data-services/branch-data.services";
import orderDataService from "../../../../../data-services/order-data.service";
import { store } from "../../../../../modules";
import { setCartItems } from "../../../../../modules/session/session.actions";
import orderService from "../../../../../services/orders/order-service";
import reduxService from "../../../../../services/redux.services";
import { formatDate, formatTextNumber, roundNumber, formatTextCurrency } from "../../../../../utils/helpers";
import { getStorage, localStorageKeys } from "../../../../../utils/localStorage.helpers";
import {
  CheckoutDetailRightCorner,
  DeliveryIcon,
  InStoreIcon,
  NoteIcon,
  OrderDetailBottomArrow,
  OrderDetailCoffeeCup,
  OrderDetailCoffeeCupGrey,
  OrderDetailCoffeeCupM,
  OrderDetailCoffeeCupMGrey,
  OrderDetailRestaurant,
  OrderDetailRestaurantM,
  OrderDetailScooter,
  OrderDetailScooterGrey,
  OrderDetailScooterM,
  OrderDetailScooterMGrey,
  PickUpIcon,
  PointLogo,
  TakeAwayIcon,
} from "../../../../assets/icons.constants";
import orderDetailDeliveryM from "../../../../assets/images/order-detail-delivery-m.png";
import orderDetailDelivery from "../../../../assets/images/order-detail-delivery.png";
import productDefaultImage from "../../../../assets/images/product-default.png";
import BankTransferPayment from "../../../../components/BankTransferPayment/BankTransferPayment";
import CancelOrderButton from "../../../../components/cancel-order-button/cancel-order-button.component";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog.component";
import { DiscountAmount } from "../../../../components/discount-amount/discount-amount.component";
import DiscountPopoverComponent from "../../../../components/discount-code-card/discount-code-popover.component";
import { PercentValue } from "../../../../components/percent-value/percent-value.component";
import { EnumDayOfWeek, EnumNextTimeOpenType, EnumPromotionSummary, languages } from "../../../../constants/enums";
import { OrderType } from "../../../../constants/order.constants";
import { ProductPlatform } from "../../../../constants/product-platform.constants";
import { DateFormat } from "../../../../constants/string.constants";
import "./my-order-detail.component.scss";

const { Paragraph } = Typography;
export default function MyOrderDetail(props) {
  const isMaxWidth740 = useMediaQuery({ maxWidth: 740 });
  const history = useHistory();
  const [t] = useTranslation();
  const { i18n } = useTranslation();
  const reduxState = store.getState();
  const branchAddress = reduxState?.session?.deliveryAddress?.branchAddress;

  const translateData = {
    all: t("myProfile.myOrders.all", "All"),
    canceled: t("myProfile.myOrders.canceled", "Canceled"),
    toConfirm: t("myProfile.myOrders.toConfirm", "To Confirm"),
    processing: t("myProfile.myOrders.processing", "Processing"),
    delivering: t("myProfile.myOrders.delivering", "Delivering"),
    completed: t("myProfile.myOrders.completed", "Completed"),
    draft: t("myProfile.myOrders.draft", "Draft"),
    orderList: t("myProfile.myOrders.orderList", "Order List"),
    youDontHaveAnyOrdersYet: t("myProfile.myOrders.youDontHaveAnyOrdersYet", "You don't have any orders yet"),
    orderNow: t("myProfile.myOrders.orderNow", "Order Now"),
    confirm: t("myProfile.myOrders.confirm", "Xác nhận"),
    ignore: t("myProfile.myOrders.ignore", "Bỏ qua"),
    reOrderConfirmText: t(
      "myProfile.myOrders.reOrderConfirmText",
      "Bạn có vài sản phẩm trong Giỏ Hàng,</br> bạn có muốn xóa tất cả và thay thế bằng các sản phẩm </br>trong đơn hàng này?",
    ),
    confirmation: t("myProfile.myOrders.confirmation", "Xác nhận"),
    reOrder: t("myProfile.myOrders.reOrder", "Đặt lại đơn hàng"),
    rank: t("myProfile.myOrders.rank", "Hạng thành viên"),
    pointsUppercase: t("loyaltyPoint.pointsUppercase", "Điểm"),
    used: t("loyaltyPoint.used", "Sử dụng"),
    points: t("loyaltyPoint.points", "điểm"),
    earnPointMessage: t(
      "checkOutPage.earnPointMessage",
      "Bạn sẽ kiếm được <span class = {{earn_points}}>{{earnPoints}}</span> điểm khi hoàn thành đơn hàng.",
    ),
    earnPointCompleteMessage: t(
      "checkOutPage.earnPointCompleteMessage",
      "Bạn đã kiếm được <span class = {{earn_points}}>{{earnPoints}}</span> điểm cho đơn hàng này.",
    ),
    cash: t("paymentMethod.cash", "Cash"),
    moMo: t("paymentMethod.moMo", "MoMo"),
    atm: t("paymentMethod.atm", "ATM"),
    bankTransfer: t("paymentMethod.bankTransfer", "Bank Transfer"),
    isCash: "Cash",
    isMoMo: "MoMo",
    isATM: "ATM",
    isBankTransfer: "Bank Transfer",

    isPaid: "Paid",
    isUnpaid: "Unpaid",
    isRefunded: "Refunded",
    isWaitingForRefund: "WaitingForRefund",

    paid: t("orderPaymentStatus.paid", "Paid"),
    unPaid: t("orderPaymentStatus.unPaid", "Unpaid"),
    refunded: t("orderPaymentStatus.refunded", "Refunded"),
    waitingForRefund: t("orderPaymentStatus.waitingForRefund", "Waiting For Refund"),
    notification: t("storeWebPage.generalUse.notification"),
    soSorryNotificationWorkingHour: t(
      "storeBranch.soSorryNotificationWorkingHour",
      "Rất xin lỗi! Hiện tại không phải thời gian làm việc của cửa hàng. Vui lòng quay lại vào lúc <strong>{{timeWorkingHour}} {{dayOfWeek}}</strong>",
    ),
    iGotIt: t("loginPage.iGotIt", "I got it"),
    creatingOrder: t("myProfile.myOrders.creatingOrder", "Creating order"),
    preparing: t("myProfile.myOrders.preparing", "Preparing"),
    receiver: t("myProfile.myOrders.receiver", "Receiver"),
    receiverTitle: t("myProfile.myOrders.receiverTitle", "Receiver"),
    phoneNumber: t("myProfile.myOrders.phoneNumber", "Phone number"),
    itemDetail: t("myProfile.myOrders.itemDetail", "Item detail"),
    subtotal: t("myProfile.myOrders.subtotal", "Subtotal"),
    feeAndTax: t("checkOutPage.feeAndTax", "Fee & Tax"),
    discount: t("myProfile.myOrders.discount", "Discount"),
    shippingFee: t("myProfile.myOrders.shippingFee", "Shipping fee"),
    paymentMethod: t("myProfile.myOrders.paymentMethod", "Payment method"),
    paymentStatus: t("myProfile.myOrders.paymentStatus", "Payment status"),
    total: t("myProfile.myOrders.total", "Total"),
    cancelOrder: t("myProfile.myOrders.cancelOrder", "Cancel order"),
    note: t("myProfile.myOrders.note", "Note"),
    deliveryDate: t("deliveryTime.deliveryDateFullText", "Note"),
    deliveryTime: t("deliveryTime.deliveryTimeFullText", "Note"),
    now: t("deliveryTime.now", "Sớm nhất"),
    delivery: t("myProfile.myOrders.delivery", "Note"),
    inStore: t("myProfile.myOrders.inStore", "Note"),
    takeAway: t("myProfile.myOrders.takeAway", "Note"),
    onlineDelivery: t("myProfile.myOrders.onlineDelivery", "Note"),
    pickUp: t("myProfile.myOrders.pickUp", "Note"),
    qrCodeInStore: t("myProfile.myOrders.qrCodeInStore", "Note"),
    createBy: t("myProfile.myOrders.createBy", "Tạo bởi"),
    storeDetail: t("myProfile.myOrders.storeDetail", "Store Detail"),
    platform: t("myProfile.myOrders.platform", "Platform"),
    orderDate: t("myProfile.myOrders.orderDate", "Order date"),
    storeLocation: t("myProfile.myOrders.storeLocation", "Order date"),
    area: t("myProfile.myOrders.area", "Order date"),
    table: t("myProfile.myOrders.table", "Order date"),
    orderInformation: t("myProfile.myOrders.orderInformation", "Order Information"),
    branchName: t("myProfile.myOrders.branchName", "Branch Name"),
    pickupTime: t("myProfile.myOrders.pickupTime", "Pickup Time"),
    pickupDetail: t("myProfile.myOrders.pickupDetail", "Chi tiết lấy hàng"),
    deliveryDetail: t("myProfile.myOrders.deliveryDetail", "Chi tiết nhận hàng"),
    pickupLocation: t("myProfile.myOrders.pickupLocation", "Địa chỉ nhận hàng"),
    discountCode: t("checkOutPage.discountCode", "Discount code"),
    promotion: t("checkOutPage.promotion", "Promotion"),
    orderId: t("myProfile.myOrders.orderId")
  };

  const translatePayment = (data) => {
    switch (data?.toLowerCase()) {
      case translateData.isCash?.toLowerCase():
        return translateData.cash;
      case translateData.COD?.toLowerCase():
        return translateData.COD;
      case translateData.isMoMo?.toLowerCase():
        return translateData.moMo;
      case translateData.isBankTransfer?.toLowerCase():
        return translateData.bankTransfer;
      default:
        return translateData.atm;
    }
  };

  const translateOrderPaymentStatus = (status) => {
    switch (status?.toLowerCase()) {
      case translateData.isPaid?.toLowerCase():
        return translateData.paid;
      case translateData.isUnpaid?.toLowerCase():
        return translateData.unPaid;
      case translateData.isRefunded?.toLowerCase():
        return translateData.refunded;
      case translateData.isWaitingForRefund?.toLowerCase():
        return translateData.waitingForRefund;

      default:
        return translateData.unPaid;
    }
  };

  const [orderDetail, setOrderDetail] = useState();
  const [bankAccountInfo, setBankAccountInfo] = useState(null);
  const [isShowReOrderDialog, setIsShowReOrderDialog] = useState(false);
  const [reOrderCartItem, setReOrderCartItem] = useState();
  const [earnPoint, setEarnPoint] = useState(0);
  const [isShowCloseStoreDialog, setIsShowCloseStoreDialog] = useState(false);
  const [timeWorkingHour, setTimeWorkingHour] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [isQRCodeInstore, setIsQRCodeInstore] = useState(null);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    getOrderDetail();
  }, []);

  useEffect(() => {
    if (window.showDeliveryAddressSelector) {
      const element = document.querySelector('#deliveryAddressSelector');
      if (element) {
        element.classList.add('delivery-address-selector-default-hide');
      }
    }
  }, []);

  useEffect(() => {
    if (
      orderDetail?.orderTypeId == 0 &&
      (orderDetail?.platformId?.toLowerCase() === ProductPlatform.StoreWebsite.toLowerCase() ||
        orderDetail?.platformId?.toLowerCase() === ProductPlatform.StoreMobileApp.toLowerCase())
    ) {
      setIsQRCodeInstore(true);
    } else {
      setIsQRCodeInstore(false);
    }
  }, [orderDetail]);

  useEffect(() => {
    const loginData = getStorage(localStorageKeys.LOGIN);

    if (!loginData) {
      history.push("/login");
    }
  }, [history]);

  const getOrderDetail = async () => {
    if (props?.orderId) {
      const res = await orderDataService.getOrderDetailByIdAsync(props?.orderId);
      if (res) {
        setOrderDetail(res.data.order);
        setBankAccountInfo(res?.data?.bankAccountInfo);
        setEarnPoint(res?.data?.order?.earnPoint ?? 0);
      }
    }
  };

  const renderPromotionList = (promotionType, title) => {
    const filteredDiscounts = orderDetail?.sumaryPromotionOrder?.filter((x) => x?.promotionType === promotionType);

    return (
      filteredDiscounts?.length > 0 && (
        <div>
          {<div className="discount-content-label">{title}</div>}
          {filteredDiscounts?.map((discount) => (
            <DiscountPopoverComponent key={discount?.id} discount={discount} promotionType={promotionType} />
          ))}
        </div>
      )
    );
  };

  const renderDiscountCode = () => {
    return renderPromotionList(EnumPromotionSummary.DiscountCode, translateData.discountCode);
  };

  const renderPromotions = () => {
    return renderPromotionList(EnumPromotionSummary.Discount, translateData.promotion);
  };
  const discountContent = (
    <div className="order-detail-popover">
      {renderDiscountCode()}
      {renderPromotions()}

      {(orderDetail?.customerDiscountAmount ?? 0) > 0 && (
        <div>
          <div className="discount-content-label">{translateData.rank}</div>
          <div className="discount-content-text">
            <span>
              {orderDetail?.customerMemberShipLevel}{" "}
              <PercentValue value={orderDetail?.customerMembershipDiscountPercent} />
            </span>
            <DiscountAmount value={roundNumber(orderDetail?.customerDiscountAmount, 2)} />
          </div>
        </div>
      )}

      {/* Loyalty point */}
      {orderDetail?.pointUsedQuantity > 0 && (
        <div>
          <div className="discount-content-label">{translateData.pointsUppercase}</div>
          <div className="discount-content-text">
            <span>
              {translateData.used}
              <span className="text-point">{formatTextNumber(orderDetail?.pointUsedQuantity)}</span>
              {translateData.points}
            </span>
            <DiscountAmount value={orderDetail?.pointDiscountValue} />
          </div>
        </div>
      )}
    </div>
  );

  const handleSumTax = (orderDetail) => {
    let taxes = [];
    if (orderDetail) {
      for (let orderItem of orderDetail?.orderItems) {
        if (orderItem?.isCombo) {
          for (let orderComboProductPriceItem of orderItem?.orderComboItem?.orderComboProductPriceItems) {
            if (
              orderComboProductPriceItem?.productPrice?.product?.tax != undefined ||
              orderComboProductPriceItem?.productPrice?.product?.tax != null
            ) {
              if (!checkElementTaxExistInArray(taxes, orderComboProductPriceItem?.productPrice?.product?.tax?.id)) {
                taxes.push({
                  tax: orderComboProductPriceItem?.productPrice?.product?.tax,
                  price: orderComboProductPriceItem?.itemTaxValue * orderItem?.quantity,
                });
              } else {
                let elementExist = getElementTaxInArrayById(
                  taxes,
                  orderComboProductPriceItem?.productPrice?.product?.tax?.id,
                );
                elementExist.price += orderComboProductPriceItem?.itemTaxValue * orderItem?.quantity;
              }
            }
          }
        } else {
          if (orderItem?.productPrice?.product?.tax != undefined || orderItem?.productPrice?.product?.tax != null) {
            if (!checkElementTaxExistInArray(taxes, orderItem?.productPrice?.product?.tax?.id)) {
              taxes.push({
                tax: orderItem?.productPrice?.product?.tax,
                price: orderItem?.tax,
              });
            } else {
              let elementExist = getElementTaxInArrayById(taxes, orderItem?.productPrice?.product?.tax?.id);
              elementExist.price += orderItem?.tax;
            }
          }
        }
      }
    }
    return taxes;
  };

  const checkElementTaxExistInArray = (array, id) => {
    let isExisted = false;
    if (array.length == 0) return false;
    for (let item of array) {
      if (item?.tax?.id === id) {
        isExisted = true;
        break;
      }
    }
    return isExisted;
  };

  const getElementTaxInArrayById = (array, id) => {
    let element = {};
    for (let item of array) {
      if (item?.tax?.id === id) {
        element = item;
        break;
      }
    }
    return element;
  };
  const discountFeeAndTax = (
    <div className="order-detail-popover">
      <div>
        <div className="discount-fee-label">Fee & Tax</div>
        {orderDetail?.orderFees?.map((feeItem) => {
          const { isPercentage, feeValue, feeName } = feeItem;
          const originalOrderAmount = orderDetail?.originalPrice;
          const value = isPercentage ? originalOrderAmount * (feeValue / 100) : feeValue; // calculate fee value if the fee is percentage
          return (
            <div className="discount-fee-text">
              {isPercentage ? (
                <span>
                  {feeName}({feeValue}%)
                </span>
              ) : (
                <span>{feeName}</span>
              )}
              -{formatTextNumber(roundNumber(value, 2))}đ
            </div>
          );
        })}
        <div className="group-body">
          {handleSumTax(orderDetail)?.map((taxItem) => {
            return (
              taxItem?.tax && (
                <div className="discount-fee-text">
                  <div className="discount-text">{`${taxItem?.tax?.name} (${taxItem?.tax?.percentage}%)`}</div>
                  <div className="discount-value">{`${formatTextNumber(taxItem?.price)} đ`}</div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );

  const orderStatusColor = {
    2: "canceled-color",
    3: "to-confirm-color",
    4: "processing-color",
    5: "delivering-color",
    6: "completed-color",
    7: "draft-color",
  };
  const orderStatusName = {
    2: translateData.canceled,
    3: translateData.toConfirm,
    4: translateData.processing,
    5: translateData.delivering,
    6: translateData.completed,
    7: translateData.draft,
  };
  const orderTypeName = {
    0: translateData.inStore,
    1: translateData.delivery,
    2: translateData.takeAway,
    3: translateData.onlineDelivery,
    4: translateData.pickUp,
  };
  const orderTypeColor = {
    0: "in-store-color",
    1: "delivery-color",
    2: "take-away-color",
    3: "online-delivery-color",
    4: "pick-up-color",
  };
  const orderTypeIcon = {
    0: <InStoreIcon />,
    1: <DeliveryIcon />,
    2: <TakeAwayIcon />,
    3: <DeliveryIcon />,
    4: <PickUpIcon />,
  };
  const orderPlatformText = {
    AdminWebsite: "Admin Web",
    AdminMobileApp: "Admin Mobile App",
    POSWebsite: "POS",
    POSMobileApp: "POS Mobile App",
    StoreWebsite: "Store Web",
    StoreMobileApp: "Store App",
    OrderWebsite: "Order Web",
    OrderWobileApp: "Order Wobile App",
    POS: "POS",
    GoFOOD: "Go FOOD",
  };

  //customize month name
  moment.updateLocale("en", {
    months: "thg 1_thg 2_thg 3_thg 4_thg 5_thg 6_thg 7_thg 8_thg 9_thg 10_thg 11_thg 12".split("_"),
  });

  const EnumOrderStatusStoreWeb = {
    ToConfirm: 3,
    Processing: 4,
    Delivering: 5,
    Completed: 6,
    Canceled: 2,
    Draft: 7,
  };

  const getComboName = (comboItem) => {
    if (!comboItem) return;
    if (comboItem?.comboName) {
      return comboItem?.comboName;
    }
    const comboItemName = comboItem?.combo?.name;
    const productNameItem = [];
    comboItem?.orderComboProductPriceItems?.map((item) => {
      productNameItem.push(item?.itemName);
    });

    return `${comboItemName} [${productNameItem.join(" + ")}]`;
  };

  const renderOrderDetailItem = (orderDetail) => {
    return orderDetail?.orderItems?.map((item, index) => {
      return (
        <div className="order-detail-list-container">
          {!item?.isCombo ? (
            <>
              <div className="order-detail-list-item">
                <div
                  key={index}
                  className={`order-detail-item-img ${item?.flashSaleId ? "flash-sale-border" : ""} ${
                    index === 0 && "order-detail-item-img-first"
                  }`}
                >
                  <img
                    src={
                      !Boolean(item?.productPrice?.product?.thumbnail) // check  variable is null or empty
                        ? productDefaultImage
                        : item?.productPrice?.product?.thumbnail
                    }
                    alt=""
                    height="100%"
                    width="100%"
                  ></img>
                </div>
                <div
                  key={index}
                  style={{ flexDirection: "column" }}
                  className={`order-detail-item-info ${index === 0 && "order-detail-item-info-first"}`}
                >
                  <div className="item-info-top">
                    <div className="item-info-left">
                      <Paragraph
                        className="item-name-text"
                        ellipsis={{
                          rows: 2,
                          tooltip: `${item?.productPrice?.product?.name} ${
                            item?.productPrice?.priceName ? `(${item?.productPrice?.priceName})` : ""
                          }`,
                        }}
                      >
                        {`${item?.productPrice?.product?.name} ${
                          item?.productPrice?.priceName ? `(${item?.productPrice?.priceName})` : ""
                        }`}
                      </Paragraph>

                      <div className="item-text">
                        {item?.orderItemOptions?.map((itemComboOption, indexComboOption, { length }) => {
                          // last one
                          if (length - 1 === indexComboOption) {
                            return (
                              <>
                                {itemComboOption?.optionName} :{itemComboOption.optionLevelName}
                              </>
                            );
                          } else {
                            return (
                              <>
                                {itemComboOption?.optionName} :{itemComboOption.optionLevelName} / &nbsp;
                              </>
                            );
                          }
                        })}
                      </div>
                    </div>
                    <div className="item-info-center">
                      <div className="item-info-center-first-row">
                        <span className="item-name-text">
                          {formatTextCurrency(item?.priceAfterDiscountIncludeTopping)}
                        </span>
                        {item?.originalPriceIncludeTopping !== item?.priceAfterDiscountIncludeTopping && !item?.flashSaleId && (
                          <span className="item-promotion-text">
                            {formatTextCurrency(item?.originalPriceIncludeTopping)}
                          </span>
                        )}

                        <span className="item-quantity-text-mobile">
                          SL:
                          <span className="item-name-text">{item?.quantity}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="item-quantity-text">
                        SL:
                        <span className="item-name-text">{item?.quantity}</span>
                      </span>
                    </div>
                  </div>
                  <div className="item-topping">
                    {item?.orderItemToppings?.map((itemComboTopping, indexItemComboTopping, { length }) => {
                      // last one
                      const originalPriceTopping = itemComboTopping?.originalPrice / itemComboTopping?.quantity;
                      if (length - 1 === indexItemComboTopping) {
                        return (
                          <>
                            {itemComboTopping?.quantity > 0 && (
                              <>
                                <Row>
                                  <Col className="item-text item-info-left">
                                    <span>
                                      {itemComboTopping?.quantity} x{itemComboTopping?.toppingName}
                                    </span>
                                  </Col>
                                  <Col className="item-info-center item-topping-price">
                                    <span className="item-info-center-first-row">
                                      {formatTextNumber(itemComboTopping?.priceAfterDiscount)}đ
                                    </span>
                                    {itemComboTopping?.priceAfterDiscount < originalPriceTopping && (
                                      <span className="item-topping-original-price">
                                        {formatTextNumber(originalPriceTopping)}đ
                                      </span>
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )}
                          </>
                        );
                      } else {
                        return (
                          <>
                            {itemComboTopping?.quantity > 0 && (
                              <>
                                <Row>
                                  <Col className="item-text item-info-left">
                                    <span>
                                      {itemComboTopping?.quantity} x{itemComboTopping?.toppingName}
                                    </span>
                                  </Col>
                                  <Col className="item-info-center item-topping-price">
                                    <span>{formatTextNumber(itemComboTopping?.priceAfterDiscount)}đ</span>
                                    {itemComboTopping?.priceAfterDiscount < originalPriceTopping && (
                                      <span className="item-topping-original-price">
                                        {formatTextNumber(originalPriceTopping)}đ
                                      </span>
                                    )}
                                  </Col>
                                </Row>
                              </>
                            )}
                          </>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
              {item?.notes && (
                <div className="item-note">
                  <div className="note-icon">
                    <NoteIcon />
                  </div>
                  <div className="note-text">{item?.notes}</div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="order-detail-list-item">
                <div key={index} className={`order-detail-item-img ${index === 0 && "order-detail-item-img-first"}`}>
                  <img
                    src={
                      !Boolean(item?.orderComboItem?.combo?.thumbnail) // check  variable is null or empty
                        ? productDefaultImage
                        : item?.orderComboItem?.combo?.thumbnail
                    }
                    alt=""
                    height="100%"
                    width="100%"
                  ></img>
                </div>
                <div key={index} className={`order-detail-item-info ${index === 0 && "order-detail-item-info-first"}`}>
                  <div className="item-info-left">
                    <Paragraph
                      className="item-name-text"
                      ellipsis={{
                        rows: 2,
                        tooltip: item?.productPriceName ? item?.productPriceName : getComboName(item?.orderComboItem),
                      }}
                    >
                      {item?.productPriceName ? item?.productPriceName : getComboName(item?.orderComboItem)}
                    </Paragraph>
                  </div>
                  <div className="item-info-center">
                    <div className="item-info-center-first-row">
                      <span className="item-name-text">
                        {formatTextNumber(item?.priceAfterDiscount / item?.quantity)}đ
                      </span>
                      <span className="item-quantity-text-mobile">
                        SL:
                        <span className="item-name-text">{item?.quantity}</span>
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="item-quantity-text">
                      SL:
                      <span className="item-name-text">{item?.quantity}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="order-detail-combo-list">
                {item?.orderComboItem?.orderComboProductPriceItems?.map((itemCombo, indexCombo) => {
                  return (
                    <div
                      key={indexCombo}
                      className={`order-detail-combo-item ${indexCombo === 0 && "order-detail-combo-item-first"}`}
                    >
                      <div className="combo-item-img">
                        <img
                          src={
                            !Boolean(itemCombo?.productPrice?.product?.thumbnail) // check  variable is null or empty
                              ? productDefaultImage
                              : itemCombo?.productPrice?.product?.thumbnail
                          }
                          alt=""
                          height="100%"
                          width="100%"
                        ></img>
                      </div>
                      <div className="combo-item-info">
                        <div className="item-name-text">{itemCombo?.productPrice?.product?.name}</div>
                        <div className="item-text">{itemCombo?.productPrice?.priceName}</div>
                        <div className="item-text">
                          {itemCombo?.orderItemOptions?.map((itemComboOption, indexComboOption, { length }) => {
                            // last one
                            if (length - 1 === indexComboOption) {
                              return (
                                <>
                                  {itemComboOption?.optionName} :{itemComboOption.optionLevelName}
                                </>
                              );
                            } else {
                              return (
                                <>
                                  {itemComboOption?.optionName} :{itemComboOption.optionLevelName} / &nbsp;
                                </>
                              );
                            }
                          })}
                        </div>
                        <div className="item-text">
                          {itemCombo?.orderItemToppings?.map((itemComboTopping) => {
                            return (
                              <>
                                {itemComboTopping?.quantity > 0 && (
                                  <>
                                    {itemComboTopping?.quantity} x{itemComboTopping?.toppingName}
                                    <br />
                                  </>
                                )}
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {item?.notes && (
                <div className="item-note">
                  <div className="note-icon">
                    <NoteIcon />
                  </div>
                  <div className="note-text">{item?.notes}</div>
                </div>
              )}
            </>
          )}
        </div>
      );
    });
  };

  const confirmReOrder = () => {
    reduxService.dispatch(setCartItems(reOrderCartItem.newCartItems));
    localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(reOrderCartItem.newCartItems));
    const paramsState = {
      paymentMethodId: reOrderCartItem?.paymentMethodId,
      deliveryMethodId: reOrderCartItem?.deliveryMethodId,
      orderTypeId: reOrderCartItem?.orderTypeId,
    };
    history.push({
      pathname: "/checkout",
      state: paramsState,
    });
  };

  const reOrder = async (item) => {
    ///Handle check working hours
    const isBranchClosed = await checkIfBranchIsClosed();
    if (isBranchClosed === true) return;

    var res = await orderService.cloneItemFromOrderToCart(item);
    if (res) {
      let currentShoppingCart = JSON.parse(localStorage.getItem(localStorageKeys.STORE_CART));
      if (currentShoppingCart?.length > 0) {
        setReOrderCartItem(res);
        setIsShowReOrderDialog(true);
      } else {
        reduxService.dispatch(setCartItems(res.newCartItems));
        localStorage.setItem(localStorageKeys.STORE_CART, JSON.stringify(res.newCartItems));
        const paramsState = {
          paymentMethodId: res?.paymentMethodId,
          deliveryMethodId: res?.deliveryMethodId,
          orderTypeId: res?.orderTypeId,
        };
        history.push({
          pathname: "/checkout",
          state: paramsState,
        });
      }
    }
  };

  const checkIfBranchIsClosed = async () => {
    let isClosed = false;
    const workingHour = await branchDataService.getWorkingHourByBranchIdAsync(branchAddress?.id ?? null);
    const workingHourResult = workingHour?.data;
    if (workingHourResult?.isClosed === true) {
      setIsShowCloseStoreDialog(true);
      setTimeWorkingHour(workingHourResult?.workingHour?.openTime);
      if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[1].key) {
        setDayOfWeek(EnumNextTimeOpenType[workingHourResult?.workingHour?.nextTimeOpen - 1].name);
      } else if (workingHourResult?.workingHour?.nextTimeOpen === EnumNextTimeOpenType[2].key) {
        setDayOfWeek(EnumDayOfWeek[workingHourResult?.workingHour?.dayOfWeek].name);
      }
      isClosed = true;
    }
    return isClosed;
  };

  function ReceivePointNotification() {
    const text = t(translateData.earnPointMessage, {
      earnPoints: formatTextNumber(earnPoint),
      earn_points: "earn-points",
    });
    const textComplete = t(translateData.earnPointCompleteMessage, {
      earnPoints: earnPoint,
      earn_points: "earn-points",
    });
    return (
      <>
        {orderDetail?.statusId !== EnumOrderStatusStoreWeb.Canceled &&
          orderDetail?.statusId !== EnumOrderStatusStoreWeb.Completed && (
            <div className="receive-point-text">
              <PointLogo className="point-logo" />
              <span dangerouslySetInnerHTML={{ __html: text }}></span>
            </div>
          )}
        {orderDetail?.statusId === EnumOrderStatusStoreWeb.Completed && (
          <div className="receive-point-text">
            <PointLogo className="point-logo" />
            <span dangerouslySetInnerHTML={{ __html: textComplete }}></span>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {orderDetail?.statusId !== EnumOrderStatusStoreWeb.Draft &&
        orderDetail?.statusId !== EnumOrderStatusStoreWeb.Completed &&
        orderDetail?.statusId !== EnumOrderStatusStoreWeb.Canceled && (
          <>
            <div className="order-detail-status">
              <div className="order-detail-step">
                {isMaxWidth740 ? <OrderDetailRestaurantM /> : <OrderDetailRestaurant />}
                <span>{translateData.creatingOrder}</span>
              </div>
              <div className="rectangle"></div>
              <div className="order-detail-step">
                {orderDetail?.statusId >= EnumOrderStatusStoreWeb.Processing ? (
                  <>
                    {isMaxWidth740 ? <OrderDetailCoffeeCupM /> : <OrderDetailCoffeeCup />}
                    <span>{translateData.preparing}</span>
                  </>
                ) : (
                  <>
                    {isMaxWidth740 ? <OrderDetailCoffeeCupMGrey /> : <OrderDetailCoffeeCupGrey />}
                    {translateData.preparing}
                  </>
                )}
              </div>
              <div className="rectangle"></div>
              <div className="order-detail-step">
                {orderDetail?.statusId >= EnumOrderStatusStoreWeb.Delivering ? (
                  <>
                    {isMaxWidth740 ? <OrderDetailScooterM /> : <OrderDetailScooter />}
                    <span>{translateData.delivering}</span>
                  </>
                ) : (
                  <>
                    {isMaxWidth740 ? <OrderDetailScooterMGrey /> : <OrderDetailScooterGrey />}
                    {translateData.delivering}
                  </>
                )}
              </div>
            </div>
          </>
        )}

      <div className="order-detail-confirm">
        <div className={`order-detail-confirm-title ${orderStatusColor[orderDetail?.statusId]}`}>
          <span className={`order-type ${orderTypeColor[orderDetail?.orderTypeId]}`}>
            <div
              className={
                orderDetail?.orderTypeId === OrderType.INSTORE || orderDetail?.orderTypeId === OrderType.TAKE_AWAY
                  ? "order-type-icon"
                  : "order-type-icon-2"
              }
            >
              {orderTypeIcon[orderDetail?.orderTypeId]}
            </div>
            {orderTypeName[orderDetail?.orderTypeId]}
          </span>
          <span className="order-status ">{orderStatusName[orderDetail?.statusId]}</span>
        </div>
        <div className="order-detail-confirm-content">
          <div className="order-detail-confirm-left">
            <div className="receiver-info">
              <div className="receiver-title-info">{translateData.receiverTitle}</div>
              <div className="receiver-info-container">
                <div className="receiver-info-title"> {translateData.receiver}:&nbsp;</div>
                <div className="receiver-info-text">
                  {orderDetail?.orderDelivery?.receiverName ?? orderDetail?.customer?.fullName}
                </div>
              </div>
              <div className="receiver-info-container">
                <div className="receiver-info-title">{translateData.phoneNumber}:&nbsp;</div>
                <div className="receiver-info-text">
                  {orderDetail?.orderDelivery?.receiverPhone ?? orderDetail?.customer?.phoneNumber}
                </div>
              </div>

              {/* Order information */}
              <div className="order-detail-confirm-all">
                <div className="order-info">
                  <div className="title-info">{translateData.orderInformation}</div>
                  <div className="order-info-container">
                    <div className="order-info-title">
                      {`${translateData.orderId}:`}&nbsp;
                      <div className="order-info-text">#{orderDetail?.stringCode}</div>
                    </div>
                  </div>
                  {isQRCodeInstore && (
                    <div className="order-info-container">
                      <div className="order-info-title">
                        {translateData.createBy}:&nbsp;
                        <div className="order-info-text">{translateData.qrCodeInStore}</div>
                      </div>
                    </div>
                  )}
                  <div className="order-info-container">
                    <div className="order-info-title">
                      {translateData.orderDate}:&nbsp;
                      <div className="order-info-text">
                        {moment
                          .utc(orderDetail?.createdTime)
                          .local()
                          .locale(i18n.language)
                          .format(
                            i18n.language === languages.VIETNAMESE
                              ? DateFormat.DD_MMMM_YYYY_HH_mm_ss_2
                              : DateFormat.MMM_DO_YYYY_HH_mm_ss,
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="order-info-container">
                    <div className="order-info-title">
                      {translateData.platform}:&nbsp;{" "}
                      <div className="order-info-text">
                        {
                          orderPlatformText[
                            Object.keys(ProductPlatform).find(
                              (key) => ProductPlatform[key]?.toLowerCase() === orderDetail?.platformId?.toLowerCase(),
                            )
                          ]
                        }
                      </div>
                    </div>
                  </div>
                  {orderDetail?.orderTypeId !== OrderType.INSTORE && (
                    <div className="order-info-container">
                      {orderDetail?.orderTypeId != OrderType.TAKE_AWAY && (
                        <div className="order-info-title">
                          {orderDetail?.orderTypeId === OrderType.PICK_UP
                            ? translateData.pickupTime
                            : translateData.deliveryTime}
                          :{" "}
                          <div
                            className={`order-info-text-delivery ${
                              orderDetail?.orderTypeId === OrderType.PICK_UP && "order-info-text-pickup"
                            }`}
                          >
                            {orderDetail?.scheduledTime
                              ? formatDate(
                                  orderDetail?.scheduledTime,
                                  orderDetail?.orderTypeId === OrderType.PICK_UP
                                    ? DateFormat.HH_MM
                                    : DateFormat.DD_MM_YYYY_HH_MM_2,
                                )
                              : formatDate(
                                  orderDetail?.createdTime,
                                  orderDetail?.orderTypeId === OrderType.PICK_UP
                                    ? DateFormat.HH_MM
                                    : DateFormat.DD_MM_YYYY_HH_MM_2,
                                )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="order-detail-confirm-right">
              {orderDetail?.orderTypeId === OrderType.INSTORE ? (
                <>
                  <div className="in-store-info-group">
                    <div className="title-info">{translateData.storeDetail}</div>
                    <div className="in-store-info-text-title">
                      {translateData.storeLocation}:&nbsp;
                      <div className="in-store-info-text-detail">{orderDetail?.storeName}</div>
                    </div>
                    <div className="in-store-info-text-title">
                      {translateData.branchName}:&nbsp;
                      <div className="in-store-info-text-detail">{orderDetail?.storeBranch?.branchName}</div>
                    </div>
                    <div className="in-store-info-text-title">
                      {translateData.area}:&nbsp;
                      <div className="in-store-info-text-detail">{orderDetail?.areaName}</div>
                    </div>
                    <div className="in-store-info-text-title">
                      {translateData.table}:&nbsp;
                      <div className="in-store-info-text-detail">{orderDetail?.tableName}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="title-info">
                    {orderDetail?.orderTypeId === OrderType.PICK_UP
                      ? translateData.pickupDetail
                      : translateData.deliveryDetail}
                  </div>
                  <div className="delivery-info">
                    <div className="delivery-info-left">
                      <img src={isMaxWidth740 ? orderDetailDeliveryM : orderDetailDelivery} alt="" />
                    </div>
                    <div className="delivery-info-right">
                      <div>
                        <div className="delivery-info-title">
                          {orderDetail?.orderTypeId === OrderType.PICK_UP
                            ? translateData.storeLocation + ":"
                            : orderDetail?.storeBranch?.branchName}
                        </div>
                        <div className="delivery-info-text">
                          {orderDetail?.orderTypeId === OrderType.PICK_UP
                            ? orderDetail?.storeName + " - " + orderDetail?.storeBranch?.branchName
                            : orderDetail?.orderDelivery?.senderAddress}
                        </div>
                      </div>
                      <div>
                        <div className="delivery-info-title">
                          {orderDetail?.orderTypeId === OrderType.PICK_UP ? (
                            translateData.pickupLocation + ":"
                          ) : orderDetail?.orderDelivery?.receiverName ? (
                            orderDetail?.orderDelivery?.receiverName
                          ) : (
                            <>Customer address</>
                          )}
                        </div>
                        <div className="delivery-info-text">
                          {orderDetail?.orderTypeId === OrderType.PICK_UP
                            ? orderDetail?.orderDelivery?.senderAddress
                            : orderDetail?.orderDelivery?.receiverAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {bankAccountInfo?.isVietnameseBank && (
          <div className="payment-bank-transfer-detail-theme1">
            <BankTransferPayment bankAccountInfo={bankAccountInfo} orderId={orderDetail?.stringCode} />
          </div>
        )}
      </div>
      <div className="order-detail-title-list">{translateData.itemDetail}</div>
      <div className="order-detail-list">{renderOrderDetailItem(orderDetail)}</div>
      {earnPoint >= 0 && <ReceivePointNotification />}
      <div className="order-detail-total">
        <CheckoutDetailRightCorner className="background-right-corner-order-detail"/>
        <div className="order-detail-total-container">
          <div className="container">
            <div className="order-detail-total-left">
              <div>{translateData.subtotal}</div>
              <div>
                {translateData.discount}
                {orderDetail?.totalDiscountAmount !== 0 && (
                  <Popover
                    overlayClassName="theme-1-my-order-detail-popover"
                    placement="bottom"
                    showArrow={false}
                    trigger="click"
                    content={discountContent}
                  >
                    <OrderDetailBottomArrow className="order-detail-arrow" />
                  </Popover>
                )}
              </div>
              <div>
                {translateData.feeAndTax}
                {(orderDetail?.totalFee + orderDetail?.totalTax ?? 0) !== 0 && (
                  <Popover
                    overlayClassName="theme-1-my-order-detail-popover"
                    placement="bottom"
                    showArrow={false}
                    trigger="click"
                    content={discountFeeAndTax}
                  >
                    <OrderDetailBottomArrow className="order-detail-arrow" />
                  </Popover>
                )}
              </div>
              {(orderDetail?.orderTypeId === OrderType.DELIVERY ||
                orderDetail?.orderTypeId === OrderType.ONLINE_DELIVERY) && <div>{translateData.shippingFee}</div>}
              <div>{translateData.paymentMethod}</div>
              <div>{translateData.paymentStatus}</div>
            </div>
            <div className="order-detail-total-right">
              <b>{formatTextNumber(orderDetail?.originalPrice)}đ</b>
              <b>-{formatTextNumber(orderDetail?.totalDiscountAmount ?? 0)}đ</b>
              <b>{formatTextNumber(orderDetail?.totalFee + orderDetail?.totalTax ?? 0)}đ</b>
              {(orderDetail?.orderTypeId === OrderType.DELIVERY ||
                orderDetail?.orderTypeId === OrderType.ONLINE_DELIVERY) && (
                <b>{formatTextNumber(orderDetail?.deliveryFee)}đ</b>
              )}
              <b>{translatePayment(orderDetail?.paymentMethodName)}</b>
              <b>{translateOrderPaymentStatus(orderDetail?.orderPaymentStatus)}</b>
            </div>
          </div>
          <div className="group group-note">
            <div className="title-note">{translateData.note}</div>
            {orderDetail?.note ? <div className="content-note">{orderDetail?.note}</div> : "-"}
          </div>
          <div className="total">
            <div className="text">
              <b className="order-detail-total-text">{translateData.total}</b>
            </div>
            <div className="price">
              <b className="order-detail-total-number">
                {formatTextNumber(orderDetail?.totalAmount > 0 ? Math.round(orderDetail?.totalAmount) : 0)}đ
              </b>
            </div>
          </div>
        </div>
        {!isQRCodeInstore && (
          <>
            {!isMaxWidth740 && orderDetail?.statusId === EnumOrderStatusStoreWeb.ToConfirm && (
              <CancelOrderButton
                orderId={orderDetail?.id}
                className="order-detail-btn-cancel"
                callBack={getOrderDetail}
                buttonText={translateData.cancelOrder}
              />
            )}
            {!isMaxWidth740 &&
              (orderDetail?.statusId === EnumOrderStatusStoreWeb.Completed ||
                orderDetail?.statusId === EnumOrderStatusStoreWeb.Canceled) && (
                <div onClick={() => reOrder(orderDetail)} className="order-detail-btn-re-order">
                  {translateData.reOrder}
                </div>
              )}
          </>
        )}
      </div>
      {!isQRCodeInstore && (
        <>
          {isMaxWidth740 && orderDetail?.statusId === EnumOrderStatusStoreWeb.ToConfirm && (
            <CancelOrderButton
              orderId={orderDetail?.id}
              className="order-detail-btn-cancel"
              callBack={getOrderDetail}
              buttonText={translateData.cancelOrder}
            />
          )}
          {isMaxWidth740 &&
            (orderDetail?.statusId === EnumOrderStatusStoreWeb.Completed ||
              orderDetail?.statusId === EnumOrderStatusStoreWeb.Canceled) && (
              <div onClick={() => reOrder(orderDetail)} className="order-detail-btn-re-order">
                {translateData.reOrder}
              </div>
            )}
        </>
      )}

      <ConfirmationDialog
        open={isShowReOrderDialog}
        onCancel={() => setIsShowReOrderDialog(false)}
        onConfirm={() => confirmReOrder}
        confirmLoading={false}
        className="modal_login_theme1"
        closable={true}
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t(translateData.reOrderConfirmText),
            }}
          ></span>
        }
        title={translateData.confirmation}
        footer={[
          <Button onClick={() => setIsShowReOrderDialog(false)}>{translateData.ignore}</Button>,
          <Button onClick={() => confirmReOrder()}>{translateData.confirm}</Button>,
        ]}
      />

      {/* Working hour notification */}
      <ConfirmationDialog
        open={isShowCloseStoreDialog}
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
          <Button className="btn-got-it" onClick={() => setIsShowCloseStoreDialog(false)}>
            {translateData.iGotIt}
          </Button>,
        ]}
        className="notification-time-out-working-hours"
        closable={false}
        maskClosable={true}
      />
    </>
  );
}
