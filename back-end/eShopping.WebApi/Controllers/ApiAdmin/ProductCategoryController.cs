using eShopping.Application.Features.Products.Commands;
using eShopping.Application.Features.Products.Queries;
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
    public class ProductCategoryController : BaseApiAdminController
    {
        public ProductCategoryController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("create-product-category")]
        [HasPermission(EnumPermission.CREATE_PRODUCT_CATEGORY)]
        public async Task<IActionResult> CreateProductCategoryAsync([FromBody] CreateProductCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("update-product-category")]
        [HasPermission(EnumPermission.EDIT_PRODUCT_CATEGORY)]
        public async Task<IActionResult> UpdateProductCategoryAsync([FromBody] UpdateProductCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpDelete]
        [Route("delete-product-category-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT_CATEGORY)]
        public async Task<IActionResult> DeleteProductCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new DeleteProductCategoryByIdRequest() { Id = id });
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-product-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetProductCategoriesAsync([FromQuery] GetProductCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-all-product-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetAllProductCategory([FromBody] GetAllProductCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }

        [HttpGet]
        [Route("get-product-category-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetProductCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new GetProductCategoryByIdRequest() { Id = id });
            return await SafeOkAsync(response);
        }
    }
}