using eShopping.Application.Features.Staffs.Commands;
using eShopping.Application.Features.Staffs.Queries;
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
    public class StaffController : BaseApiAdminController
    {
        public StaffController(IMediator mediator) : base(mediator)
        {
        }


        [HttpGet]
        [Route("get-current-staff")]
        public async Task<IActionResult> GetCurrentStaffAsync([FromRoute] GetCurrentStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-staffs")]
        [HasPermission(EnumPermission.VIEW_STAFF)]
        public async Task<IActionResult> GetStaffs([FromQuery] GetStaffsRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-staff-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_STAFF)]
        public async Task<IActionResult> GetStaffByIdAsync([FromRoute] GetStaffByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPost]
        [Route("create-staff")]
        [HasPermission(EnumPermission.CREATE_STAFF)]
        public async Task<IActionResult> CreateStaffAsync([FromBody] CreateStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }


        [HttpPut]
        [Route("update-staff")]
        [HasPermission(EnumPermission.EDIT_STAFF)]
        public async Task<IActionResult> UpdateStaffAsync([FromBody] UpdateStaffRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpDelete]
        [Route("delete-staff-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_STAFF)]
        public async Task<IActionResult> DeleteStaffByIdAsync([FromRoute] DeleteStaffByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

    }
}
