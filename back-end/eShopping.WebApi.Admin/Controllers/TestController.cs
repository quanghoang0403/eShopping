using eShopping.Application.Features.Staffs.Commands;
using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Admin.Controllers
{
    public class TestController : BaseApiController
    {
        public TestController(IMediator mediator) : base(mediator)
        {

        }

        [HttpGet("Ping")]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }

        [HttpPost("Ping")]
        public IActionResult Ping([FromBody] string payload)
        {
            return Ok("Pong");
        }

        [HttpPost]
        [Route("create-admin")]
        public async Task<IActionResult> CreateStaffAsync([FromBody] CreateAdminStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}