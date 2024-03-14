using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.Base
{
    [Route("api-store/[controller]")]
    public class BaseApiStoreController : BaseApiController
    {
        public BaseApiStoreController(IMediator mediator) : base(mediator)
        {
        }
    }
}