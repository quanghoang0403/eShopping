using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Admin.Controllers
{
    public class CartController : BaseApiController
    {
        public CartController(IMediator mediator) : base(mediator)
        {
        }
    }
}
