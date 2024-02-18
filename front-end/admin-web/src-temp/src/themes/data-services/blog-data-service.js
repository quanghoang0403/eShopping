import { createHttp } from "../utils/http-common";

const controller = "blog";

const getBlogsDataAsync = (pageNumber, pageSize, storeId, isCreateTime) => {
  const http = createHttp();
  return http.get(
    `/${controller}?pageNumber=${pageNumber}&pageSize=${pageSize}&storeId=${storeId}&isCreateTime=${isCreateTime}`,
  );
};
const getBlogByIdAsync = (storeId, blogId) => {
  const http = createHttp();
  return http.get(`/${controller}/${storeId}/${blogId}`);
};

const getBlogsAllInforAsync = (pageNumber, pageSize, keySearch, categoryId, creatorId, storeId, isTotalView) => {
  const http = createHttp();
  return http.get(
    `/${controller}?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&categoryId=${categoryId}&creatorId=${creatorId}&storeId=${storeId}&isTotalView=${isTotalView}`
  );
};

const getBlogCategoryDataAsync = (storeId) => {
  const http = createHttp();
  return http.get(`/blogcategory?storeId=${storeId}&`);
};

const blogsDataService = {
  getBlogsDataAsync,
  getBlogByIdAsync,
  getBlogCategoryDataAsync,
  getBlogsAllInforAsync
};

export default blogsDataService;
