import Moment from "moment";
import actionTypes from "./product.type";

const initialState = {
  productListPageData: [],
  combos: [],
  startUsingTime: Moment.utc(),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PRODUCT_LIST_PAGE_DATA:
      return { ...state, productListPageData: action.payload };
    default:
      return state;
  }
};

export const productListPageDataSelector = (state) => state?.product?.productListPageData ?? [];

export default reducer;
