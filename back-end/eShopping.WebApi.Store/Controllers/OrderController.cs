using eShopping.WebApi.Store.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Store.Controllers
{
    public class OrderController : BaseApiController
    {
        public OrderController(IMediator mediator) : base(mediator)
        {
        }
    }
}