using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class PromotionController : BaseApiStoreController
    {
        public PromotionController(IMediator mediator) : base(mediator)
        {
        }
    }
}
