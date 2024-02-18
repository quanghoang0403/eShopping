export const OrderStatus = {
  Returned: 1,
  Canceled: 2,
  ToConfirm: 3,
  Processing: 4,
  Delivering: 5,
  Completed: 6,
  Draft: 7,
};

export const OrderStatusColor = {
  0: "new-order-color",
  1: "returned-order-color",
  2: "canceled-order-color",
  3: "to-confirm-order-color",
  4: "processing-order-color",
  5: "delivering-order-color",
  6: "completed-order-color",
  7: "draft-order-color",
};

export const EnumOrderActionType = {
  CREATE_ORDER: 0,
  EDIT_ORDER: 1,
  CANCEL: 2,
  PAID_SUCCESSFULLY: 3,
  PAID_FAILED: 4,
  PROCESSING: 5,
  COMPLETE: 6,
  OLD_DATA: 7,
  THIRD_PARTIES: 8,
};
