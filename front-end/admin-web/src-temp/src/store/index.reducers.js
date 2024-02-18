import { combineReducers } from "redux";
import commonReducer from "./modules/common/common.reducers";
import branchReducer from "./modules/branch/branch.reducers";
import processingReducer from "./modules/processing/processing.reducers";
import qrCodeReducer from "./modules/qr-code/qr-code.reducer";
import sessionReducer from "./modules/session/session.reducers";
import themeConfigReducer from "./modules/theme-customize/theme-customize.reducers";
import reserveTableReducer from "./modules/reservation/reservation.reducers";
import menuManagementReducer from "./modules/menu-management/menu-management.reducer";

const rootReducer = combineReducers({
  common: commonReducer,
  session: sessionReducer,
  processing: processingReducer,
  qrCode: qrCodeReducer,
  branch: branchReducer,
  themeConfig: themeConfigReducer,
  reserveTable: reserveTableReducer,
  menuManagement: menuManagementReducer
});

export default rootReducer;
