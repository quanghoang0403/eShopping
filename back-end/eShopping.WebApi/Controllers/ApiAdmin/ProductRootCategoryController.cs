using eShopping.Application.Features.ProductCategories.Commands;
using eShopping.Application.Features.ProductCategories.Queries;
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
    public class ProductRootCategoryController : BaseApiAdminController
    {
        public ProductRootCategoryController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("create-product-root-category")]
        [HasPermission(EnumPermission.CREATE_PRODUCT_CATEGORY)]
        public async Task<IActionResult> CreateProductRootCategoryAsync([FromBody] AdminCreateProductRootCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-product-root-category")]
        [HasPermission(EnumPermission.EDIT_PRODUCT_CATEGORY)]
        public async Task<IActionResult> UpdateProductRootCategoryAsync([FromBody] AdminUpdateProductRootCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }


        [HttpDelete]
        [Route("delete-product-root-category-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT_CATEGORY)]
        public async Task<IActionResult> DeleteProductRootCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminDeleteProductRootCategoryByIdRequest() { Id = id });
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-root-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetProductRootCategoriesAsync([FromQuery] AdminGetProductRootCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-all-product-root-categories")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetAllProductRootCategory([FromQuery] AdminGetAllProductRootCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-root-category-by-id/{id}")]
        [HasPermission(EnumPermission.VIEW_PRODUCT_CATEGORY)]
        public async Task<IActionResult> GetProductRootCategoryByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminGetProductRootCategoryByIdRequest() { Id = id });
            return Ok(response);
        }
    }
}