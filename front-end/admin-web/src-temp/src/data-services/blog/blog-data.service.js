import http from "../../utils/http-common";

const controller = "blog";

const getBlogManagementsAsync = (pageNumber, pageSize, keySearch, categoryId, creatorId) => {
  var query = `pageNumber=${pageNumber}&pageSize=${pageSize}`;
  if (keySearch && keySearch !== "") query += `&keySearch=${keySearch}`;
  if (categoryId && categoryId !== "") query += `&categoryId=${categoryId}`;
  if (creatorId && creatorId !== "") query += `&creatorId=${creatorId}`;

  return http.get(`/${controller}/get-blogs?${query}`);
};
const getBlogFilterAsync = () => {
  return http.get(`/${controller}/get-blog-filter`);
};

const deleteBlogByIdAsync = (data) => {
  return http.delete(`/${controller}/delete-blog-by-id/${data}`);
};

const getBlogCategoryAsync = () => {
  return http.get(`/${controller}/get-blog-category`);
};

const createBlogCategoryAsync = (data) => {
  return http.post(`/${controller}/create-blog-category`, data);
};

const createBlogAsync = (data) => {
  return http.post(`/${controller}/create-blog`, data);
};

const editBlogAsync = (data) => {
  return http.put(`/${controller}/update-blog`, data);
};

const getBlogTagAsync = () => {
  return http.get(`/${controller}/get-blog-tag`);
};

const getBlogByIdAsync = (data) => {
  return http.get(`/${controller}/get-blog-by-id/${data}`);
};

const blogDataService = {
  getBlogManagementsAsync,
  getBlogFilterAsync,
  deleteBlogByIdAsync,
  getBlogCategoryAsync,
  createBlogCategoryAsync,
  createBlogAsync,
  getBlogTagAsync,
  getBlogByIdAsync,
  editBlogAsync,
};
export default blogDataService;
