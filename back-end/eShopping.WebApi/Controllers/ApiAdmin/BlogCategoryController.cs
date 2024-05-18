using eShopping.Application.Features.Blogs.Commands;
using eShopping.Application.Features.Blogs.Queries;
using eShopping.WebApi.Controllers.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace eShopping.WebApi.Controllers.ApiAdmin
{
    [Authorize]
    public class BlogCategoryController : BaseApiAdminController
    {
        public BlogCategoryController(IMediator mediator) : base(mediator)
        {
        }
        [HttpPost]
        [Route("create-blog-category")]
        public async Task<IActionResult> CreateBlogCategory([FromBody] AdminCreateBlogCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);

        }
        [HttpGet]
        [Route("get-all-blog-category")]
        public async Task<IActionResult> GetAllBlogCategory([FromQuery] AdminGetAllBlogCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);

        }
        [HttpGet]
        [Route("get-blog-categories")]
        public async Task<IActionResult> GetBlogCategoriesAsync([FromQuery] AdminGetBlogCategoriesRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);

        }
        [HttpGet]
        [Route("get-blog-category-by-id/{id}")]
        public async Task<IActionResult> GetBlogCategoryById(Guid id)
        {
            var response = await _mediator.Send(new AdminGetBlogCategoryByIdRequest { Id = id });
            return Ok(response);

        }
        [HttpPut]
        [Route("update-blog-category")]
        public async Task<IActionResult> UpdateBlogCategory([FromBody] AdminUpdateBlogCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);

        }
        [HttpPut]
        [Route("update-blog-list")]
        public async Task<IActionResult> UpdateBlogList([FromBody] AdminUpdateBlogByBlogCategoryRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);

        }
        [HttpDelete]
        [Route("delete-blog-category-by-id/{id}")]
        public async Task<IActionResult> DeleteBlogCategoryById(Guid id)
        {
            var response = await _mediator.Send(new AdminDeleteBlogCategoryRequest() { Id = id });
            return Ok(response);

        }
    }
}
