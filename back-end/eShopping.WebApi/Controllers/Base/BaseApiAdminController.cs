using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.Base
{
    [Route("[controller]")]
    [ApiExplorerSettings(GroupName = "api-admin")]
    public class BaseApiAdminController : BaseApiController
    {
        public BaseApiAdminController(IMediator mediator) : base(mediator)
        {
        }
    }
}