using eShopping.Models.Admin.NotificationCampaign;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GoogleServices.FirebaseCloudMessage
{
    public interface IFirebaseCloudMessageService
    {
        Task<List<string>> SendPushNotificationCampaignAsync(PushNotificationModel prepareDataPush);


    }
}