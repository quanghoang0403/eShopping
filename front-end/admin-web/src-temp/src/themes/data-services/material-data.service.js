import { createHttp } from "../utils/http-common";

const controller = "material";

const materialCheckProductPriceId = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/check`, data);
};


const materialDataService = {
  materialCheckProductPriceId,
};
export default materialDataService;
