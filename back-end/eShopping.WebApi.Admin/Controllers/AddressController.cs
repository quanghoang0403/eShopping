
using eShopping.Application.Common.Features.Addresses.Queries;
using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Admin.Controllers
{
    public class AddressController : BaseApiController
    {
        public AddressController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-cities-by-countryid")]
        public async Task<IActionResult> GetCitiesByCountryIdAsync([FromQuery] GetCitiesByCountryIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-districts-by-cityid")]
        public async Task<IActionResult> GetDistrictsByCityIdAsync([FromQuery] GetDistrictsByCityIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-wards-by-districtid")]
        public async Task<IActionResult> GetWardsByDistrictIdAsync([FromQuery] GetWardsByDistrictIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
