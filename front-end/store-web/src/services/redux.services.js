import { store } from "../modules";

const getAllData = () => {
  const reduxState = store.getState();
  const session = reduxState?.session;
  return session;
};

const dispatch = (data) => {
  store.dispatch(data);
};

const getPOSCartItems = () => {
  const reduxState = store.getState();
  const posCartItems = reduxState?.session?.posCartItems ?? [];
  return posCartItems;
};

const getQROrderInfo = () => {
  const reduxState = store.getState();
  const qrOrderInfo = reduxState?.order?.qrOrder ?? null;
  return qrOrderInfo;
};

const getPOSDiscountCodes = () => {
  const reduxState = store.getState();
  const discountCodes = reduxState?.order?.discountCodes ?? [];
  return discountCodes;
};

const getOrderInfo = () => {
  const reduxState = store.getState();
  const orderInfo = reduxState?.order ?? null;
  return orderInfo;
};

const getUserLoginInfo = () => {
  const reduxState = store.getState();
  const userLoginInfo = reduxState?.session?.userInfo ?? null;
  return userLoginInfo;
};

const getWorkingHourByBranch = () => {
  const reduxState = store.getState();
  const workingHour = reduxState?.workingHour ?? null;
  return workingHour;
}

const reduxService = {
  getAllData,
  dispatch,
  getPOSCartItems,
  getQROrderInfo,
  getPOSDiscountCodes,
  getOrderInfo,
  getWorkingHourByBranch,
  getUserLoginInfo,
};

export default reduxService;
