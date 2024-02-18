import Moment from "moment";
import actionTypes from "./third-party-response.type";

const processingInitialState = {
  momoPaymentResponse: null,
  lastUpdated: Moment.utc(),
};

const processingReducer = (state = processingInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MOMO_PAYMENT_RESPONSE:
      return {
        ...state,
        momoPaymentResponse: action.payload,
      };

    default:
      return state;
  }
};

export default processingReducer;
