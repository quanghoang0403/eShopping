using eShopping.WebApi.Admin.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Admin.Controllers
{
    [Authorize]
    [Route("/api/Account")]
    public class AccountController : BaseApiController
    {
        public AccountController(IMediator mediator) : base(mediator)
        {
        }
    }
}
