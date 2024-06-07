﻿using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eShopping.Notify.Line
{
    public static class NotifyLine
    {
        public static void SendNotifyLine(string method, string exception, string message = "", string token = "")
        {
            try
            {
                // Construct the message post
                var messagePost = (string.IsNullOrEmpty(method) ? "" : "`Method:` *" + method + "*\n") +
                                  (string.IsNullOrEmpty(exception) ? "" : "`Exception:` *" + exception + "*\n") +
                                  (string.IsNullOrEmpty(message) ? "" : "`Message:` *" + message + "*\n");

                var options = new RestClientOptions("https://notify-api.line.me/api")
                {
                    ThrowOnAnyError = true,
                    Timeout = TimeSpan.FromSeconds(1),
                };
                var client = new RestClient(options);
                var request = new RestRequest("notify", Method.Post);

                if (string.IsNullOrEmpty(token))
                {
                    token = "59fBWdsJpp4evTUUho5sgiGlepSlO8eldfFlMuU9rAY";
                }
                request.AddHeader("Authorization", "Bearer " + token);
                request.AddParameter("message", messagePost);

                // Execute the request
                RestResponse response = client.Execute(request);
            }
            catch (Exception ex)
            {

            }
        }
    }

}
