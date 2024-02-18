import actionTypes from "./product.type";

export function setProductListPageData(data) {
  return { type: actionTypes.SET_PRODUCT_LIST_PAGE_DATA, payload: data };
}
