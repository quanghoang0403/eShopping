using eShopping.WebApi.Store.Controllers.Base;
using MediatR;

namespace eShopping.WebApi.Store.Controllers
{
    public class LoginController : BaseApiController
    {
        public LoginController(IMediator mediator) : base(mediator)
        {
        }
    }
}