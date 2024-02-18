import Moment from "moment";
import actionTypes from "./order.type";

const initialState = {
  qrOrder: {
    branchId: null,
  },
  lastUpdated: Moment.utc(),
  discountCodes: [],
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_QR_ORDER:
      return {
        ...state,
        isLoading: false,
        qrOrder: action.payload,
      };

    case actionTypes.SET_POS_DISCOUNT_CODES:
      return {
        ...state,
        isLoading: false,
        discountCodes: action.payload,
      };

    default:
      return state;
  }
};

export const orderInfoSelector = (state) => state?.order?.qrOrder ?? null; //will delete later
export const qrOrderSelector = (state) => state?.order?.qrOrder ?? null;
export const posDiscountCodesSelector = (state) => state?.order?.discountCodes ?? [];
export const cartValidatedSelector = (state) => state?.session?.orderInfo?.cartValidated ?? {};
export const qrCodeBranchIdSelector = (state) => state?.order?.qrOrder?.branchId ?? null;

export default orderReducer;
