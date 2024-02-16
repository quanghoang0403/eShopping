using FirebaseAdmin;
using FirebaseAdmin.Messaging;

using eShopping.Common.Constants;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Admin.NotificationCampaign;

using Google.Apis.Auth.OAuth2;

using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GoogleServices.FirebaseCloudMessage
{
    public class FirebaseCloudMessageService : IFirebaseCloudMessageService
    {
        private readonly IUnitOfWork _unitOfWork;

        public FirebaseCloudMessageService(IUnitOfWork unitOfWork)
        { _unitOfWork = unitOfWork; }

        public async Task<List<string>> SendPushNotificationCampaignAsync(PushNotificationModel prepareDataPush)
        {
            // Install-Package Google.Cloud.Firestore -Version 2.2.0
            // Install - Package FirebaseAdmin

            var errorsToken = new List<string>();
            // initialization an instance of FirebaseApp
            //TODO: Check null object prepareDataPush
            if (prepareDataPush == null ||
                (prepareDataPush.ListDevices.Any() == false
                || prepareDataPush.notificationCampaign == null
                || string.IsNullOrWhiteSpace(prepareDataPush.DomainName)
                || string.IsNullOrWhiteSpace(prepareDataPush?.FirebaseCredential))
                || string.IsNullOrWhiteSpace(prepareDataPush?.AppName))
                return errorsToken;

            if (!string.IsNullOrWhiteSpace(prepareDataPush?.FirebaseCredential))
            {
                //
                FirebaseApp nameInstance = FirebaseApp.GetInstance(prepareDataPush.AppName);
                if (nameInstance == null)
                {
                    FirebaseApp.Create(new AppOptions()
                    {
                        Credential = GoogleCredential.FromJson(prepareDataPush.FirebaseCredential),
                    }, prepareDataPush.AppName);
                    nameInstance = FirebaseApp.GetInstance(prepareDataPush.AppName);
                }

                var batchSize = DefaultConstants.DEFAULT_MAX_PUSH_NOTIFICATION_FCM;
                int numberOfBatches = (int)Math.Ceiling((double)prepareDataPush?.ListDevices.Count / batchSize);
                for (int i = 0; i < numberOfBatches; i++)
                {
                    //Get batch size of list device from i 
                    var currentTokens = prepareDataPush.ListDevices.Skip(i * batchSize).Take(batchSize);

                    var androidDeviceTokens = currentTokens.Where(x => x.PlatformOS == EnumPlatformsOSExtensions.GetName(EnumPlatformsOS.ANDROID)).Select(x => x.DeviceToken);
                    var iosDeviceTokens = currentTokens.Where(x => x.PlatformOS == EnumPlatformsOSExtensions.GetName(EnumPlatformsOS.IOS)).Select(x => x.DeviceToken);

                    var sendNotification = new SendNotificationModel()
                    {
                        DomainName = prepareDataPush?.DomainName,
                        notificationCampaignDetail = prepareDataPush?.notificationCampaign,
                    };

                    //Send notification to devide OS Android
                    if (androidDeviceTokens.Any())
                    {
                        sendNotification.Devices = androidDeviceTokens;
                        sendNotification.IsIOS = false;

                        var listTask = await PushNotificationToDeviceAsync(sendNotification, nameInstance);
                        errorsToken.AddRange(listTask);
                    }

                    //Send notification to devide OS IOS
                    if (iosDeviceTokens.Any())
                    {
                        sendNotification.Devices = iosDeviceTokens;
                        sendNotification.IsIOS = true;

                        var listTask = await PushNotificationToDeviceAsync(sendNotification, nameInstance);
                        errorsToken.AddRange(listTask);
                    }
                }
            }

            return errorsToken;
        }

        private static string HandleHyperlinkValue(int? hyperlinkType, string hyperlinkValue)
        {
            switch (hyperlinkType)
            {
                case (int)EnumNotificationHyperlink.Products:
                    return "/product-list";

                case (int)EnumNotificationHyperlink.Contact:
                    return "/contact";

                case (int)EnumNotificationHyperlink.AboutUs:
                    return "/about-us";

                case (int)EnumNotificationHyperlink.Blogs:
                    return "/blog";

                case (int)EnumNotificationHyperlink.Url:
                    return hyperlinkValue;

                case (int)EnumNotificationHyperlink.Category:
                    return "/product-list/" + hyperlinkValue;

                case (int)EnumNotificationHyperlink.ProductDetail:
                    return "/product-detail/" + hyperlinkValue;

                case (int)EnumNotificationHyperlink.MyPages:
                    return "/page/" + hyperlinkValue;

                case (int)EnumNotificationHyperlink.BlogDetail:
                    return "/blog/" + hyperlinkValue;

                case (int)EnumNotificationHyperlink.MyNotification:
                    return "/my-notification";

                default:
                    return "/home";
            }
        }

        private async Task<List<string>> PushNotificationToDeviceAsync(SendNotificationModel sendNotification, FirebaseApp nameInstance)
        {
            var message = new MulticastMessage();
            var failedTokens = new List<string>();
            message.Tokens = sendNotification.Devices.ToList();
            message.Notification = new Notification();
            var notificationCampaign = sendNotification?.notificationCampaignDetail;

            ////Prevent show notification from system when config IsSendPushNotification for Android
            //if (notificationCampaign.IsSendPushNotification.HasValue && notificationCampaign.IsSendPushNotification.Value || sendNotification.IsIOS)
            //{
            message.Notification.Title = notificationCampaign?.Title;
            message.Notification.Body = notificationCampaign?.Content;
            if (!string.IsNullOrWhiteSpace(notificationCampaign?.Thumbnail))
            {
                message.Notification.ImageUrl = notificationCampaign?.Thumbnail;
            }
            //}

            message.Data = new Dictionary<string, string>() {
                    {"id", notificationCampaign?.Id.ToString()},
                    { "name", notificationCampaign?.Name},
                    { "title", notificationCampaign?.Title},
                    { "description", notificationCampaign?.Content},
                    { "image", notificationCampaign?.Thumbnail ?? string.Empty},
                    { "sendingTypeName", EnumSendingTypeExtensions.GetName(notificationCampaign.SendingTypeId) },
                    { "sendingTypeId", notificationCampaign.SendingTypeId.ToString() },
                    { "url", $"https://{sendNotification?.DomainName + HandleHyperlinkValue(notificationCampaign.HyperlinkOption, notificationCampaign.Url)}" },
            };
            message.Android = new AndroidConfig()
            {
                Priority = Priority.High,
            };
            message.Webpush = new WebpushConfig()
            {
                Headers = new Dictionary<string, string>
                    {
                        {"urgency", "high"},
                    }
            };

            //Prevent show notification from system when config IsSendPushNotification for IOS
            //if (sendNotification.IsIOS)
            //{
            //    if (!notificationCampaign.IsSendPushNotification.HasValue || !notificationCampaign.IsSendPushNotification.Value)
            //    {
            //        message.Apns = new ApnsConfig()
            //        {
            //            Headers = new Dictionary<string, string>
            //            {
            //                {"apns-push-type", "background"},
            //                {"apns-priority", "10"},
            //            },
            //            Aps = new Aps
            //            {
            //                ContentAvailable = true
            //            }
            //        };
            //    }
            //    else
            //    {
            message.Apns = new ApnsConfig()
            {
                Headers = new Dictionary<string, string>
                        {
                            {"apns-priority", "5"},
                        },
                Aps = new Aps
                {
                    ContentAvailable = true
                }

            };
            //    }
            //}

            // Send the message to registration_ids
            var response = await FirebaseMessaging.GetMessaging(nameInstance).SendMulticastAsync(message);
            if (response.FailureCount > 0)
            {
                var deviceTokens = sendNotification.Devices.ToList();
                for (var i = 0; i < response.Responses.Count; i++)
                {
                    if (response.Responses[i].IsSuccess == false)
                    {
                        // The order of responses corresponds to the order of the registration tokens.
                        failedTokens.Add(deviceTokens[i]);
                    }
                }
                Serilog.Log.Information($"List of tokens of Notificaton {notificationCampaign.Id} : {JsonConvert.SerializeObject(failedTokens)}");
            }

            return failedTokens;
        }
    }
}