using eShopping.Application.Features.ProductCategories.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class ProductRootCategoryController : BaseApiStoreController
    {
        public ProductRootCategoryController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-all-product-root-categories")]
        public async Task<IActionResult> GetAllProductRootCategory([FromQuery] StoreGetAllProductRootCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-root-category-by-url")]
        public async Task<IActionResult> GetProductRootCategoryByUrlAsync([FromQuery] StoreGetProductRootCategoryByUrlRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}