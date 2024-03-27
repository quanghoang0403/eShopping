using eShopping.Application.Features.Products.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiStore
{
    public class ProductCategoryController : BaseApiStoreController
    {
        public ProductCategoryController(IMediator mediator) : base(mediator)
        {
        }

        [HttpGet]
        [Route("get-all-product-categories")]
        public async Task<IActionResult> GetAllProductCategory([FromBody] StoreGetAllProductCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }

        [HttpGet]
        [Route("get-product-category-by-id/{id}")]
        public async Task<IActionResult> GetProductCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new StoreGetProductCategoryByIdRequest() { Id = id });
            return await SafeOkAsync(response);
        }
    }
}