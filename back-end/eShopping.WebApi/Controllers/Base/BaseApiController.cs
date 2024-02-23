using eShopping.Common.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.Base
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class BaseApiController : ControllerBase
    {
        protected readonly IMediator _mediator;

        public BaseApiController(IMediator mediator)
        {
            _mediator = mediator;
        }

        protected ActionResult OkOrNoContent(object value)
        {
            if (value == null)
            {
                return NoContent();
            }

            return Ok(value);
        }

        protected ActionResult SafeOk<T>(List<T> list)
        {
            if (list == null)
            {
                return Ok(new List<T>());
            }

            return Ok(list);
        }

        protected ActionResult SafeOk<T>(IList<T> list)
        {
            if (list == null)
            {
                return Ok(new List<T>());
            }

            return Ok(list);
        }

        protected ActionResult SafeOk(object value)
        {
            if (value == null)
            {
                throw new NotFoundException();
            }

            return Ok(value);
        }

        protected ActionResult SafeOk() => new OkResult();

        protected async Task<ActionResult> OkOrNoContentAsync(object value)
        {
            if (value == null)
            {
                return NoContent();
            }

            return Ok(value);
        }

        protected async Task<ActionResult> SafeOkAsync<T>(List<T> list)
        {
            if (list == null)
            {
                return Ok(new List<T>());
            }

            return Ok(list);
        }

        protected async Task<ActionResult> SafeOkAsync<T>(IList<T> list)
        {
            if (list == null)
            {
                return Ok(new List<T>());
            }

            return Ok(list);
        }

        protected async Task<ActionResult> SafeOkAsync(object value)
        {
            if (value == null)
            {
                throw new NotFoundException();
            }

            return Ok(value);
        }

        protected async Task<ActionResult> SafeOkAsync()
        {
            return new OkResult();
        }
    }
}
