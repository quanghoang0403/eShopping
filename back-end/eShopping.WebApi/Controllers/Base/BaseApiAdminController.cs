using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.Base
{
    [Route("api-admin/[controller]")]
    public class BaseApiAdminController : BaseApiController
    {
        public BaseApiAdminController(IMediator mediator) : base(mediator)
        {
        }
    }
}