import { createHttp } from "../utils/http-common";

const controller = "blogcategory";

const getBlogCategoryAsync = (data) => {
  const http = createHttp();
  return http.get(`/${controller}?storeId=${data?.storeId}`);
};

const blogCategoryDataService = {
  getBlogCategoryAsync,
};

export default blogCategoryDataService;
