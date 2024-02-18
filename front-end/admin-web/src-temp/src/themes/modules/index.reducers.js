import { combineReducers } from "redux";
import orderReducer from "./order/order.reducers";
import processingReducer from "./processing/processing.reducers";
import productReducer from "./product/product.reducers";
import sessionReducer from "./session/session.reducers";
import themeConfigReducer from "./theme-customize/theme-customize.reducers";
import thirdPartyReducer from "./third-party-response/third-party-response.reducers";
import toastMessageReducer from "./toast-message/toast-message.reducers";

const rootReducer = combineReducers({
  session: sessionReducer,
  processing: processingReducer,
  thirdParty: thirdPartyReducer,
  toastMessage: toastMessageReducer,
  order: orderReducer,
  product: productReducer,
  themeConfig: themeConfigReducer,
});

export default rootReducer;
