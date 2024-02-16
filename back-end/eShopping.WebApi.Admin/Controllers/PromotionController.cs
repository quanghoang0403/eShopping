using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Admin.Controllers
{
    [Authorize]
    public class PromotionController : BaseApiController
    {
        public PromotionController(IMediator mediator) : base(mediator)
        {
        }
    }
}
