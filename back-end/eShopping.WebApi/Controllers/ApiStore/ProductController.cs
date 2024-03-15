using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class ProductController : BaseApiStoreController
    {
        public ProductController(IMediator mediator) : base(mediator)
        {
        }
    }
}