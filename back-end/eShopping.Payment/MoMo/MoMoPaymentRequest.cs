using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System.Text;

namespace eShopping.Payment.MoMo
{
    public class MomoWrapperResponse<T>
    {
        public bool Success { get; set; }

        public string Message { get; set; }

        public T Data { get; set; } = default(T);

        public int ResultCode { get; set; }
    }

    /// <summary>
    /// Request config provided by momo
    /// </summary>
    public class MoMoPaymentRequest
    {
        public MoMoPaymentRequest() { }

        public static MomoWrapperResponse<string> SendPaymentRequest(string endpoint, string postJsonString)
        {
            var response = new MomoWrapperResponse<string>();
            try
            {
                LogInformation("MOMO_REQUEST", endpoint, postJsonString);

                HttpWebRequest httpWReq = (HttpWebRequest)WebRequest.Create(endpoint);
                var postData = postJsonString;
                var data = Encoding.UTF8.GetBytes(postData);
                httpWReq.ProtocolVersion = HttpVersion.Version11;
                httpWReq.Method = "POST";
                httpWReq.ContentType = "application/json";
                httpWReq.ContentLength = data.Length;
                httpWReq.ReadWriteTimeout = 30000;
                httpWReq.Timeout = 15000;
                Stream stream = httpWReq.GetRequestStream();
                stream.Write(data, 0, data.Length);
                stream.Close();

                HttpWebResponse httpWebResponse = (HttpWebResponse)httpWReq.GetResponse();
                string jsonresponse = string.Empty;
                using (var reader = new StreamReader(httpWebResponse.GetResponseStream()))
                {
                    string temp = null;
                    while ((temp = reader.ReadLine()) != null)
                    {
                        jsonresponse += temp;
                    }
                }

                response.Success = true;
                response.Data = jsonresponse;

                LogInformation("MOMO_RESPONSE", endpoint, jsonresponse);

                return response;
            }
            catch (WebException e)
            {
                using (WebResponse webResponseError = e.Response)
                {
                    var httpWebResponse = (HttpWebResponse)webResponseError;
                    using (var responseStream = httpWebResponse.GetResponseStream())
                    using (var reader = new StreamReader(responseStream))
                    {
                        var resultJson = reader.ReadToEnd();
                        var responseError = JsonConvert.DeserializeObject<MomoWrapperResponse<string>>(resultJson);

                        //Need to writelog for Momo failure.
                        Serilog.Log.Information(endpoint);
                        Serilog.Log.Information(postJsonString);
                        Serilog.Log.Information(responseError.Message);

                        LogInformation("MOMO_RESPONSE_ERROR", endpoint, responseError);

                        return responseError;
                    }
                }
            }
        }

        private static void LogInformation(string type, string endpoint, string postJsonString)
        {
            var logRequest = new JObject
                {
                    { "thirdParty", type },
                    { "endpoint", endpoint },
                    { "requestBody", postJsonString },
                };

            Serilog.Log.Information(JsonConvert.SerializeObject(logRequest));
        }

        private static void LogInformation(string type, string endpoint, object postJsonString)
        {
            var logRequest = new JObject
                {
                    { "thirdParty", type },
                    { "endpoint", endpoint },
                    { "requestBody", JsonConvert.SerializeObject(postJsonString)},
                };

            Serilog.Log.Information(JsonConvert.SerializeObject(logRequest));
        }
    }
}
