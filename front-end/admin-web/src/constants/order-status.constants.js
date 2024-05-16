export const OrderStatus = {
  New: 0,
  ToConfirm: 1,
  Delivering: 2,
  Completed: 3,
  Returned: 4,
  Canceled: 5
}

export const OrderStatusColor = {
  0: 'new-order-color',
  1: 'to-confirm-order-color',
  2: 'delivering-order-color',
  3: 'completed-order-color',
  4: 'returned-order-color',
  5: 'canceled-order-color'
}

export const orderStatusLocalization = {
  0: 'orderStatus.new',
  1: 'orderStatus.toConfirm',
  2: 'orderStatus.delivering',
  3: 'orderStatus.completed',
  4: 'orderStatus.returned',
  5: 'orderStatus.canceled'
}

export const EnumOrderActionType = {
  CREATE_ORDER: 0,
  EDIT_ORDER: 1,
  CANCEL: 2,
  PAID_SUCCESSFULLY: 3,
  PAID_FAILED: 4,
  PROCESSING: 5,
  COMPLETE: 6,
  OLD_DATA: 7,
  THIRD_PARTIES: 8
}
export const OrderOptionDate={
  Today : 0,
  Yesterday : 1,
  ThisWeek : 2,
  LastWeek : 3,
  ThisMonth : 4,
  LastMonth : 5,
  ThisYear : 6,
  Customize : 7,
}