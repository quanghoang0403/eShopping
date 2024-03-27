using eShopping.Application.Features.Products.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class ProductController : BaseApiStoreController
    {
        public ProductController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-products")]
        public async Task<IActionResult> GetProductsAsync([FromQuery] StoreGetProductsRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-product-by-id")]
        public async Task<IActionResult> GetProductById([FromQuery] StoreGetProductByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}