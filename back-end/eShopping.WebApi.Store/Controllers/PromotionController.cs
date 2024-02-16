using eShopping.WebApi.Store.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Store.Controllers
{
    [Authorize]
    public class PromotionController : BaseApiController
    {
        public PromotionController(IMediator mediator) : base(mediator)
        {
        }
    }
}
