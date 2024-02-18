import { queryParamsUrl } from "../utils/helpers";
import { createHttp } from "../utils/http-common";

const controller = "blog";

const getBlogAsync = (params) => {
  const http = createHttp();
  const queryParams = queryParamsUrl(params);
  return http.get(`/${controller}?${queryParams}`);
};

const getBlogByIdAsync = (code) => {
  const http = createHttp();
  return http.get(
    `/${controller}/${code}`,
  );
};

const putCountBlogAsync = (data) => {
  const http = createHttp();
  return http.put(`/${controller}/${data?.storeId}/${data?.blogId}/view`);
};

const getBlogsAllInforAsync = (
  pageNumber,
  pageSize,
  keySearch,
  categoryId,
  creatorId,
  IsCreateTime,
  isTotalView,
) => {
  const http = createHttp();
  return http.get(
    `/${controller}?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&categoryId=${categoryId}&creatorId=${creatorId}&IsCreateTime=${IsCreateTime}&isTotalView=${isTotalView}`,
  );
};

const getBlogCategoryDataAsync = (storeId) => {
  const http = createHttp();
  return http.get(`/blogcategory?storeId=${storeId}&`);
};

const getBlogsDataAsync = (pageNumber, pageSize, storeId, isTotalView) => {
  const http = createHttp();
  return http.get(
    `/${controller}?pageNumber=${pageNumber}&pageSize=${pageSize}&storeId=${storeId}&isTotalView=${isTotalView}`,
  );
};

const blogDataService = {
  getBlogAsync,
  getBlogByIdAsync,
  putCountBlogAsync,
  getBlogsAllInforAsync,
  getBlogCategoryDataAsync,
  getBlogsDataAsync
};

export default blogDataService;
