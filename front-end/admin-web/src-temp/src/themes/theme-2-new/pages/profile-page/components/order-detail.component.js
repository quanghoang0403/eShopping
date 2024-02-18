import { Button, Popover, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import { Platform } from "../../../../constants/platform.constants";
import orderDataService from "../../../../data-services/order-data.service";
import { formatDate, formatTextCurrency, formatTextNumber, randomGuid, roundNumber } from "../../../../utils/helpers";
import {
  DeliverOrderDetailStatusIcon,
  DeliveryHeaderIcon,
  EarnPointLogo,
  HeaderOrderDetailIcon,
  InStoreIcon,
  NoteIcon,
  OrderDetailArrowDownIcon,
  OrderDetailArrowUpIcon,
  OrderDetailBackIcon,
  PickUpIcon,
  PlatformIcon,
  ProcessOrderDetailStatusIcon,
  ReceiverAddressIcon,
  SenderAddressIcon,
  TakeAwayIcon,
} from "../../../assets/icons.constants";
import CreatedOrderIconCustomize from "../../../assets/icons/CreateOrderDetailStatusIcon";
import DeliveringOrderDetailIconCustomize from "../../../assets/icons/DeliveringOrderDetailIcon";
import ProcessingOrderDetailStatusIconCustomize from "../../../assets/icons/ProcessingOrderDetailStatusIcon";
import footerOrderDetailMobileImage from "../../../assets/images/footer-order-detail-mobile.png";
import footerOrderDetailImage from "../../../assets/images/footer-order-detail.png";
import productImageDefault from "../../../assets/images/product-img-default.png";
import BankTransferPayment from "../../../components/BankTransferPayment/BankTransferPayment";
import CancelOrderButton from "../../../components/cancel-order-button/cancel-order-button.component";
import DiscountPopoverComponent from "../../../components/discount-code-common-component/discount-code-popover.component";
import {
  EnumOrderStatusIncludeStringKey,
  EnumOrderStatusStoreWeb,
  colorOrderType,
  enumOrderType,
} from "../../../constants/enum";
import { EnumPromotionSummary } from "../../../constants/enums";
import { OrderPaymentStatus } from "../../../constants/order-payment-status.constants";
import { OrderType } from "../../../constants/order.constants";
import { DateFormat } from "../../../constants/string.constant";
import ReOrderComponent from "./my-order/components/re-order-component";
import "./order-detail.component.scss";

const { Paragraph } = Typography;
export default function OrderDetailComponent({ orderId, setVisibleOrderDetailPage }) {
  const [t] = useTranslation();
  const isMobileMode = useMediaQuery({ maxWidth: 740 });
  const [orderDetailData, setOrderDetailData] = useState();
  const [openPopoverFeeAndTax, setOpenPopoverFeeAndTax] = useState(false);
  const [openPopoverDiscount, setOpenPopoverDiscount] = useState(false);
  const [bankAccountInfo, setBankAccountInfo] = useState({});
  const branchAddress = useSelector((state) => state.session?.deliveryAddress?.branchAddress);
  const [isReOrder, setIsReOrder] = useState(false);
  const [isLoadingReOrder, setIsLoadingReOrder] = useState(false);
  const [earnPoint, setEarnPoint] = useState(0);
  const [isQRCodeInstore, setIsQRCodeInstore] = useState(null);

  const translateData = {
    points: t("checkOutPage.availablePoint.Points", "Điểm"),
    use: t("checkOutPage.availablePoint.use", "Dùng"),
    point: t("checkOutPage.availablePoint.point", "điểm"),
    earnPointMessage: t(
      "checkOutPage.earnPointMessage",
      "Bạn sẽ kiếm được <span class = {{earn_points}}>{{earnPoints}}</span> điểm khi hoàn thành </br> đơn hàng.",
    ),
    earnPointCompleteMessage: t(
      "checkOutPage.earnPointCompleteMessage",
      "Bạn đã kiếm được <span class = {{earn_points}}>{{earnPoints}}</span> điểm cho đơn </br> hàng này.",
    ),
    items: t("orderStatus.items", "Items"),
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
    myOrder: t("storeWebPage.profilePage.myOrder", "My order"),
    delivery: t("storeWebPage.profilePage.delivery", "Note"),
    inStore: t("storeWebPage.profilePage.inStore", "Note"),
    takeAway: t("storeWebPage.profilePage.takeAway", "Note"),
    onlineDelivery: t("storeWebPage.profilePage.onlineDelivery", "Note"),
    pickUp: t("storeWebPage.profilePage.pickUp", "Note"),
    scheduleTime: t("orderDetail.scheduleTime", "Thời gian nhận"),
    createdOrder: t("orderDetail.createdOrder", "Thời gian tạo đơn"),
    location: t("orderDetail.location", "Vị trí"),
    note: t("orderDetail.note", "Ghi chú đơn"),
    platform: t("storeWebPage.profilePage.platform", "Platform"),
    area: t("storeWebPage.profilePage.area", "Area"),
    table: t("storeWebPage.profilePage.location", "Area"),
    pickupTime: t("orderDetail.pickupTime", "Thời gian lấy hàng"),
    promotion: t("checkOutPage.promotion", "Promotion"),
    discountCode: t("promotion.discountCode.title", "Discount Code"),
    senderAddress: t("orderDetail.senderAddress", "Sender Address"),
    receiverAddress: t("orderDetail.receiverAddress", "Receiver Address"),
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

  useEffect(() => {
    getOrderDetailData();
  }, [orderId]);

  useEffect(() => {
    if (
      orderDetailData?.orderTypeId == 0 &&
      (orderDetailData?.platformId?.toLowerCase() === Platform.StoreWebsite.toLowerCase() ||
        orderDetailData?.platformId?.toLowerCase() === Platform.StoreMobileApp.toLowerCase())
    ) {
      setIsQRCodeInstore(true);
    } else {
      setIsQRCodeInstore(false);
    }
  }, [orderDetailData]);

  const getOrderDetailData = async () => {
    const orderDetailResult = await orderDataService.getOrderDetailByIdAsync(orderId, branchAddress?.id);
    setOrderDetailData({ ...orderDetailResult?.data?.order });
    setEarnPoint(orderDetailResult?.data?.order?.earnPoint ?? 0);
    setBankAccountInfo(orderDetailResult?.data?.bankAccountInfo);
  };

  const getTimeFromCreatedTime = (dateTimeValue) => {
    const localTime = moment.utc(dateTimeValue).local().format(DateFormat.HH_MM);
    return localTime;
  };

  const getDateFromCreatedTime = (dateTimeValue) => {
    const localTime = moment.utc(dateTimeValue).local().format(DateFormat.DD_MM_YYYY);
    return localTime;
  };

  const getOptionString = (optionList) => {
    let optionString = "";
    optionList.map((option, index) => {
      optionString += `${option?.optionName} (${option?.optionLevelName})${index < optionList.length - 1 ? ", " : ""}`;
    });

    return optionString;
  };

  const calculateToppingsPrice = (toppings) => {
    return toppings
      ?.filter((topping) => topping.quantity > 0)
      ?.reduce((a, b) => {
        return a + (b?.priceAfterDiscount / b?.quantity) * b?.quantity;
      }, 0);
  };

  const feeAndTaxPopoverContent = () => {
    return (
      <div className="order-detail-popover-content">
        {checkIsHasTax() ? (
          <>
            <div className="discount-fee-label">{t("orderDetail.taxText")}</div>
            <div className="group-body">
              {handleSumTax(orderDetailData)?.map((taxItem) => {
                return (
                  taxItem?.tax && (
                    <ul>
                      <li className="list-item">
                        <div className="discount-fee-text">
                          <div className="discount-text">{`${taxItem?.tax?.name} (${taxItem?.tax?.percentage}%)`}</div>
                          <div className="discount-value">{`${formatTextNumber(taxItem?.price)} đ`}</div>
                        </div>
                      </li>
                    </ul>
                  )
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}

        {orderDetailData?.orderFees?.length > 0 ? (
          <>
            <div className="discount-fee-label">{t("orderDetail.feeText")}</div>
            <div className="group-body">
              {orderDetailData?.orderFees?.map((feeItem) => {
                const { isPercentage, feeValue, feeName } = feeItem;
                const originalOrderAmount = orderDetailData?.originalPrice;
                const value = isPercentage ? originalOrderAmount * (feeValue / 100) : feeValue; // calculate fee value if the fee is percentage
                return (
                  <ul>
                    <li className="list-item">
                      <div className="discount-fee-text">
                        {isPercentage ? (
                          <div className="discount-text">{`${feeName} (${feeValue}%)`}</div>
                        ) : (
                          <div className="discount-text">{`${feeName}`}</div>
                        )}
                        <div className="discount-value">{`${formatTextNumber(value)} đ`}</div>
                      </div>
                    </li>
                  </ul>
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const renderPromotionList = (promotionType, title) => {
    const filteredDiscounts = orderDetailData?.sumaryPromotionOrder?.filter((x) => x?.promotionType === promotionType);

    return (
      filteredDiscounts?.length > 0 && (
        <div>
          {<div className="discount-fee-label">{title}</div>}
          {filteredDiscounts?.map((discount) => (
            <DiscountPopoverComponent key={discount.id} discount={discount} promotionType={promotionType} />
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

  const discountPopoverContent = () => {
    return (
      <div className="order-detail-popover-content">
        {renderDiscountCode()}
        {renderPromotions()}

        {orderDetailData?.customerDiscountAmount > 0 ? (
          <ul>
            <div className="discount-fee-label">{t("orderDetail.memberText")}</div>
            <div className="group-body">
              <li class="list-item">
                <div className="discount-fee-text">
                  <div className="discount-text">{`${orderDetailData?.customerMemberShipLevel} (${orderDetailData?.customerMembershipDiscountPercent}%)`}</div>
                  <div className="discount-value">{`-${formatTextNumber(
                    roundNumber(orderDetailData?.customerDiscountAmount, 2),
                  )} đ`}</div>
                </div>
              </li>
            </div>
          </ul>
        ) : (
          <></>
        )}

        {orderDetailData?.pointDiscountValue > 0 ? (
          <>
            <div className="discount-fee-label">{translateData.points}</div>
            <div className="group-body">
              <ul>
                <li className="list-item">
                  <div className="discount-fee-text">
                    <div className="discount-text">
                      {translateData.use}{" "}
                      <span className="discount-loyalty-point">{orderDetailData.pointUsedQuantity}</span>{" "}
                      {translateData.point}
                    </div>
                    <div className="discount-value">{`-${formatTextNumber(
                      orderDetailData?.pointDiscountValue,
                    )} đ`}</div>
                  </div>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const getTextStatusOfOrder = (statusId) => {
    let status = "";
    switch (statusId) {
      case EnumOrderStatusStoreWeb.New:
        status = t("orderDetail.newStatus");
        break;
      case EnumOrderStatusStoreWeb.Returned:
        status = t("orderDetail.returnedStatus");
        break;
      case EnumOrderStatusStoreWeb.Canceled:
        status = t("orderDetail.canceledStatus");
        break;
      case EnumOrderStatusStoreWeb.ToConfirm:
        status = t("orderDetail.toConfirmStatus");
        break;
      case EnumOrderStatusStoreWeb.Processing:
        status = t("orderDetail.processingStatus");
        break;
      case EnumOrderStatusStoreWeb.Delivering:
        status = t("orderDetail.deliveringStatus");
        break;
      case EnumOrderStatusStoreWeb.Completed:
        status = t("orderDetail.completedStatus");
        break;
      case EnumOrderStatusStoreWeb.Draft:
        status = t("orderDetail.draftStatus");
        break;
      default:
        break;
    }

    return status;
  };

  const getColorStatus = (statusId) => {
    let colorGroup = { colorStatus: "", colorBackground: "" };
    switch (statusId) {
      case EnumOrderStatusStoreWeb.New:
        colorGroup.colorStatus = "#FF8C21";
        break;
      case EnumOrderStatusStoreWeb.Returned:
        colorGroup.colorStatus = "#BCBCBC";
        break;
      case EnumOrderStatusStoreWeb.Canceled:
        colorGroup.colorStatus = "#BCBCBC";
        break;
      case EnumOrderStatusStoreWeb.ToConfirm:
        colorGroup.colorStatus = "#428BC1";
        colorGroup.colorBackground = "#E4EFF6";
        break;
      case EnumOrderStatusStoreWeb.Processing:
        colorGroup.colorStatus = "#EE010F";
        break;
      case EnumOrderStatusStoreWeb.Delivering:
        colorGroup.colorStatus = "#366DFB";
        break;
      case EnumOrderStatusStoreWeb.Completed:
        colorGroup.colorStatus = "#50429B";
        break;
      case EnumOrderStatusStoreWeb.Draft:
        colorGroup.colorStatus = "#A5ABDE";
        break;
      default:
        break;
    }

    return colorGroup;
  };

  const renderButtonByStatusOrder = (statusId, id) => {
    let buttonControl = <></>;
    if (statusId === EnumOrderStatusStoreWeb.ToConfirm) {
      buttonControl = (
        <CancelOrderButton
          className="cancel-order-by-status float-right"
          buttonText={t("orderDetail.btnCancel")}
          orderId={orderDetailData?.id}
          callBack={getOrderDetailData}
        />
      );
    } else if (
      statusId !== EnumOrderStatusStoreWeb.ToConfirm &&
      statusId !== EnumOrderStatusStoreWeb.Draft &&
      statusId !== EnumOrderStatusStoreWeb.Processing &&
      statusId !== undefined
    ) {
      buttonControl = (
        <Button
          loading={isLoadingReOrder}
          className="btn-status btn-status-re-order"
          onClick={() => handleReOrder(id)}
          type="ghost"
        >
          <span>{t("orderDetail.btnReOrder")}</span>
        </Button>
      );
    } else if (statusId === EnumOrderStatusStoreWeb.Processing) {
      buttonControl = "";
    } else if (statusId === EnumOrderStatusStoreWeb.Draft) {
      buttonControl = (
        <Button className="btn-status btn-checkout" type="ghost">
          <span>{t("orderDetail.btnCheckOut")}</span>
        </Button>
      );
    } else {
      buttonControl = (
        <Button disabled={true} className="btn-status btn-status-re-order">
          <span>{"Loading..."}</span>
        </Button>
      );
    }

    return buttonControl;
  };

  const handleReOrder = () => {
    setIsReOrder(true);
    setIsLoadingReOrder(true);
  };

  const getComboName = (comboItem) => {
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

  const getProductItemName = (productItem) => {
    const productItemName = productItem?.product?.name;

    return `${productItemName} ${Boolean(productItem?.priceName) ? `(${productItem?.priceName})` : ""}`;
  };

  const checkIsHasTax = () => {
    let isHasTax = false;
    for (let i = 0; i < orderDetailData?.orderItems?.length; i++) {
      if (
        ((orderDetailData?.orderItems[i]?.productPrice?.product?.tax !== null ||
          orderDetailData?.orderItems[i]?.productPrice?.product?.tax !== undefined) &&
          orderDetailData?.orderItems[i]?.tax > 0) ||
        orderDetailData?.orderItems[i]?.isCombo
      ) {
        if (orderDetailData?.orderItems[i]?.isCombo) {
          if (checkIsHasTaxOnCombo(orderDetailData?.orderItems[i]?.orderComboItem)) {
            isHasTax = true;
            break;
          }
        } else {
          isHasTax = true;
          break;
        }
      }
    }
    return isHasTax;
  };

  const checkIsHasTaxOnCombo = (arrProductInCombo) => {
    let isHasTaxCombo = false;
    for (let i = 0; i < arrProductInCombo?.orderComboProductPriceItems?.length; i++) {
      if (
        arrProductInCombo?.orderComboProductPriceItems[i]?.productPrice?.product?.tax !== undefined ||
        arrProductInCombo?.orderComboProductPriceItems[i]?.itemTaxValue > 0
      ) {
        isHasTaxCombo = true;
        break;
      }
    }
    return isHasTaxCombo;
  };
  const locationBranch =
    orderDetailData?.storeBranch?.address.address1 +
    ", " +
    orderDetailData?.storeBranch?.address?.ward?.prefix +
    " " +
    orderDetailData?.storeBranch?.address?.ward?.name +
    ", " +
    orderDetailData?.storeBranch?.address?.district?.prefix +
    " " +
    orderDetailData?.storeBranch?.address?.district?.name +
    ", " +
    orderDetailData?.storeBranch?.address?.city?.name +
    ", " +
    orderDetailData?.storeBranch?.address?.country?.nicename;

  const StraightStyleDiv = styled.div`
    .straight {
      width: 110px;
      height: 4px;
      background: ${orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY
        ? colorOrderType?.Delivery
        : colorOrderType?.Pickup};
    }
  `;

  //This function handle for case: the first time popup will be closed automatically when clicked.
  const handleClickPopover = (e) => {
    e.stopPropagation();
  };

  const handleSumTax = (orderDetailData) => {
    let taxes = [];
    for (let orderItem of orderDetailData?.orderItems) {
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

  function ReceivePointNotification() {
    let earnPointText = formatTextNumber(earnPoint);
    const text = t(translateData.earnPointMessage, {
      earnPoints: earnPointText,
      earn_points: "earn-points",
    });
    const textComplete = t(translateData.earnPointCompleteMessage, {
      earnPoints: earnPointText,
      earn_points: "earn-points",
    });
    return (
      <>
        <div className="receive-point-container">
          {orderDetailData?.statusId !== EnumOrderStatusStoreWeb.Canceled &&
            orderDetailData?.statusId !== EnumOrderStatusStoreWeb.Completed && (
              <div className="receive-point-text">
                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                <EarnPointLogo className="point-logo" />
              </div>
            )}
          {orderDetailData?.statusId === EnumOrderStatusStoreWeb.Completed && (
            <div className="receive-point-text">
              <span dangerouslySetInnerHTML={{ __html: textComplete }}></span>
              <EarnPointLogo className="point-logo" />
            </div>
          )}
        </div>
      </>
    );
  }

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
    1: <DeliveryHeaderIcon />,
    2: <TakeAwayIcon />,
    3: <DeliveryHeaderIcon />,
    4: <PickUpIcon />,
  };

  const orderPlatformText = {
    AdminWebsite: "Admin Web",
    AdminMobileApp: "Admin App",
    POSWebsite: "POS Web",
    POSMobileApp: "POS App",
    StoreWebsite: "Store Web",
    StoreMobileApp: "Store App",
    OrderWebsite: "Order Web",
    OrderWobileApp: "Order App",
    POS: "POS",
    GoFOOD: "Go FOOD",
  };

  const getAddressStoreBranch = (address) => {
    if (address) {
      return `${address.address1}, ${address.ward?.prefix} ${address.ward?.name}, 
      ${address.district?.prefix} ${address.district?.name}, ${address.city?.name}, ${address.country?.nicename}`;
    }
    return "";
  };

  return (
    <div className="order-detail-container">
      <div
        onClick={() => {
          setVisibleOrderDetailPage(false);
          window.history.replaceState({ orderId: "" }, "");
        }}
        className="back-component"
      >
        <OrderDetailBackIcon className="back-icon" />
        <span>{translateData.myOrder}</span>
      </div>
      <div className="order-detail-header">
        <div className={`header-image ${orderTypeColor[orderDetailData?.orderTypeId]}`}>
          {/* {isMobileMode ? (
            <img src={headerOrderDetailMobileImage} alt="" className="image" />
          ) : (
            <img src={headerOrderDetailImage} alt="" className="image" />
          )} */}
          <div>
            <div className="header-status">
              <div className="order-delivery">
                {orderTypeIcon[orderDetailData?.orderTypeId]}
                <div>
                  <span className="order-detail-delivery-method">{orderTypeName[orderDetailData?.orderTypeId]}</span>
                  <span className="order-detail-code">
                    <span>#</span>
                    {`${orderDetailData?.stringCode}`}
                  </span>
                </div>
              </div>

              <div>
                <span
                  className="order-detail-status"
                  style={{
                    color: `${getColorStatus(orderDetailData?.statusId).colorStatus}`,
                    background: `${getColorStatus(orderDetailData?.statusId).colorBackground}`,
                  }}
                >
                  {getTextStatusOfOrder(orderDetailData?.statusId)}
                </span>

                {earnPoint > 0 && <ReceivePointNotification />}
                <div className="platform-group">
                  <PlatformIcon />
                  <div className="platform-text">
                    {
                      orderPlatformText[
                        Object.keys(Platform).find(
                          (key) => Platform[key]?.toLowerCase() === orderDetailData?.platformId?.toLowerCase(),
                        )
                      ]
                    }
                  </div>
                </div>
                {!isQRCodeInstore && (
                  <div className="group-btn">
                    {renderButtonByStatusOrder(orderDetailData?.statusId, orderDetailData?.id)}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="header-icon-detail">
            <HeaderOrderDetailIcon />
          </div>
        </div>

        {/* render delivery detail */}
        <div className="order-detail-information">
          {isQRCodeInstore ? (
            <div className="order-detail-content-theme2">
              <div className="receiver-information-2">
                <div className="left-contain location-contain">
                  <span className="group-item">
                    <span className="label">{translateData.location}</span>
                    <span className="location-store">{orderDetailData?.storeBranch?.branchName}</span>
                    <span className="location-address">{locationBranch}</span>
                  </span>
                </div>
              </div>

              <div className="receiver-information">
                <div className="left-contain">
                  <span className="group-item">
                    <span className="label">{translateData.area}</span>
                    <span className="value">{orderDetailData?.areaName}</span>
                  </span>
                </div>
                <div className="right-contain">
                  <span className="group-item">
                    <span className="label">{translateData.table}</span>
                    <span className="value">{orderDetailData?.tableName}</span>
                  </span>
                </div>
              </div>

              <div className="receiver-information-2">
                <div className="right-contain">
                  <span className="group-item">
                    <span className="label">{translateData.createdOrder}</span>
                    <span className="value">
                      {formatDate(orderDetailData?.createdTime, DateFormat.DD_MM_YYYY_HH_MM_2) ?? "-"}
                    </span>
                  </span>
                </div>
              </div>

              {orderDetailData?.note && (
                <div className="receiver-information-2">
                  <div className="left-contain">
                    <span className="group-item">
                      <span className="label">{translateData.note}</span>
                      <span className="note-contain">{orderDetailData?.note}</span>
                    </span>
                  </div>
                </div>
              )}

              {bankAccountInfo?.isVietnameseBank && (
                <div className="bank-transfer-detail-theme2">
                  <BankTransferPayment
                    bankAccountInfo={bankAccountInfo}
                    className="bank-tranfer-payment-detail-theme2"
                    orderId={orderDetailData?.stringCode}
                  />
                </div>
              )}
            </div>
          ) : orderDetailData?.orderTypeId == OrderType.TAKE_AWAY ? (
            <div className="order-detail-content-theme2">
              <div className="receiver-information-2">
                <div className="left-contain location-contain">
                  <span className="group-item">
                    <span className="label">{translateData.location}</span>
                    <span className="location-store">{orderDetailData?.storeBranch?.branchName}</span>
                    <span className="location-address">
                      {getAddressStoreBranch(orderDetailData?.storeBranch?.address)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="receiver-information">
                <div className="right-contain">
                  <span className="group-item">
                    <span className="label">{translateData.createdOrder}</span>
                    <span className="value">
                      {formatDate(orderDetailData?.createdTime, DateFormat.DD_MM_YYYY_HH_MM) ?? "-"}
                    </span>
                  </span>
                </div>
              </div>

              {orderDetailData?.note && (
                <div className="receiver-information-2">
                  <div className="left-contain">
                    <span className="group-item">
                      <span className="label">{translateData.note}</span>
                      <span className="note-contain">{orderDetailData?.note}</span>
                    </span>
                  </div>
                </div>
              )}

              {bankAccountInfo?.isVietnameseBank && (
                <div className="bank-transfer-detail-theme2">
                  <BankTransferPayment
                    bankAccountInfo={bankAccountInfo}
                    className="bank-tranfer-payment-detail-theme2"
                    orderId={orderDetailData?.stringCode}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="order-detail-content-theme2">
              <div className="receiver-information">
                <div className="left-contain">
                  <span className="group-item">
                    <span className="label">{t("orderDetail.receiver")}</span>
                    <span className="value">
                      {orderDetailData?.orderDelivery?.receiverName ?? orderDetailData?.customer?.fullName}
                    </span>
                  </span>
                </div>
                <div className="right-contain">
                  <span className="group-item">
                    <span className="label">{t("orderDetail.phoneNumber")}</span>
                    <span className="value">
                      {orderDetailData?.orderDelivery?.receiverPhone ?? orderDetailData?.customer?.phoneNumber}
                    </span>
                  </span>
                </div>
              </div>
              <div className="receiver-information">
                <div className="left-contain">
                  <span className="group-item">
                    {orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY && (
                      <span className="label">{translateData.scheduleTime}</span>
                    )}
                    {orderDetailData?.orderTypeId === enumOrderType.PICK_UP && (
                      <span className="label">{translateData.pickupTime}</span>
                    )}
                    <div
                      className="schedule-value"
                      style={{
                        background:
                          orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY
                            ? colorOrderType?.Delivery
                            : colorOrderType?.Pickup,
                      }}
                    >
                      {orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY && (
                        <span>
                          {formatDate(
                            orderDetailData?.scheduledTime ?? orderDetailData?.createdTime,
                            DateFormat.DD_MM_YYYY_HH_MM_2,
                          ) ?? "-"}
                        </span>
                      )}
                      {orderDetailData?.orderTypeId === enumOrderType.PICK_UP && (
                        <span>
                          {formatDate(
                            orderDetailData?.scheduledTime ?? orderDetailData?.createdTime,
                            DateFormat.HH_MM,
                          ) ?? "-"}
                        </span>
                      )}
                    </div>
                  </span>
                </div>
                <div className="right-contain">
                  <span className="group-item">
                    <span className="label">{translateData.createdOrder}</span>
                    <span className="value">
                      {formatDate(orderDetailData?.createdTime, DateFormat.DD_MM_YYYY_HH_MM_2) ?? "-"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="receiver-information-2">
                <div className="left-contain location-contain">
                  <span className="group-item">
                    <span className="label">{translateData.location}</span>
                    <span className="location-store">{orderDetailData?.orderDelivery?.senderName}</span>
                    <span className="location-address">{orderDetailData?.orderDelivery?.senderAddress}</span>
                  </span>
                </div>
              </div>

              {orderDetailData?.orderTypeId === OrderType.ONLINE_DELIVERY && (
                <div className="order-information-address">
                  <div className="sender-address">
                    <ReceiverAddressIcon />
                    <div class="right-information-address">
                      <span className="label">{translateData.senderAddress}</span>
                      <span className="location-address">{orderDetailData?.orderDelivery?.senderAddress}</span>
                    </div>
                  </div>
                  <div className="center-address">
                    <div className="border-address"></div>
                  </div>
                  <div className="receiver-address">
                    <SenderAddressIcon />
                    <div class="right-information-address">
                      <span className="label">{translateData.receiverAddress}</span>
                      <span className="location-address">{orderDetailData?.orderDelivery?.receiverAddress}</span>
                    </div>
                  </div>
                </div>
              )}

              {orderDetailData?.note && (
                <div className="receiver-information-2">
                  <div className="left-contain">
                    <span className="group-item">
                      <span className="label">{translateData.note}</span>
                      <span className="note-contain">{orderDetailData?.note}</span>
                    </span>
                  </div>
                </div>
              )}

              {bankAccountInfo?.isVietnameseBank && (
                <div className="bank-transfer-detail-theme2">
                  <BankTransferPayment
                    bankAccountInfo={bankAccountInfo}
                    className="bank-tranfer-payment-detail-theme2"
                    orderId={orderDetailData?.stringCode}
                  />
                </div>
              )}
            </div>
          )}

          {/* Render Progress bar */}
          {orderDetailData?.statusId !== EnumOrderStatusStoreWeb.Draft &&
            orderDetailData?.statusId !== EnumOrderStatusStoreWeb.Completed &&
            orderDetailData?.statusId !== EnumOrderStatusStoreWeb.Canceled && (
              <div className="progress-bar">
                <div className="progress-bar-item">
                  <div className="created-status-icon">
                    <CreatedOrderIconCustomize
                      color={
                        orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY
                          ? colorOrderType?.Delivery
                          : colorOrderType?.Pickup
                      }
                      className="created-status"
                    />
                  </div>
                  <div className="status-describe">
                    <span className="created-status-name">{t("orderDetail.creatingOrderProgressBar")}</span>
                    <span className="created-time">
                      <span>{getTimeFromCreatedTime(orderDetailData?.createdTime)}</span>
                      <span>{getDateFromCreatedTime(orderDetailData?.createdTime)}</span>
                    </span>
                  </div>
                </div>
                <StraightStyleDiv>
                  <div
                    className={`straight ${
                      orderDetailData?.statusId < EnumOrderStatusStoreWeb.Processing && "straight-schedule"
                    }`}
                  ></div>
                </StraightStyleDiv>

                <div className="progress-bar-item">
                  <div className="created-status-icon">
                    {orderDetailData?.statusId >= EnumOrderStatusStoreWeb.Processing ? (
                      <ProcessingOrderDetailStatusIconCustomize
                        color={
                          orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY
                            ? colorOrderType?.Delivery
                            : colorOrderType?.Pickup
                        }
                        className="created-status"
                      />
                    ) : (
                      <ProcessOrderDetailStatusIcon className="created-status" />
                    )}
                  </div>
                  <div className="status-describe">
                    <span
                      className={`created-status-name ${
                        orderDetailData?.statusId < EnumOrderStatusStoreWeb.Processing && "status-schedule"
                      }`}
                    >
                      {t("orderDetail.preparingOrderProgressBar")}
                    </span>
                    {orderDetailData?.statusId >= EnumOrderStatusStoreWeb.Processing && (
                      <span className="created-time">
                        <span>
                          {getTimeFromCreatedTime(
                            orderDetailData?.orderHistories.filter((a) =>
                              a.actionName
                                .toLowerCase()
                                .includes(EnumOrderStatusIncludeStringKey.Processing.name.toLowerCase()),
                            )[0]?.lastSavedTime ?? orderDetailData?.lastSavedTime,
                          )}
                        </span>
                        <span>
                          {getDateFromCreatedTime(
                            orderDetailData?.orderHistories.filter((a) =>
                              a.actionName
                                .toLowerCase()
                                .includes(EnumOrderStatusIncludeStringKey.Processing.name.toLowerCase()),
                            )[0]?.lastSavedTime ?? orderDetailData?.lastSavedTime,
                          )}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <StraightStyleDiv>
                  <div
                    className={`straight ${
                      orderDetailData?.statusId < EnumOrderStatusStoreWeb.Delivering && "straight-schedule"
                    }`}
                  ></div>
                </StraightStyleDiv>
                <div className="progress-bar-item">
                  <div className="created-status-icon ">
                    {orderDetailData?.statusId >= EnumOrderStatusStoreWeb.Delivering ? (
                      <DeliveringOrderDetailIconCustomize
                        color={
                          orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY
                            ? colorOrderType?.Delivery
                            : colorOrderType?.Pickup
                        }
                        className="created-status"
                      />
                    ) : (
                      <DeliverOrderDetailStatusIcon className="created-status" />
                    )}
                  </div>
                  <div className="status-describe">
                    <span
                      className={`created-status-name ${
                        orderDetailData?.statusId < EnumOrderStatusStoreWeb.Delivering && "status-schedule"
                      }`}
                    >
                      {t("orderDetail.deliveringOrderProgressBar")}
                    </span>
                    {orderDetailData?.statusId >= EnumOrderStatusStoreWeb.Delivering && (
                      <span className="created-time">
                        <span>
                          {getTimeFromCreatedTime(
                            orderDetailData?.orderHistories.filter((a) =>
                              a.actionName
                                .toLowerCase()
                                .includes(EnumOrderStatusIncludeStringKey.Delivering.name.toLowerCase()),
                            )[0]?.lastSavedTime ?? orderDetailData?.lastSavedTime,
                          )}
                        </span>
                        <span>
                          {getDateFromCreatedTime(
                            orderDetailData?.orderHistories.filter((a) =>
                              a.actionName
                                .toLowerCase()
                                .includes(EnumOrderStatusIncludeStringKey.Delivering.name.toLowerCase()),
                            )[0]?.lastSavedTime ?? orderDetailData?.lastSavedTime,
                          )}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="order-detail-product-list">
        <span className="title">
          <div className="straight"></div>
          {t("orderDetail.itemDetail")}
        </span>
        {/* Render product list */}
        <div className="order-detail-product-list-content">
          {orderDetailData?.orderItems?.map((orderItem, index) => {
            return (
              <>
                {orderItem?.isCombo ? (
                  <>
                    <div className="group">
                      <div>
                        <img
                          className="image"
                          src={orderItem?.orderComboItem?.combo?.thumbnail ?? productImageDefault}
                          alt=""
                        />
                      </div>
                      <div className="wrapper-product-item">
                        <div className="product-item">
                          <div className="product-item-group">
                            <div className="product-header-left">
                              <div className="product-item-name">
                                <Paragraph
                                  ellipsis={{
                                    rows: 2,
                                    tooltip: getComboName(orderItem?.orderComboItem),
                                  }}
                                >
                                  {getComboName(orderItem?.orderComboItem)}
                                </Paragraph>
                              </div>
                            </div>
                            <div className="product-header-right">
                              <div className="product-item-quantity">{orderItem?.quantity}</div>
                              <div className="product-item-price">
                                {`${formatTextCurrency(orderItem?.priceAfterDiscount)}`}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="product-item">
                          {orderItem?.orderComboItem?.orderComboProductPriceItems.map((comboItem) => {
                            return (
                              <>
                                <div className="product-item-group topping-group">
                                  <div className="product-name">{comboItem?.itemName}</div>
                                </div>
                                {comboItem?.orderItemOptions?.length > 0 && (
                                  <div className="product-item-group topping-group">
                                    <div className="product-topping-name product-option">
                                      {getOptionString(comboItem?.orderItemOptions)}
                                    </div>
                                  </div>
                                )}
                                {comboItem?.orderItemToppings?.length > 0 && (
                                  <>
                                    {comboItem?.orderItemToppings
                                      ?.filter((topping) => topping?.quantity > 0)
                                      ?.map((topping) => {
                                        return (
                                          <div className="product-item-group topping-group" key={randomGuid()}>
                                            <div className="product-topping-name ">{topping?.toppingName}</div>
                                            <div className="product-topping-quantity">{`x ${topping?.quantity}`}</div>
                                            <div className="product-topping-price">
                                              <div className="topping-price-col">
                                                <span>{`${formatTextCurrency(topping?.priceAfterDiscount)}`}</span>
                                                {topping?.priceAfterDiscount < topping?.originalPrice && (
                                                  <span className="topping-original-price">{`${formatTextCurrency(
                                                    topping?.originalPrice,
                                                  )}`}</span>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </>
                                )}
                              </>
                            );
                          })}
                        </div>
                        {orderItem?.notes && (
                          <div className="item-note">
                            <div className="note-icon">
                              <NoteIcon />
                            </div>
                            <div className="note-text">{orderItem?.notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < orderDetailData?.orderItems.length - 1 && (
                      <div className="straight">
                        <div className="item"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="group">
                      <div>
                        <img
                          className="image"
                          src={
                            (Boolean(orderItem?.productPrice?.product?.thumbnail)
                              ? orderItem?.productPrice?.product?.thumbnail
                              : productImageDefault) ?? productImageDefault
                          }
                          alt=""
                        />
                      </div>
                      <div className="wrapper-product-item">
                        <div className="product-item">
                          <div className="product-item-group">
                            <div
                              className={`product-header-left ${
                                orderItem?.orderItemToppings?.length <= 0 && orderItem?.orderItemOptions?.length <= 0
                                  ? "product-name-has-none-options"
                                  : ""
                              }`}
                            >
                              <div className="product-item-name">
                                <Paragraph
                                  ellipsis={{
                                    rows: 2,
                                    tooltip: getProductItemName(orderItem?.productPrice),
                                  }}
                                >
                                  {getProductItemName(orderItem?.productPrice)}
                                </Paragraph>
                              </div>
                            </div>

                            <div className="product-header-right">
                              <div
                                className={`product-item-quantity ${
                                  orderItem?.orderItemToppings?.length <= 0 && orderItem?.orderItemOptions?.length <= 0
                                    ? "product-quantity-has-none-options"
                                    : ""
                                }`}
                              >
                                {orderItem?.quantity}
                              </div>
                              <div
                                className={`product-item-price ${
                                  orderItem?.orderItemToppings?.length <= 0 && orderItem?.orderItemOptions?.length <= 0
                                    ? "product-price-has-none-options"
                                    : ""
                                }`}
                              >
                                <div>
                                  {`${formatTextCurrency(orderItem?.priceAfterDiscountIncludeTopping)}`}
                                  {orderItem?.priceAfterDiscountIncludeTopping !==
                                    orderItem?.originalPriceIncludeTopping &&
                                    !orderItem?.flashSaleId && (
                                      <div className="product-item-price-discount">
                                        <div className="price">{`${formatTextCurrency(
                                          orderItem?.originalPriceIncludeTopping,
                                        )}`}</div>
                                        {orderItem?.flashSaleId && (
                                          <div className="discount-percent-value">
                                            {orderItem?.flashSalePercentValue + "%"}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {(orderItem?.orderItemToppings.length > 0 || orderItem?.orderItemOptions.length > 0) && (
                          <div className="product-item">
                            <div className="product-item-group topping-group">
                              <div className="product-topping-name product-option">
                                {getOptionString(orderItem?.orderItemOptions)}
                              </div>
                            </div>

                            {orderItem?.orderItemToppings
                              ?.filter((a) => a.quantity > 0)
                              .map((topping) => {
                                return (
                                  <div className="product-item-group topping-group" key={randomGuid()}>
                                    <div className="product-topping-name">{topping?.toppingName}</div>
                                    <div className="product-topping-quantity">{`x ${topping?.quantity}`}</div>
                                    <div className="product-topping-price">
                                      <div className="topping-price-col">
                                        <span>{`${formatTextCurrency(topping?.priceAfterDiscount)}`}</span>
                                        {topping?.priceAfterDiscount < topping?.originalPrice && (
                                          <span className="topping-original-price">{`${formatTextCurrency(
                                            topping?.originalPrice,
                                          )}`}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                        {orderItem?.notes && (
                          <div className="item-note">
                            <div className="note-icon">
                              <NoteIcon />
                            </div>
                            <div className="note-text">{orderItem?.notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < orderDetailData?.orderItems.length - 1 && (
                      <div className="straight">
                        <div className="item"></div>
                      </div>
                    )}
                  </>
                )}
              </>
            );
          })}
        </div>

        <div className="footer">
          {isMobileMode ? (
            <img src={footerOrderDetailMobileImage} alt="" className="image" />
          ) : (
            <img src={footerOrderDetailImage} alt="" className="image" />
          )}
          <div className="total-order-container">
            <div className="group">
              <div className="label">{`${t("orderDetail.subTotal")} (${orderDetailData?.orderItems.length} món)`}</div>
              <div className="value">{`${formatTextNumber(orderDetailData?.originalPrice)} đ`}</div>
            </div>
            <div className="group">
              <div className="label">
                {t("orderDetail.discount")}
                {(orderDetailData?.customerDiscountAmount > 0 ||
                  orderDetailData?.sumaryPromotionOrder.length > 0 ||
                  orderDetailData?.pointDiscountValue > 0) && (
                  <Popover
                    overlayClassName="order-detail-popover"
                    placement="top"
                    showArrow={false}
                    trigger="click"
                    content={discountPopoverContent}
                    onOpenChange={(newOpen) => {
                      setOpenPopoverDiscount(newOpen);
                    }}
                    open={openPopoverDiscount}
                  >
                    {openPopoverDiscount ? (
                      <span onClick={(e) => handleClickPopover(e)}>
                        <OrderDetailArrowUpIcon className="order-detail-arrow" />
                      </span>
                    ) : (
                      <span onClick={(e) => handleClickPopover(e)}>
                        <OrderDetailArrowDownIcon className="order-detail-arrow" />
                      </span>
                    )}
                  </Popover>
                )}
              </div>
              <div className="value">{`-${formatTextNumber(
                roundNumber(orderDetailData?.totalDiscountAmount, 2),
              )} đ`}</div>
            </div>
            <div className="group">
              <div className="label">
                {t("orderDetail.feeAndTax")}
                {orderDetailData?.orderFees.length > 0 ||
                  (checkIsHasTax() && (
                    <Popover
                      overlayClassName="order-detail-popover"
                      placement="bottom"
                      showArrow={false}
                      trigger="click"
                      content={feeAndTaxPopoverContent}
                      onOpenChange={(newOpen) => {
                        setOpenPopoverFeeAndTax(newOpen);
                      }}
                      open={openPopoverFeeAndTax}
                    >
                      {openPopoverFeeAndTax ? (
                        <span onClick={(e) => handleClickPopover(e)}>
                          <OrderDetailArrowUpIcon className="order-detail-arrow" />
                        </span>
                      ) : (
                        <span onClick={(e) => handleClickPopover(e)}>
                          <OrderDetailArrowDownIcon className="order-detail-arrow" />
                        </span>
                      )}
                    </Popover>
                  ))}
              </div>
              <div className="value">{`${formatTextNumber(
                orderDetailData?.totalFee + orderDetailData?.totalTax,
              )} đ`}</div>
            </div>

            {orderDetailData?.orderTypeId === enumOrderType.ONLINE_DELIVERY && (
              <div className="group">
                <div className="label">{t("orderDetail.deliveryFee")}</div>
                <div className="value">{`${formatTextNumber(orderDetailData?.deliveryFee)} đ`}</div>
              </div>
            )}
            <div className="group">
              <div className="label">{t("orderDetail.paymentMethod")}</div>
              <div className="value payment-method">
                {translatePayment(orderDetailData?.paymentMethodName)}
                {orderDetailData?.orderPaymentStatus && (
                  <div
                    className={`paid-status ${
                      orderDetailData?.orderPaymentStatusId === OrderPaymentStatus.Paid
                        ? "status-paid"
                        : "status-unpaid"
                    }`}
                  >
                    {translateOrderPaymentStatus(orderDetailData?.orderPaymentStatus)}
                  </div>
                )}
              </div>
            </div>
            <div className="group group-note">
              <div className="title-note">{t("theme.checkout.note")}</div>
              {orderDetailData?.note ? <div className="content-note">{orderDetailData?.note}</div> : "-"}
            </div>
            <div className="group">
              <div className="label label-total">{t("orderDetail.total")}</div>
              <div className="value value-total">{`${formatTextNumber(
                Math.round(orderDetailData?.totalAmount),
              )} đ`}</div>
            </div>
          </div>
        </div>
      </div>

      {isReOrder ? (
        <ReOrderComponent
          orderDetailData={orderDetailData}
          onClosed={() => {
            setIsReOrder(false);
            setIsLoadingReOrder(false);
          }}
          t={t}
        />
      ) : null}
    </div>
  );
}
