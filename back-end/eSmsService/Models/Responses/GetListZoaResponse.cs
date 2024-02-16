using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetListZoaResponse
    {
        public GetListZoaResponse()
        {
        }

        public GetListZoaResponse(string codeResult, string errorMessage, List<Zoa> zoaList)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            ZOAList = zoaList;
        }

        public string CodeResult { get; set; }
        public string ErrorMessage { get; set; }
        public List<Zoa> ZOAList { get; set; }

        public class Zoa
        {
            public string OAID { get; set; }

            public string OAName { get; set; }
        }
    }
}