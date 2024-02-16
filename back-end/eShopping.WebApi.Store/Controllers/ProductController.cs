using eShopping.WebApi.Store.Controllers.Base;
using MediatR;

using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Store.Controllers
{
    [Authorize]
    public class ProductController : BaseApiController
    {
        public ProductController(IMediator mediator) : base(mediator)
        {
        }
    }
}