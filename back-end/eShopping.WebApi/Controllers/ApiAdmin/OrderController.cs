using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using GoFoodBeverage.Application.Features.Orders.Commands;
using GoFoodBeverage.Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiAdmin
{
    [Authorize]
    public class OrderController : BaseApiAdminController
    {
        public OrderController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-orders")]
        [HasPermission(EnumPermission.VIEW_ORDER)]
        public async Task<IActionResult> GetOrdersAsync([FromQuery] AdminGetOrdersRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }


        [HttpGet]
        [Route("get-order-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_ORDER)]
        public async Task<IActionResult> GetOrderByIdAsync([FromHeader] AdminGetOrderByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-order-top-selling")]
        [HasPermission(EnumPermission.VIEW_ORDER)]
        public async Task<IActionResult> GetOrderTopSellingAsync([FromQuery] AdminGetOrderTopSellingRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("update-order-status")]
        [HasPermission(EnumPermission.EDIT_ORDER)]
        public async Task<IActionResult> UpdateOrderStatusAsync(AdminUpdateOrderStatusRequest command)
        {
            var response = await _mediator.Send(command);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-order-history-by-order-id/{id}")]
        [HasPermission(EnumPermission.VIEW_ORDER)]
        public async Task<IActionResult> GetOrderHistoryByOrderId([FromRoute] GetOrderHistoryByOrderIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
