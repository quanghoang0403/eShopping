using eShopping.WebApi.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Controllers
{
    public class CartController : BaseApiController
    {
        public CartController(IMediator mediator) : base(mediator)
        {
        }
    }
}
