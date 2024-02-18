import { createHttp } from "../utils/http-common";

const controller = "areatable";

const getDescriptionById = (id) => {
  const http = createHttp();
  return http.get(`/${controller}/${id}/description`);
};

const areaTableDataService = {
    getDescriptionById,
};

export default areaTableDataService;
