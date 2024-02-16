using eShopping.WebApi.Admin.Controllers.Base;

using MediatR;

using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Admin.Controllers
{
    [Authorize]
    public class ProductController : BaseApiController
    {
        public ProductController(IMediator mediator) : base(mediator)
        {
        }
    }
}