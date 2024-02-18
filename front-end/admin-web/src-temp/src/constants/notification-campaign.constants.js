export const NotificationCampaignStatus = {
  Scheduled: 0,
  Active: 1,
  Finished: 2,
};

export const EnumResultCreateOrUpdate = {
  /// <summary>
  /// Notification Create Or Update Success
  /// </summary>
  Success: 0,

  /// <summary>
  /// Notification Create Or Update Fail
  /// </summary>
  Fail: 1,

  /// <summary>
  /// Notification Not Firebase Credential
  /// </summary>
  NotFirebaseCredential: 2,
};

export const NotificationCampaignSendingType = {
  SendByEvent: 0,
  SendBySpecificTime: 1,
  SendNow: 2,
};

export const NotificationCampaignSendByEvent = {
  InstallTheAppEvent: 0,
};

export const ListNotificationCampaignSendingType = [
  {
    key: 0,
    name: "notificationCampaignDetail.generalInformation.sendByEvent",
  },
  {
    key: 1,
    name: "notificationCampaignDetail.generalInformation.sendBySpecificTime",
  },
  {
    key: 2,
    name: "notificationCampaignDetail.generalInformation.sendNow",
  },
];

export const ListNotificationCampaignSendByEvent = [
  {
    key: 0,
    name: "notificationCampaignDetail.generalInformation.installTheApp",
  },
];

export const NotificationCampaignEvent = {
  InstallTheAppEvent: 0,
};
