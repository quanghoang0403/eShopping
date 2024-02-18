import http from "utils/http-common";
import qs from "query-string";

const controller = "reservetable";

const getReserveTablesAsync = (params) => {
  return http.get(`/${controller}`, {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { encode: false });
    },
  });
};

const getReserveTableAsync = (id) => {
  return http.get(`/${controller}/${id}`);
};

const reserveTableDataService = {
  getReserveTablesAsync,
  getReserveTableAsync,
};

export default reserveTableDataService;
