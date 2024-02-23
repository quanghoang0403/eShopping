﻿using eShopping.Application.Features.Products.Commands;
using eShopping.Common.Attributes.Permission;
using eShopping.Domain.Enums;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers
{
    [Authorize]
    public class ProductController : BaseApiController
    {
        public ProductController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost]
        [Route("create-product")]
        [HasPermission(EnumPermission.CREATE_PRODUCT)]
        public async Task<IActionResult> CreateProductManagementAsync([FromBody] CreateProductRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("update-product")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> EditProductCategoryAsync([FromBody] UpdateProductRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpPut]
        [Route("change-status/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> ChangeStatusAsync(Guid id)
        {
            var response = await _mediator.Send(new ChangeStatusRequest() { Id = id });
            return await SafeOkAsync(response);
        }

        [HttpDelete]
        [Route("delete-product-by-id/{id}")]
        [HasPermission(EnumPermission.EDIT_PRODUCT)]
        public async Task<IActionResult> DeleteProductByIdAsync([FromRoute] DeleteProductByIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-products-by-category-id")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductsByCategoryIds([FromQuery] GetProductsByCategoryIdRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-products-by-filter")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductsByFilterAsync([FromQuery] GetProductsByFilterRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }

        [HttpGet]
        [Route("get-product-detail-data-by-id")]
        [HasPermission(EnumPermission.VIEW_PRODUCT)]
        public async Task<IActionResult> GetProductDetailById([FromQuery] GetProductDetailRequest request)
        {
            var response = await _mediator.Send(request);
            return await SafeOkAsync(response);
        }
    }
}