using eShopping.WebApi.Store.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Store.Controllers
{
    public class CustomerController : BaseApiController
    {
        public CustomerController(IMediator mediator) : base(mediator)
        {
        }
    }
}