using eShopping.WebApi.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class CartController : BaseApiStoreController
    {
        public CartController(IMediator mediator) : base(mediator)
        {
        }
    }
}
