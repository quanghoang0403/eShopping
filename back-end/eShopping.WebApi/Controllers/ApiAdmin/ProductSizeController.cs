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
    public class ProductSizeController : BaseApiAdminController
    {
        public ProductSizeController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("create-product-size")]
        [HasPermission(EnumPermission.CREATE_PRODUCT)]
        public async Task<IActionResult> CreateProductSizeAsync([FromBody] AdminCreateProductSizeRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-all-product-size")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetAllProductSizes([FromQuery] AdminGetAllProductSizeRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpGet]
        [Route("get-products-size")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductSizesAsync([FromQuery] AdminGetProductSizeRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("update-product-size")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> UpdateProductSizeAsync([FromBody] AdminUpdateProductSizeRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("delete-product-size-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> DeleteProductSizeByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminDeleteProductSizeRequest { Id = id });
            return Ok(response);
        }

        [HttpGet]
        [Route("get-product-size-by-id")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductSizeById([FromQuery] AdminGetProductSizeByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }
    }
}
