import http, { downloadAsync } from "../../utils/http-common";

const controller = "report";

const getTopCustomerReportAsync = (data) => {
  return http.get(
    `/${controller}/get-top-customer-report?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&keySearch=${data.keySearch}&sortNo=${data.sortNo}&sortCustomerName=${data.sortCustomerName}&sortOrderNumber=${data.sortOrderNumber}&sortTotalAmount=${data.sortTotalAmount}`,
  );
};

const getTopSellingProductAsync = (data) => {
  return http.get(
    `/${controller}/get-top-selling-product?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${
      data.endDate
    }&pageNumber=${data.pageNumber ?? ""}&pageSize=${data.pageSize ?? ""}&type=${data.type ?? ""}`,
  );
};

const getOrderDetailTransactionReportAsync = (data) => {
  if (data.customerID)
    return http.get(
      `/${controller}/get-order-detail-transaction-report?orderId=${data.orderID}&customerID=${data.customerID}&type=${
        data.type ?? ""
      }`,
    );
  return http.get(`/${controller}/get-order-detail-transaction-report?orderId=${data.orderID}&type=${data.type ?? ""}`);
};

const exportSoldProductsAsync = (data) => {
  return downloadAsync(
    `/${controller}/export-sold-products?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&languageCode=${data.languageCode}&timeZone=${data.timeZone}`,
  );
};

const exportRevenueAsync = (req) => {
  let url = `/${controller}/export-revenue?languageCode=${req.languageCode}`;
    url += `&branchId=${req.branchId}`;
    url += `&startDate=${req.startDate}`;
    url += `&endDate=${req.endDate}`;
    url += `&BusinessSummaryWidgetFilter=${req.typeOptionDate}`;
    url += `&type=${req.type}`;
    url += `&segmentTimeOption=${req.segmentTimeOption}`;
    url += `&timeZone=${req.timeZone}`;

  return downloadAsync(url);
};

const reportDataService = {
  getTopCustomerReportAsync,
  getTopSellingProductAsync,
  getOrderDetailTransactionReportAsync,
  exportSoldProductsAsync,
  exportRevenueAsync,
};
export default reportDataService;
