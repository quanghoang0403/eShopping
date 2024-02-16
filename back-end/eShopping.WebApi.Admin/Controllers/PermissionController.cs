using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Admin.Controllers
{
    [Authorize]
    public class PermissionController : BaseApiController
    {
        public PermissionController(IMediator mediator) : base(mediator)
        {
        }
    }
}
