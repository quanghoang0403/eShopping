using RestSharp;

namespace eShopping.Notify.Line
{
    public static class NotifyLine
    {
        public static void SendNotifyLine(string requestUrl, string method, string exception, string message = "", string token = "")
        {
            try
            {
                // Construct the message post
                var messagePost = (string.IsNullOrEmpty(requestUrl) ? "" : "`Request:` *" + requestUrl + "*\n") +
                                  (string.IsNullOrEmpty(method) ? "" : "`Method:` *" + method + "*\n") +
                                  (string.IsNullOrEmpty(exception) ? "" : "`Exception:` *" + exception + "*\n") +
                                  (string.IsNullOrEmpty(message) ? "" : "`Message:` *" + message + "*\n");

                var options = new RestClientOptions("https://notify-api.line.me/api")
                {
                    ThrowOnAnyError = true,
                };
                var client = new RestClient(options);
                var request = new RestRequest("notify", Method.Post);

                if (string.IsNullOrEmpty(token))
                {
                    token = "4TekRT5BAriwS2VE63cnNzFaAgtwFFoFKUx7E3QNkKP";
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
