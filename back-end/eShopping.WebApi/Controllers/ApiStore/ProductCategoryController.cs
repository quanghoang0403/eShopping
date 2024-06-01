using eShopping.Application.Features.ProductCategories.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class ProductCategoryController : BaseApiStoreController
    {
        public ProductCategoryController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-product-category-by-url")]
        public async Task<IActionResult> GetProductCategoryByUrlAsync([FromQuery] StoreGetProductCategoryByUrlRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}