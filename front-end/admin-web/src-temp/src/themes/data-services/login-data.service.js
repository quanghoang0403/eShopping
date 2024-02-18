import { createHttp } from "../utils/http-common";

const controller = "login";

const loginForCustomerByPhoneNumber = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/login-for-customer-by-phone-number`, data);
};

const customerLoginAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/customer`, data);
};

const getAddressListByAccountIdAsync = (accountId, storeId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-address-list-by-account-id?accountId=${accountId}&storeId=${storeId}`);
};

const fetchExistsAccountAndCustomerByPhoneAsync = (data) => {
  const http = createHttp();
  return http.get(
    `/${controller}/fetch-exists-account-and-customer?storeId=${data.storeId}&phoneNumber=${data.phoneNumber}&phoneCode=${data.phoneCode}`,
  );
};

const loginDataService = {
  loginForCustomerByPhoneNumber,
  customerLoginAsync,
  getAddressListByAccountIdAsync,
  fetchExistsAccountAndCustomerByPhoneAsync,
};

export default loginDataService;
