import { createHttp } from "../utils/http-common";

const controller = "customer";

const updateCustomerProfile = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/update-customer-profile`, data);
};
const uploadCustomerAvatar = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/upload-customer-avatar-by-id`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getMyOrders = (pageNumber, pageSize, orderStatusId) => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-my-orders?pageNumber=${pageNumber}&pageSize=${pageSize}&orderStatusId=${orderStatusId}`,
  );
};

const checkExistCustomerProfileAsync = (data) => {
  const http = createHttp();
  return http.get(
    `/${controller}/check-exist-customer-profile?phoneNumber=${data.phoneNumber}&phoneCode=${data.phoneCode}`,
  );
};

const verifyCustomerLoyaltyPointAsync = (currentAvailablePoint, currentRedeemPointExchangeValue, customerId) => {
  const http = createHttp();
  return http.get(
    `/${controller}/verify-customer-loyalty-point?currentAvailablePoint=${currentAvailablePoint}&currentRedeemPointExchangeValue=${currentRedeemPointExchangeValue}&customerId=${
      customerId ?? ""
    }`,
  );
};

const getCustomerLoyaltyPointAsync = (accountId, storeId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-customer-loyalty-point?accountId=${accountId}`);
};

const getMembershipLevelInformation = (customerId, storeId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-membership-level-information?customerId=${customerId}&storeId=${storeId}`);
};

const getCustomerMembershipLevel = (storeId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-customer-membership-level?storeId=${storeId}`);
};

const getPointHistoryByFilter = (params) => {
  const http = createHttp();
  const newParams = { ...params };
  let queryParams = "";
  for (const key in newParams) {
    if (queryParams !== "") {
      queryParams += "&";
    }
    queryParams += key + "=" + encodeURIComponent(newParams[key]);
  }
  return http.get(`/${controller}/get-point-history-by-filter?${queryParams}`);
};

const getCustomerInfoAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}`);
};

const customerDataService = {
  updateCustomerProfile,
  uploadCustomerAvatar,
  getMyOrders,
  checkExistCustomerProfileAsync,
  verifyCustomerLoyaltyPointAsync,
  getCustomerLoyaltyPointAsync,
  getMembershipLevelInformation,
  getCustomerMembershipLevel,
  getPointHistoryByFilter,
  getCustomerInfoAsync,
};

export default customerDataService;
