import { createHttp } from "../utils/http-common";

const controller = "product";

const getProductByIdAsync = (productId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-product-by-id?productId=${productId}`);
};

const getProductsByCategoryIdAsync = (categoryId, keySearch) => {
  const http = createHttp();
  return http.get(`/${controller}/get-products-by-category-id?categoryId=${categoryId}&keySearch=${keySearch}`);
};

const getProductsByCategoryIdsAsync = (categoryIds, keySearch, isCheckAllCategory, platformId, branchId = "") => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-products-by-category-ids?categoryIds=${categoryIds}&keySearch=${keySearch}&isCheckAllCategory=${isCheckAllCategory}&branchId=${branchId}&platformId=${platformId}`,
  );
};

const getAllProductsActiveAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-products-active`);
};

const getAllProductByStoreThemeIdAsync = (values) => {
  const http = createHttp();
  return http.post(`/${controller}/get-all-product-by-store-theme-id`, values);
};

const getAllProductCategoriesAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-all-product-categories`);
};

const getProductCategoriesStoreTheme = (branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-product-category-store-theme?branchId=${branchId}`);
};

const getProductsStoreTheme = (categoryId = "", branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-products-store-theme?categoryId=${categoryId}&branchId=${branchId}`);
};

const getProductsStoreScrollSpy = (categoryId = "", branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-products-store-scroll-spy?categoryId=${categoryId}&branchId=${branchId}`);
};
const getCombosStoreScrollSpy = (storeId = "", branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-combos-store-scroll-spy?storeId=${storeId}&branchId=${branchId}`);
};
const getCombosStoreTheme = (branchId = "") => {
  const http = createHttp();
  return http.get(`/${controller}/get-combos-store-theme?branchId=${branchId}`);
};

const getTheFirstProductAsync = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-the-first-product`);
};

const getProductDetailByIdAsync = (productId, platformId, branchId = "") => {
  const http = createHttp();
  return http.get(
    `/${controller}/get-product-detail-by-id-store-theme?productId=${productId}&branchId=${branchId}&platformId=${platformId}`,
  );
};
const getToppingsByProductIdAsync = (productId) => {
  const http = createHttp();
  return http.get(`/${controller}/get-toppings-by-product-id-store-theme/${productId}`);
};

const calculatingPriceOfTheProduct = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/calculate-price-of-product`, data);
};

const getProductCategoriesActivated = () => {
  const http = createHttp();
  return http.get(`/${controller}/get-all-product-categories`);
};

const getProductCartItemAsync = (data) => {
  const http = createHttp();
  return http.post(`/${controller}/calculate-product-cart-item`, data);
};

const checkProductInBranchAsync = (productId, branchId) => {
  const http = createHttp();
  return http.get(`/${controller}/check-product-in-branch?productId=${productId}&branchId=${branchId ?? null}`);
};

const verifyProductStoreThemeAsync = (
  productId,
  platformId,
  branchId = "",
  promotionId = "",
  promotionType = 0,
  productPriceId = "",
  isApplyFlashSale = true,
) => {
  const http = createHttp();
  return http.get(
    `/${controller}/verify-product-store-theme?id=${productId}&branchId=${branchId}&promotionId=${promotionId}&promotionType=${promotionType}&productPriceId=${productPriceId}&isApplyFlashSale=${isApplyFlashSale}&platformId=${platformId}`,
  );
};

const getProductsAsync = (data) => {
  const http = createHttp();
  const { categoryId = "", branchId = "", platformId = "", pageNumber = 0, pageSize = 0 } = data;
  return http.get(
    `/${controller}?categoryId=${categoryId}&branchId=${branchId}&platformId=${platformId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
  );
};

const productDataService = {
  getProductByIdAsync,
  getProductsByCategoryIdAsync,
  getProductsByCategoryIdsAsync,
  getAllProductsActiveAsync,
  getAllProductByStoreThemeIdAsync,
  getAllProductCategoriesAsync,
  getProductCategoriesStoreTheme,
  getProductsStoreTheme,
  getCombosStoreTheme,
  getTheFirstProductAsync,
  getProductDetailByIdAsync,
  getToppingsByProductIdAsync,
  calculatingPriceOfTheProduct,
  getProductCategoriesActivated,
  getProductCartItemAsync,
  checkProductInBranchAsync,
  getProductsStoreScrollSpy,
  getCombosStoreScrollSpy,
  verifyProductStoreThemeAsync,
  getProductsAsync,
};
export default productDataService;
