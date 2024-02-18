import http from "../../utils/http-common";

const controller = "barcode";

const getBarcodeConfigByStoreIdAsync = () => {
  return http.get(`/${controller}/get-barcode-config-by-store-id`);
};

const updateBarcodeConfigByStoreIdAsync = (data) => {
  return http.put(`/${controller}/update-barcode-config`, data);
};

const getBarcodeStampsByStoreIdAsync = (barcodeType) => {
  return http.get(`/${controller}/get-barcode-stamps-by-store-id?barcodeType=${barcodeType ?? ""}`);
};

const barcodeDataService = {
  getBarcodeConfigByStoreIdAsync,
  updateBarcodeConfigByStoreIdAsync,
  getBarcodeStampsByStoreIdAsync,
};
export default barcodeDataService;
