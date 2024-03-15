using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class CustomerController : BaseApiStoreController
    {
        public CustomerController(IMediator mediator) : base(mediator)
        {
        }
    }
}
