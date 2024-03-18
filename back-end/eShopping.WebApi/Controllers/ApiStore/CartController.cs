using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class CartController : BaseApiStoreController
    {
        public CartController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet("Ping")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }
    }
}
