import { t } from "i18next";
import moment from "moment";
import {
  EnumActionTypeOrderHistoryLocal,
  EnumOrderActionHistory,
  enumCheckInactiveProduct,
} from "../../constants/enums";
import { DateFormat } from "../../constants/string.constants";
import orderActionHistoryDataService from "../../data-services/order-action-history-data.service";
import orderDataService from "../../data-services/order-data.service";
import productDataService from "../../data-services/product-data.service";
import qrCodeDataService from "../../data-services/qrcode-data.service";
import signalDataService from "../../data-services/signal-data.service";
import { store } from "../../modules";
import { setQrCodeOrder } from "../../modules/order/order.actions";
import { isNonEmptyArray, isSameDay } from "../../utils/helpers";
import { HttpStatusCode } from "../../utils/http-common";
import { getStorage, localStorageKeys } from "../../utils/localStorage.helpers";
import reduxService from "../redux.services";
const ORDER_ACTION_HISTORY = "ORDER_ACTION_HISTORY";
const ValidTimeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
function getOrderActionToHistoriesLocalStorage() {
  const jsonStringOrderActionHistories = localStorage.getItem(ORDER_ACTION_HISTORY);
  if (!Boolean(jsonStringOrderActionHistories)) {
    return [];
  }
  const orderActionHistories = JSON.parse(jsonStringOrderActionHistories) ?? [];
  return orderActionHistories;
}

function saveOrderActionHistoryToLocalStorage(historyData, orderSessionData) {
  const histories = getOrderActionToHistoriesLocalStorage();
  const dateTime = new Date();
  const qrOrderInfo = reduxService.getQROrderInfo();
  const reduxState = store.getState();
  const history = { ...historyData, time: dateTime };

  if (qrOrderInfo) {
    history.qrOrderId = qrOrderInfo?.qrCodeId;
    history.areaName = qrOrderInfo?.areaName;
  }

  if (orderSessionData) {
    history.orderCode = orderSessionData?.stringCode;
    history.orderId = orderSessionData?.orderId;
    history.orderSessionId = orderSessionData?.orderSessionId;
    history.orderSessionCode = orderSessionData?.orderSessionCode;
    history.stringOrderSessionCode = orderSessionData?.stringOrderSessionCode;
  } else {
    const orderDetail = reduxState?.order?.orderDetail ?? [];
    if (orderDetail) {
      history.orderCode = orderDetail?.stringCode;
      history.orderId = orderDetail?.orderId;
      history.orderSessionId = orderDetail?.orderSessionId;
      history.orderSessionCode = orderDetail?.orderSessionCode;
      history.stringOrderSessionCode = orderDetail?.stringOrderSessionCode;
    }
  }

  histories.push(history);
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

      //Sync order action histories local storage to db if login
      await syncOrderActionHistoriesToDatabase();

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
  if (res?.data.responseCode === enumCheckInactiveProduct.NOT_FOUND) {
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

async function createOrderActionHistories(orderActionHistories, customerId) {
  const request = {
    customerId: customerId,
    orderActionHistories: orderActionHistories,
  };
  const response = await orderActionHistoryDataService.CreateOrderActionHistoriesAsync(request);
  if (response.status === HttpStatusCode.Ok) {
    return response.data;
  } else {
    return false;
  }
}

async function getOrderActionHistoriesDatabase(customerId) {
  const response = await orderActionHistoryDataService.getOrderActionHistoriesAsync(customerId);
  if (response?.status === HttpStatusCode.Ok) {
    const data = response?.data;
    return data;
  } else {
    return [];
  }
}

function mappingActionTypesOrderActionToDatabase(type) {
  const typeMappings = {
    [EnumActionTypeOrderHistoryLocal.ORDER]: EnumOrderActionHistory.ORDER,
    [EnumActionTypeOrderHistoryLocal.ADD_ITEM]: EnumOrderActionHistory.ADD_ITEM,
    [EnumActionTypeOrderHistoryLocal.CALL_WAITER]: EnumOrderActionHistory.CALL_WAITER,
    [EnumActionTypeOrderHistoryLocal.CALL_PAYMENT]: EnumOrderActionHistory.CALL_PAYMENT,
  };

  return typeMappings[type] || null;
}

function mappingDataOrderActionHistoriesToDatabase(data) {
  const _message = data.action === EnumActionTypeOrderHistoryLocal.CALL_WAITER ? data.content : "";
  const _actionType = mappingActionTypesOrderActionToDatabase(data?.action);
  return {
    ...data,
    orderId: data?.orderId,
    qrOrderId: data?.qrCodeId,
    actionType: _actionType,
    createTime: data?.time,
    content: _message,
    areaTableName: data?.areaName,
  };
}

function mappingOrderInfoHistories(dataOrder) {
  if (!isNonEmptyArray(dataOrder)) return [];
  const orderInfo = dataOrder.map((orderItem) => {
    const { isCombo, orderItemOptions, orderItemToppings, itemName, quantity, productPriceName, orderComboItem } =
      orderItem;
    if (isCombo) {
      return {
        isCombo,
        quantity: quantity,
        itemName: productPriceName ?? itemName,
        orderItems: orderComboItem?.orderComboProductPriceItems.map((item) => {
          const { orderItemOptions, quantity, orderItemToppings, productPrice } = item;
          return {
            itemName: productPrice?.priceName
              ? `${productPrice?.product?.name} - ${productPrice?.priceName}`
              : `${productPrice?.product?.name}`,
            quantity: quantity ?? 0,
            options: orderItemOptions
              ?.map((o) => {
                const { optionName, optionLevelName } = o;
                if (optionLevelName) {
                  return `${optionName} (${optionLevelName})`;
                }
                return `${optionName}`;
              })
              ?.join(", "),
            toppings: orderItemToppings?.map((t) => {
              return {
                ...t,
                itemName: t?.toppingName,
                quantity: t?.quantity,
              };
            }),
          };
        }),
      };
    } else {
      return {
        isCombo: false,
        quantity: quantity,
        itemName: itemName,
        orderItems: [
          {
            itemName: itemName,
            quantity: quantity,
            options: orderItemOptions
              ?.map((o) => {
                const { optionName, optionLevelName } = o;
                if (optionLevelName) {
                  return `${optionName} (${optionLevelName})`;
                }
                return `${optionName}`;
              })
              ?.join(", "),
            toppings: orderItemToppings?.map((t) => {
              return {
                ...t,
                itemName: t?.toppingName,
                quantity: t?.quantity,
              };
            }),
          },
        ],
      };
    }
  });
  return orderInfo;
}

//groupedOrderActionHistories by time and order
function groupedOrderActionHistories(histories) {
  return histories
    .reduce((result, item) => {
      const existingItem = result?.find((group) => {
        // Convert group.time and item.time objects to Date objects if they are not Date objects
        const groupTime = group.time instanceof Date ? group.time : new Date(group.time);
        const itemTime = item.time instanceof Date ? item.time : new Date(item.time);
        return groupTime.toDateString() === itemTime.toDateString() && group?.orderId === item?.orderId;
      });
      if (!existingItem) {
        const timeTitle = !isSameDay(new Date(item?.time))
          ? moment(new Date(item?.time)).format(DateFormat.DD_MM_YYYY)
          : t("deliveryTime.today");
        result.push({
          time: item?.time,
          orderCode: item?.orderCode,
          orderId: item?.orderId,
          timeTitle: timeTitle,
          dataList: [{ ...item }],
        });
      } else {
        if (!existingItem?.orderCode && item?.orderCode) {
          existingItem.orderCode = item?.orderCode;
        }
        existingItem.time = item?.time;
        existingItem?.dataList?.push(item);
      }
      return result;
    }, [])
    .sort((a, b) => new Date(a.time) - new Date(b.time));
}

//Sync order action histories local storage to db if login
async function syncOrderActionHistoriesToDatabase() {
  const customerInfo = JSON.parse(getStorage(localStorageKeys.CUSTOMER_INFO));
  if (customerInfo) {
    const orderActionHistories = getOrderActionToHistoriesLocalStorage();
    if (!isNonEmptyArray(orderActionHistories)) return true;
    let syncOrderActionHistories = orderActionHistories.filter((item) => !item.isSync);
    if (!isNonEmptyArray(syncOrderActionHistories)) return true;
    const historiesLocalStorage = syncOrderActionHistories?.map(mappingDataOrderActionHistoriesToDatabase) || [];
    const isSync = await createOrderActionHistories(historiesLocalStorage, customerInfo?.accountId);
    if (isSync) {
      const newHistoriesLocalStorage = syncOrderActionHistories
        ?.map((h) => ({ ...h, isSync }))
        .concat(orderActionHistories.filter((item) => item.isSync));
      const jsonString = JSON.stringify(newHistoriesLocalStorage);
      localStorage.setItem(ORDER_ACTION_HISTORY, jsonString);
    }
  }
}

const orderService = {
  cloneItemFromOrderToCart,
  sendNotify2CallWaiterAsync,
  sendNotify2CallPaymentAsync,
  getQrCodeOrderAsync,
  getOrderActionToHistoriesLocalStorage,
  saveOrderActionHistoryToLocalStorage,
  verifyProduct,
  getScheduleTime,
  createOrderActionHistories,
  getOrderActionHistoriesDatabase,
  mappingDataOrderActionHistoriesToDatabase,
  groupedOrderActionHistories,
  mappingOrderInfoHistories,
  syncOrderActionHistoriesToDatabase,
  mappingActionTypesOrderActionToDatabase,
};

export default orderService;
