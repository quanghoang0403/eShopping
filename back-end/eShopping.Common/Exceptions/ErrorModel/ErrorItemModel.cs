using Newtonsoft.Json;

namespace eShopping.Common.Exceptions.ErrorModel
{
    public class ErrorItemModel
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }
    }
}
