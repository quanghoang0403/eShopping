using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using eShopping.Application.Features.Orders.Commands;
using eShopping.Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    [Authorize]
    public class OrderController : BaseApiStoreController
    {
        public OrderController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-orders")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> GetOrdersAsync([FromQuery] StoreGetOrdersRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }


        [HttpGet]
        [Route("get-order-by-id/{id}")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> GetOrderByIdAsync([FromHeader] StoreGetOrderByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("update-order")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> UpdateOrderAsync(StoreUpdateOrderRequest command)
        {
            var response = await _mediator.Send(command);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("cancel-order")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> CancelOrderStatusAsync(StoreCancelOrderRequest command)
        {
            var response = await _mediator.Send(command);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-order-history-by-order-id/{id}")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> GetOrderHistoryByOrderId([FromRoute] GetOrderHistoryByOrderIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPost]
        [Route("checkout")]
        [HasPermission(EnumPermission.STORE_WEB)]
        public async Task<IActionResult> Checkout(StoreCreateOrderRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}
