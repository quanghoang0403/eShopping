using eShopping.Application.Features.Promotions.Commands;
using eShopping.Application.Features.Promotions.Queries;
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
    public class PromotionController : BaseApiAdminController
    {
        public PromotionController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-promotions")]
        [HasPermission(EnumPermission.VIEW_PROMOTION)]
        public async Task<IActionResult> GetPromotionsAsync([FromQuery] GetPromotionsRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-promotion-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_PROMOTION)]
        public async Task<IActionResult> GetPromotionByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new GetPromotionByIdRequest() { Id = id });
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-promotion-campaign-usage-detail")]
        [HasPermission(EnumPermission.VIEW_PROMOTION)]
        public async Task<IActionResult> GetPromotionCampaignUsageDetailAsync([FromQuery] GetPromotionCampaignUsageDetailRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPost]
        [Route("create-promotion")]
        [HasPermission(EnumPermission.CREATE_PROMOTION)]
        public async Task<IActionResult> CreatePromotionAsync([FromBody] CreatePromotionRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPost]
        [Route("stop-promotion-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PROMOTION)]
        public async Task<IActionResult> StopPromotionByIdAsync([FromRoute] StopPromotionByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("update-promotion")]
        [HasPermission(EnumPermission.EDIT_PROMOTION)]
        public async Task<IActionResult> UpdatePromotionAsync([FromBody] UpdatePromotionRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpDelete]
        [Route("delete-promotion-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PROMOTION)]
        public async Task<IActionResult> DeletePromotionByIdAsync([FromRoute] DeletePromotionByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
