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
    public class BlogsController : BaseApiAdminController
    {
        public BlogsController(IMediator mediator) : base(mediator)
        {
        }
        [HttpGet]
        [Route("get-all-blogs")]
        public async Task<IActionResult> GetAllBlogs([FromQuery] AdminGetAllBlogRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }
        [HttpGet]
        [Route("get-blogs")]
        public async Task<IActionResult> GetBlogsAsync([FromQuery] AdminGetBlogsRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }
        [HttpPost]
        [Route("create-new-blog")]
        public async Task<IActionResult> CreateNewBlogs([FromBody] AdminCreateBlogRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }
        [HttpGet]
        [Route("get-blog-by-id/{id}")]
        public async Task<IActionResult> GetBlogById(Guid id)
        {
            var response = await _mediator.Send(new AdminGetBlogByIdRequest() { Id = id });
            return SafeOk(response);
        }
        [HttpPut]
        [Route("update-blog")]
        public async Task<IActionResult> UpdateBlogAsync([FromBody] AdminUpdateBlogRequest request)
        {
            var response = await _mediator.Send(request);
            return SafeOk(response);
        }
        [HttpDelete]
        [Route("delete-blog-by-id/{id}")]
        public async Task<IActionResult> DeletBlogByIdAsync(Guid id)
        {
            var response = await _mediator.Send(new AdminDeleteBlogRequest() { Id = id });
            return SafeOk(response);
        }
    }
}
