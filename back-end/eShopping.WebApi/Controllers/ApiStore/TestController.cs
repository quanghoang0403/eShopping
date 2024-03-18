using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class TestController : BaseApiStoreController
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
    }
}