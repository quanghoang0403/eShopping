using eShopping.WebApi.Store.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Store.Controllers
{
    [Authorize]
    public class PermissionController : BaseApiController
    {
        public PermissionController(IMediator mediator) : base(mediator)
        {
        }

    }
}
