import http from "../../utils/http-common";

const controller = "notificationCampaign";

const getCreatePrepareDataAsync = () => {
  return http.get(`/${controller}/get-create-prepare-data`);
};

const getNotificationCampaignByIdAsync = (id) => {
  return http.get(`/${controller}/get-notification-campaign-by-id/${id}`);
};

const createNotificationCampaignAsync = (data) => {
  return http.post(`/${controller}/create-notification-campaign`, data);
};

const updateNotificationCampaignAsync = (data) => {
  return http.put(`/${controller}/update-notification-campaign`, data);
};

const getAllNotificationCampaignAsync = (pageNumber, pageSize, keySearch, status, startDate, endDate) => {
  return http.get(
    `/${controller}/get-notification-campaign?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}&status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
};

const deleteNotificationCampaignByIdAsync = (id) => {
  return http.delete(`/${controller}/delete-notification-campaign-by-id/${id}`);
};

const stopNotificationCampaignByIdAsync = (id) => {
  return http.post(`/${controller}/stop-notification-campaign-by-id/${id}`);
};

const notificationCampaignDataService = {
  getCreatePrepareDataAsync,
  createNotificationCampaignAsync,
  getNotificationCampaignByIdAsync,
  updateNotificationCampaignAsync,
  getAllNotificationCampaignAsync,
  deleteNotificationCampaignByIdAsync,
  stopNotificationCampaignByIdAsync,
};
export default notificationCampaignDataService;
