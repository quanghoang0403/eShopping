import { createHttp } from "../utils/http-common";

const controller = "area";

const getDetailAreaAndTableAsync = (storeBranchId) => {
  const http = createHttp();
  return http.get(`/${controller}/${storeBranchId}`);
};

const getDescriptionById = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/${id}/description`);
};

const areaDataService = {
  getDetailAreaAndTableAsync,
  getDescriptionById,
};

export default areaDataService;
