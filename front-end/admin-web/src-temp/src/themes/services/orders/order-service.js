import moment from "moment";
import { enumCheckInactiveProduct } from "../../constants/enums";
import orderDataService from "../../data-services/order-data.service";
import productDataService from "../../data-services/product-data.service";
import qrCodeDataService from "../../data-services/qrcode-data.service";
import signalDataService from "../../data-services/signal-data.service";
import { store } from "../../modules";
import { setQrCodeOrder } from "../../modules/order/order.actions";
import { HttpStatusCode } from "../../utils/http-common";
const ORDER_ACTION_HISTORY = "ORDER_ACTION_HISTORY";
const ValidTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
function getOrderActionToHistories() {
  const jsonStringOrderActionHistories = localStorage.getItem(ORDER_ACTION_HISTORY);
  if (!Boolean(jsonStringOrderActionHistories)) {
    return [];
  }
  const orderActionHistories = JSON.parse(jsonStringOrderActionHistories) ?? [];
  return orderActionHistories;
}

function saveOrderActionToHistory({ action, areaName, content }) {
  const histories = getOrderActionToHistories();
  const dateTime = new Date();

  histories.push({ action, areaName, content, time: dateTime });
  const jsonString = JSON.stringify(histories);
  localStorage.setItem(ORDER_ACTION_HISTORY, jsonString);
}

const cloneItemFromOrderToCart = async (orders) => {
  let orderItem = await orderDataService.getOrderItemsByIdAsync(orders?.id);
  if (orderItem?.data) {
    var listOrderItem = orderItem?.data?.orderItems;
    var newCartItems = [];

    for (let i = 0; i < listOrderItem.length; i++) {
      newCartItems.push(listOrderItem[i]);
    }
  }

  return {
    newCartItems: newCartItems,
    paymentMethodId: orderItem?.data?.paymentMethodId,
    deliveryMethodId: orderItem?.data?.deliveryMethodId,
    orderTypeId: orderItem?.data?.orderTypeId,
  };
};

async function sendNotify2CallWaiterAsync(qrCodeOrder, message, callback) {
  if (!qrCodeOrder) {
    return;
  }
  const { tableId, branchId } = qrCodeOrder;
  const request = {
    areaTableId: tableId,
    branchId: branchId,
    message: message,
  };
  try {
    await signalDataService.callWaiterAsync(request);
    callback && callback(true);
  } catch (ex) {
    callback && callback(false);
  }
}

async function sendNotify2CallPaymentAsync(qrCodeOrder, callback) {
  if (!qrCodeOrder) {
    return;
  }
  const { tableId, branchId } = qrCodeOrder;
  const request = {
    areaTableId: tableId,
    branchId: branchId,
  };
  try {
    await signalDataService.callPaymentAsync(request);
    callback && callback(true);
  } catch (ex) {
    callback && callback(false);
  }
}

async function getQrCodeOrderAsync(qrCodeId, forceReduxToChange = false) {
  const res = await qrCodeDataService.getQrCodeOrderAsync(qrCodeId);
  if (res.status === HttpStatusCode.Ok) {
    const responseData = res.data;
    if (responseData.succeeded) {
      const { qrCodeOrder, products } = responseData.data;
      let orderRedirectUrl = `/pos?qrCodeId=${qrCodeOrder.qrCodeId}`;
      const storeInfo = {
        storeId: qrCodeOrder.storeId,
        branchId: qrCodeOrder.branchId,
        tableId: qrCodeOrder.tableId,
        storeLogo: qrCodeOrder.storeLogo,
        storeName: qrCodeOrder.storeName,
        branchName: `${qrCodeOrder.storeName} - ${qrCodeOrder.branchName}`,
        branchAddress: qrCodeOrder.branchAddress,
        areaName: qrCodeOrder.areaName,
        qrCodeId: qrCodeOrder.qrCodeId,
        serviceTypeId: qrCodeOrder.serviceTypeId,
        targetId: qrCodeOrder.targetId,
        qrCodeStatus: qrCodeOrder.qrCodeStatus,
        qrTargetCode: qrCodeOrder.qrTargetCode,
        serviceCode: qrCodeOrder.serviceCode,
        orderRedirectUrl: orderRedirectUrl,
        isStopped: qrCodeOrder.isStopped,
        products, // products to add to cart
      };

      if (forceReduxToChange) {
        storeInfo.key = moment.now();
      }

      store.dispatch(setQrCodeOrder(storeInfo));

      return true;
    } else {
      store.dispatch(setQrCodeOrder(null));
    }
  } else if (res.status === HttpStatusCode.BadRequest) {
    store.dispatch(setQrCodeOrder(null));
  }

  return false;
}

async function verifyProduct(
  productId,
  branchAddress,
  promotionId,
  promotionType,
  productPriceId,
  platformId,
  isApplyFlashSale = true,
) {
  const res = await productDataService.verifyProductStoreThemeAsync(
    productId,
    platformId,
    branchAddress?.id,
    promotionId,
    promotionType,
    productPriceId,
    isApplyFlashSale,
  );
  if (res?.data.responseCode == enumCheckInactiveProduct.NOT_FOUND) {
    window.location.reload();
    return;
  } else {
    return res;
  }
}

function isTimeValid(timeSlot) {
  const timePattern = ValidTimeRegex;
  if (typeof timeSlot === "string" && timePattern.test(timeSlot)) {
    return true;
  } else {
    return false;
  }
}

/// deliveryDate : YYYY-MM-DD and timeSlot: HH:mm
function getScheduleTime(deliveryDate, timeSlot) {
  let scheduledTime = deliveryDate && isTimeValid(timeSlot) ? deliveryDate + " " + timeSlot : null;

  const scheduledTimeNow = moment(scheduledTime, "YYYY-MM-DD HH:mm");
  if (scheduledTimeNow.isBefore(moment())) {
    scheduledTime = moment().format("YYYY-MM-DD HH:mm");
  }

  return scheduledTime;
}

const orderService = {
  cloneItemFromOrderToCart,
  sendNotify2CallWaiterAsync,
  sendNotify2CallPaymentAsync,
  getQrCodeOrderAsync,
  getOrderActionToHistories,
  saveOrderActionToHistory,
  verifyProduct,
  getScheduleTime,
};

export default orderService;
