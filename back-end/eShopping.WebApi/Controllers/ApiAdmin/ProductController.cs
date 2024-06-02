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
    public class ProductController : BaseApiAdminController
    {
        public ProductController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("create-product")]
        [HasPermission(EnumPermission.CREATE_PRODUCT)]
        public async Task<IActionResult> CreateProductAsync([FromBody] AdminCreateProductRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-product")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> UpdateProductAsync([FromBody] AdminUpdateProductRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("change-status/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> ChangeStatusAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminChangeStatusRequest() { Id = id });
            return Ok(response);
        }
        [HttpPut]
        [Route("change-featured-status")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> ChangeFeaturedStatusAsync([FromQuery] AdminChangeFeatureStatusRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("delete-product-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> DeleteProductByIdAsync([FromRoute] AdminDeleteProductByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-products")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductsAsync([FromQuery] AdminGetProductsRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-by-id")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductById([FromQuery] AdminGetProductByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-all-products")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetAllProductsAsync()
        {
            var response = await _mediator.Send(new AdminGetAllProductsRequest());
            return Ok(response);
        }

        [HttpGet]
        [Route("get-prepared-data-product")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetPreparedDataProduct()
        {
            var response = await _mediator.Send(new AdminGetPreparedDataProductRequest());
            return Ok(response);
        }
    }
}