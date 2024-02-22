using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Admin.Controllers.Base;
using GoFoodBeverage.Application.Features.Settings.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace eShopping.WebApi.Admin.Controllers
{
    [Authorize]
    public class ProductCategoryController : BaseApiController
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
        [Route("get-combos-by-product-category-id/{id}")]
        public async Task<IActionResult> GetCombosByProductCategoryId(Guid id)
        {
            var response = await _mediator.Send(new GetCombosByProductCategoryIdRequest() { Id = id });
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-all-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetAllCategory([FromBody] GetAllProductCategoriesRequest request)
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