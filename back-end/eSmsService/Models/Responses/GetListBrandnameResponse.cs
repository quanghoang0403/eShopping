using System.Collections.Generic;

namespace eSmsService.Models.Responses
{
    public class GetListBrandnameResponse
    {
        public GetListBrandnameResponse()
        {
        }

        public GetListBrandnameResponse(string codeResponse, List<BrandName> listBrandName)
        {
            CodeResponse = codeResponse;
            ListBrandName = listBrandName;
        }

        public string CodeResponse { get; set; }

        public List<BrandName> ListBrandName { get; set; }

        public class BrandName
        {
            public string Brandname { get; set; }

            public int Type { get; set; }
        }
    }
}