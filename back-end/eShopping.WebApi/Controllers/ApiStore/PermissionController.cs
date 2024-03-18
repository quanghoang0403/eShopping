using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class PermissionController : BaseApiStoreController

    {
        public PermissionController(IMediator mediator) : base(mediator)
        {
        }
    }
}
