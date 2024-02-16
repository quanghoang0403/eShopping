using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetBrandnameTemplatesResponse
    {
        public GetBrandnameTemplatesResponse()
        {
        }

        public GetBrandnameTemplatesResponse(string codeResult, string errorMessage, List<BrandnameTemplate> brandnameTemplates)
        {
            CodeResult = codeResult;
            ErrorMessage = errorMessage;
            BrandnameTemplates = brandnameTemplates;
        }

        public string CodeResult { get; set; }

        public List<BrandnameTemplate> BrandnameTemplates { get; set; }

        public string ErrorMessage { get; set; }

        public class BrandnameTemplate
        {
            public int NetworkID { get; set; }
            public string TempContent { get; set; }
            public int TempId { get; set; }
        }
    }
}