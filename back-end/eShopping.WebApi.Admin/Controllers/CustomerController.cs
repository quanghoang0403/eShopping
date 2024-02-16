using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Admin.Controllers
{
    [Authorize]
    public class CustomerController : BaseApiController
    {
        public CustomerController(IMediator mediator) : base(mediator)
        {
        }
    }
}
