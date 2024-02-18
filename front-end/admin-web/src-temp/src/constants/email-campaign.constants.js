import { emailCampaignDefaultTemplate } from "email-campaign-templates/email-campaign-default.template";

export const EmailCampaignStatus = {
  Scheduled: 1,
  Active: 2,
  Finished: 3,
};

export const EmailCampaignSendingStatus = {
  Failed: 0,
  SuccessfullySent: 1,
  ResentSuccessfully: 2,
};

export const EmailCampaignType = {
  SendToEmailAddress: 0,
  SendToCustomerGroup: 1,
};

export const EmailCampaignSocial = {
  Facebook: 1,
  Instagram: 2,
  Tiktok: 3,
  Twiter: 4,
  Youtube: 5,
};

export const sessions = [
  emailCampaignDefaultTemplate.border.title,
  emailCampaignDefaultTemplate.border.logo,
  emailCampaignDefaultTemplate.border.mainProduct,
  emailCampaignDefaultTemplate.border.firstSubProduct,
  emailCampaignDefaultTemplate.border.secondSubProduct,
  emailCampaignDefaultTemplate.border.footer,
];

export const LimitNumberOfEmailCampaign = {
  EmailCampaignLimitSend: 200
}
