using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.Base
{
    [ApiController]
    [Produces("application/json")]
    public class BaseApiController : ControllerBase
    {
        protected readonly IMediator _mediator;

        public BaseApiController(IMediator mediator)
        {
            _mediator = mediator;
        }
    }
}
