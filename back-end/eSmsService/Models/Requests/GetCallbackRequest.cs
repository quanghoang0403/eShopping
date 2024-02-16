namespace eSmsService.Models.Requests
{
    public class GetCallbackRequest
    {
        public GetCallbackRequest()
        {

        }
        public GetCallbackRequest(string[] listRefid, string oaId)
        {
            ListRefid = listRefid;
            OAId = oaId;
        }

        public string[] ListRefid { get; set; }
        public string OAId { get; set; }
    }
}