import { createHttp } from "../utils/http-common";

const controller = "country";
const getCountryList = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-countries`);
};

const countryDataService = {
  getCountryList,
};

export default countryDataService;
