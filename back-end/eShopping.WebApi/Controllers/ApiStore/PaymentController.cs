using eShopping.POS.Application.Features.Payments.Commands;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class PaymentController : BaseApiStoreController
    {
        public PaymentController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("vnpay-ipn")]
        public async Task<IActionResult> VnPayIpn([FromQuery] VnPayIpnRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("payos-ipn")]
        public async Task<IActionResult> PayOSIpn([FromQuery] PayOSIpnRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("momo-ipn")]
        public async Task<IActionResult> MomoIpn([FromBody] MomoIpnRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("transfer-confirm")]
        public async Task<IActionResult> TransferConfirm([FromBody] TransferRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}