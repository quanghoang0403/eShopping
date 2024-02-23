using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        public OrderController(IMediator mediator) : base(mediator)
        {
        }
    }
}
