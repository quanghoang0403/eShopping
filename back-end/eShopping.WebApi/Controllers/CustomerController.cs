using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    public class CustomerController : BaseApiController
    {
        public CustomerController(IMediator mediator) : base(mediator)
        {
        }
    }
}
