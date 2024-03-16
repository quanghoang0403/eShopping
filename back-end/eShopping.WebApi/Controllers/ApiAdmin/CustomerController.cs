﻿using eShopping.Application.Features.Customers.Commands;
using eShopping.Application.Features.Customers.Queries;
using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiAdmin
{
    [Authorize]
    public class CustomerController : BaseApiAdminController
    {
        public CustomerController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-customers")]
        [HasPermission(EnumPermission.VIEW_CUSTOMER)]
        public async Task<IActionResult> GetCustomersAsync([FromQuery] AdminGetCustomersRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-customer-by-id")]
        [HasPermission(EnumPermission.VIEW_CUSTOMER)]
        public async Task<IActionResult> GetCustomerByIdAsync([FromQuery] AdminGetCustomerByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPost]
        [Route("create-customer")]
        [HasPermission(EnumPermission.CREATE_CUSTOMER)]
        public async Task<IActionResult> CreateCustomerAsync([FromBody] AdminCreateCustomerRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("update-customer")]
        [HasPermission(EnumPermission.EDIT_CUSTOMER)]
        public async Task<IActionResult> UpdateCustomerAsync([FromBody] AdminUpdateCustomerRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpDelete]
        [Route("delete-customer-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_CUSTOMER)]
        public async Task<IActionResult> DeleteCustomerByIdAsync([FromRoute] AdminDeleteCustomerByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}