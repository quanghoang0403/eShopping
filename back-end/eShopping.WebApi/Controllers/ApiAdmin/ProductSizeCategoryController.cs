using eShopping.Application.Features.ProductCategories.Commands;
using eShopping.Application.Features.ProductCategories.Queries;
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
    public class ProductSizeCategoryController : BaseApiAdminController
    {
        public ProductSizeCategoryController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("create-product-size-category")]
        [HasPermission(EnumPermission.CREATE_PRODUCT_CATEGORY)]
        public async Task<IActionResult> CreateProductSizeCategoryAsync([FromBody] AdminCreateProductSizeCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-all-product-size-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetAllProductSizeCategory([FromQuery] AdminGetAllProductSizeCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-size-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetProductSizeCategoriesAsync([FromQuery] AdminGetProductSizeCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-product-size-category")]
        [HasPermission(EnumPermission.EDIT_PRODUCT_CATEGORY)]
        public async Task<IActionResult> UpdateProductSizeCategoryAsync([FromBody] AdminUpdateProductSizeCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("delete-product-size-category-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT_CATEGORY)]
        public async Task<IActionResult> DeleteProductSizeCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminDeleteProductSizeCategoryRequest() { Id = id });
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-size-category-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetProductSizeCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminGetProductSizeCategoryByIdRequest() { Id = id });
            return Ok(response);
        }
    }
}
