﻿using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace eShopping.WebApi.Controllers.ApiAdmin
{
    public class TestController : BaseApiAdminController
    {
        public TestController(IMediator mediator) : base(mediator)
        {

        }

        [HttpGet("Ping")]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }

        [HttpPost("Ping")]
        public IActionResult Ping([FromBody] string payload)
        {
            return Ok("Pong");
        }
    }
}