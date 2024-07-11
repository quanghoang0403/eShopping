using eShopping.Application.Features.Products.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
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
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-by-url")]
        public async Task<IActionResult> GetProductByUrl([FromQuery] StoreGetProductByUrlRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-by-id/{id}")]
        public async Task<IActionResult> GetProductWishList(Guid id)
        {
            var response = await _mediator.Send(new StoreGetProductByIdRequest { Id = id});
            return Ok(response);
        }
    }
}