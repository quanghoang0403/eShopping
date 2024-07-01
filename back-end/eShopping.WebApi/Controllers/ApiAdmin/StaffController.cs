using eShopping.Application.Features.Staffs.Commands;
using eShopping.Application.Features.Staffs.Queries;
using eShopping.Application.Features.Users.Commands;
using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiAdmin
{
    [Authorize]
    public class StaffController : BaseApiAdminController
    {
        public StaffController(IMediator mediator) : base(mediator)
        {
        }


        [HttpGet]
        [Route("get-current-staff")]
        public async Task<IActionResult> GetCurrentStaffAsync([FromRoute] AdminGetCurrentStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-staffs")]
        [HasPermission(EnumPermission.VIEW_STAFF)]
        public async Task<IActionResult> GetStaffs([FromQuery] AdminGetStaffsRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-staff-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_STAFF)]
        public async Task<IActionResult> GetStaffByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminGetStaffByIdRequest { Id = id });
            return Ok(response);
        }

        [HttpPost]
        [Route("create-staff")]
        [HasPermission(EnumPermission.CREATE_STAFF)]
        public async Task<IActionResult> CreateStaffAsync([FromBody] AdminCreateStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }


        [HttpPut]
        [Route("self-update-staff")]
        [HasPermission(EnumPermission.EDIT_STAFF)]
        public async Task<IActionResult> SelfUpdateStaffAsync([FromBody] AdminSelfUpdateStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-staff")]
        [HasPermission(EnumPermission.EDIT_STAFF)]
        public async Task<IActionResult> UpdateStaffAsync([FromBody] AdminUpdateStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-staff-status/{id}")]
        [HasPermission(EnumPermission.EDIT_STAFF)]
        public async Task<IActionResult> UpdateStaffStatusAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminUpdateStaffStatusRequest { Id = id });
            return Ok(response);
        }

        [HttpDelete]
        [Route("delete-staff-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_STAFF)]
        public async Task<IActionResult> DeleteStaffByIdAsync([FromRoute] AdminDeleteStaffByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }


        [HttpPost]
        [Route("update-password")]
        public async Task<IActionResult> UpdatePasswordAsync([FromBody] UpdatePasswordRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("disable-account")]
        public async Task<IActionResult> DisableAccount([FromRoute] DisableAccountRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}
