import http from "../../utils/http-common";

const controller = "emailCampaign";

const getAllEmailCampaignAsync = (pageNumber, pageSize, keySearch) => {
  return http.get(
    `/${controller}/get-all-email-campaign?pageNumber=${pageNumber}&pageSize=${pageSize}&keySearch=${keySearch}`
  );
};

const getEmailCampaignByIdAsync = (id) => {
  return http.get(`/${controller}/get-email-campaign-by-id/${id}`);
};

const getEmailCampaignSendingDetailAsync = (pageNumber, pageSize, emailCampaignId) => {
  return http.get(
    `/${controller}/get-email-campaign-sending-detail?pageNumber=${pageNumber}&pageSize=${pageSize}&emailCampaignId=${emailCampaignId}`
  );
};

const createEmailCampaignAsync = (data) => {
  return http.post(`/${controller}/create-email-campaign`, data);
};

const updateEmailCampaignAsync = (data) => {
  return http.put(`/${controller}/update-email-campaign`, data);
};

const emailCampaignDataService = {
  getAllEmailCampaignAsync,
  getEmailCampaignByIdAsync,
  getEmailCampaignSendingDetailAsync,
  createEmailCampaignAsync,
  updateEmailCampaignAsync,
};
export default emailCampaignDataService;
