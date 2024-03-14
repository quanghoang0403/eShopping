
using eShopping.Application.Features.Addresses.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers
{
    public class AddressController : BaseApiController
    {
        public AddressController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-all-cities")]
        public async Task<IActionResult> GetAllCitiesAsync([FromQuery] GetAllCitiesRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-districts-by-city-id")]
        public async Task<IActionResult> GetDistrictsByCityIdAsync([FromQuery] GetDistrictsByCityIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-wards-by-district-id")]
        public async Task<IActionResult> GetWardsByDistrictIdAsync([FromQuery] GetWardsByDistrictIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
