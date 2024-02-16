using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetZoaTemplateResponse
    {
        public GetZoaTemplateResponse()
        {
        }

        public GetZoaTemplateResponse(string codeResult, string errorMessage, List<ZNSTemplate> znsTemplates)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            ZNSTemplates = znsTemplates;
        }

        public string CodeResult { get; set; }

        public List<ZNSTemplate> ZNSTemplates { get; set; }

        public string ErrorMessage { get; set; }

        public class ZNSTemplate
        {
            public string TempContent { get; set; }
            public int TempId { get; set; }
            public string TempName { get; set; }
            public List<ZNSTempDetail> ZNSTempDetails { get; set; }
        }

        public class ZNSTempDetail
        {
            public int Limit { get; set; }
            public string Param { get; set; }
            public int ParamLevel { get; set; }
            public string RequireType { get; set; }
        }
    }
}