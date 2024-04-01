using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Blog;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Queries
{
    public class AdminGetBlogCategoryByIdRequest : IRequest<AdminGetBlogCategoryByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetBlogCategoryByIdResponse
    {
        public AdminBlogCategoryDetailModel BlogCategory { get; set; }
    }
    public class AdminGetBlogCategoryByIdRequestHandler : IRequestHandler<AdminGetBlogCategoryByIdRequest, AdminGetBlogCategoryByIdResponse>
    {

        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetBlogCategoryByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<AdminGetBlogCategoryByIdResponse> Handle(AdminGetBlogCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogCategoryData = await _unitOfWork.BlogCategories
                .Find(bc => bc.Id == request.Id)
                .Include(bc => bc.BlogInCategories).ThenInclude(bic => bic.blog)
                .FirstOrDefaultAsync();
            ThrowError.Against(blogCategoryData == null, "Couldn't found blog category");
            var blogCategory = _mapper.Map<AdminBlogCategoryDetailModel>(blogCategoryData);
            if (blogCategoryData.BlogInCategories != null)
            {
                blogCategory.Blogs = blogCategoryData.BlogInCategories
                    .Select(bc => new AdminBlogCategoryDetailModel.AdminBlogSelectedModel
                    {
                        Id = bc.blogId,
                        Name = bc.blog.Name,
                        Priority = bc.blog.Priority,
                    }).OrderBy(bc => bc.Priority).ToList();

            }
            return new AdminGetBlogCategoryByIdResponse
            {
                BlogCategory = blogCategory,
            };
        }
    }
}
