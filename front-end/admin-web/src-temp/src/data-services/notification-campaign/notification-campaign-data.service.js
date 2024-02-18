import http from "../../utils/http-common";

const controller = "notificationCampaign";

const getNotificationCampaignByIdAsync = (id) => {
  return http.get(`/${controller}/get-notification-campaign-by-id/${id}`);
};

const notificationCampaignDataService = {
  getNotificationCampaignByIdAsync,
};
export default notificationCampaignDataService;
