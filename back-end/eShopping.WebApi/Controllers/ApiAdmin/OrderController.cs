using eShopping.WebApi.Controllers.Base;
using GoFoodBeverage.Application.Features.Orders.Commands;
using GoFoodBeverage.Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> GetOrderManagementAsync([FromQuery] GetOrdersManagementRequest request)
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
        [Route("get-order-business-summary-widget")]
        public async Task<IActionResult> GetOrderBusinessSummaryWidgetAsync([FromQuery] AdminGetOrderBusinessSummaryWidgetRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-order-top-selling-product")]
        public async Task<IActionResult> GetOrderTopSellingProductAsync([FromQuery] AdminGetOrderTopSellingProductRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("admin-update-order-status")]
        [HasPermission(EnumPermission.EDIT_ORDER)]
        public async Task<IActionResult> AdminUpdateOrderStatusAsync(AdminUpdateOrderStatusRequest command)
        {
            var response = await _mediator.Send(command);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-order-history-by-order-id/{id}")]
        public async Task<IActionResult> GetOrderHistoryByOrderId([FromRoute] AdminGetOrderHistoryByOrderIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
