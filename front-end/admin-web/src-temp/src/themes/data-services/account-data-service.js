import { queryParamsUrl } from "../utils/helpers";
import { createHttp } from "../utils/http-common";

const controller = "account";

const getAccountAddressesByAccountIdAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-account-addresses-by-account-id`);
};

const createAccountAddressAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/create-account-address`, data);
};

const updateAccountAddressByIdAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/update-account-address`, data);
};

const deleteAccountAddressByIdAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/delete-account-address`, data);
};

const updateAccountPasswordAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/update-password`, data);
};

const updateDefaultAccountAddressAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/update-default-account-address`, data);
};

const accountDataService = {
  getAccountAddressesByAccountIdAsync,
  createAccountAddressAsync,
  updateAccountAddressByIdAsync,
  deleteAccountAddressByIdAsync,
  updateAccountPasswordAsync,
  updateDefaultAccountAddressAsync
};

export default accountDataService;
