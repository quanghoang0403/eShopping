using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    public class PromotionController : BaseApiController
    {
        public PromotionController(IMediator mediator) : base(mediator)
        {
        }
    }
}
