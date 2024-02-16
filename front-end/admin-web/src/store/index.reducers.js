import { combineReducers } from "redux";
import processingReducer from "./modules/processing/processing.reducers";
import sessionReducer from "./modules/session/session.reducers";

const rootReducer = combineReducers({
  session: sessionReducer,
  processing: processingReducer,
});

export default rootReducer;
