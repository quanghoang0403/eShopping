using eShopping.Hangfire.Shared.Models;

using Microsoft.AspNetCore.Mvc;

namespace eShopping.Hangfire.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        [NonAction]
        public IActionResult HangfireResponse(bool success, string jobId = null, string errorMessages = null)
        {
            return Ok(new JobApiResponse(success, jobId, errorMessages));
        }
    }
}