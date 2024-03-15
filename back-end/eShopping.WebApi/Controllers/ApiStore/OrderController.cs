using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class OrderController : BaseApiStoreController
    {
        public OrderController(IMediator mediator) : base(mediator)
        {
        }
    }
}
