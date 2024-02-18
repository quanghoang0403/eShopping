//get-transfer-material-history-detail-by-id
import http from "../../utils/http-common";

const controller = "transferMaterialHistoryDetail";

const getTransferMaterialHistoryDetailById = (
  transferMaterialHistoryId,
  pageNumber,
  pageSize
) => {
  return http.get(
    `/${controller}/get-transfer-material-history-detail-by-id?pageNumber=${pageNumber}&pageSize=${pageSize}&transferMaterialHistoryId=${transferMaterialHistoryId}`
  );
};

const transferMaterialHistoryDetailDataService = {
  getTransferMaterialHistoryDetailById,
};
export default transferMaterialHistoryDetailDataService;
