using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Blog;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Queries
{
    public class AdminGetBlogsRequest : IRequest<AdminGetBlogsResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }

        public Guid? BlogCategoryId { get; set; }

        public EnumStatus Status { get; set; }
    }

    public class AdminGetBlogsResponse
    {
        public IEnumerable<AdminBlogModel> Blogs { get; set; }
        public int PageNumber { get; set; }
        public int Total { get; set; }
    }
    public class AdminGetBlogRequestHandler : IRequestHandler<AdminGetBlogsRequest, AdminGetBlogsResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetBlogRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<AdminGetBlogsResponse> Handle(AdminGetBlogsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blogs = _unitOfWork.Blogs.GetAll();
            if (blogs != null)
            {
                if (request.BlogCategoryId != null)
                {
                    //filter blogs with request category id
                    var blogInCategoryIds = _unitOfWork.BlogInCategories.Find(b => b.categoryId == request.BlogCategoryId).Select(b => b.blogId);
                    blogs = blogs.Where(b => blogInCategoryIds.Contains(b.Id));

                }
                if (!string.IsNullOrEmpty(request.KeySearch))
                {
                    //filter blogs with request key search
                    string keySearch = request.KeySearch.Trim().ToLower();
                    blogs = blogs.Where(g => g.Name.ToLower().Contains(keySearch));
                }
            }
            var allBlog = await blogs.
                AsNoTracking()
                .Where(b => b.Status.Equals(request.Status))
                .Include(b => b.BlogInCategories)
                .OrderBy(b => b.CreatedTime)
                .ToPaginationAsync(request.PageNumber, request.PageSize);
            var pageResult = allBlog.Result;
            var blogsResponse = _mapper.Map<List<AdminBlogModel>>(pageResult);

            blogsResponse.ForEach(b =>
            {
                var categoryId = pageResult.Where(bl => bl.Id == b.Id).Select(b => b.BlogInCategories).FirstOrDefault();
                b.No = blogsResponse.IndexOf(b) + ((request.PageNumber - 1) * request.PageSize) + 1;
                b.BlogCategoryId = categoryId.Select(c => c.categoryId).FirstOrDefault();
            });
            var response = new AdminGetBlogsResponse()
            {
                PageNumber = request.PageNumber,
                Total = allBlog.Total,
                Blogs = blogsResponse
            };

            return response;
        }
    }
}
