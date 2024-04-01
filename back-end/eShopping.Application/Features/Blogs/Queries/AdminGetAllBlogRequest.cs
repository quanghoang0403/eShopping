using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Interfaces;
using eShopping.Models.Blog;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Queries
{
    public class AdminGetAllBlogRequest : IRequest<AdminGetAllBlogResponse>
    {
    }
    public class AdminGetAllBlogResponse
    {
        public IEnumerable<AdminBlogModel> AllBlogs { get; set; }
    }
    public class AdminGetAllBlogRequestHandler : IRequestHandler<AdminGetAllBlogRequest, AdminGetAllBlogResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly MapperConfiguration _mapperConfiguration;
        public AdminGetAllBlogRequestHandler(IUnitOfWork unitOfWork, IUserProvider userProvider, MapperConfiguration mapperConfiguration)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
        }
        public async Task<AdminGetAllBlogResponse> Handle(AdminGetAllBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allBlogs = await _unitOfWork.Blogs
                .GetAll().AsNoTracking()
                .ProjectTo<AdminBlogModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);
            var categoryIds = await _unitOfWork.BlogInCategories.GetAll().ToListAsync(cancellationToken: cancellationToken);
            allBlogs.ForEach(b =>
            {
                b.BlogCategoryId = categoryIds.Where(c => c.blogId == b.Id).Select(c => c.categoryId).FirstOrDefault();
            });
            var response = new AdminGetAllBlogResponse
            {
                AllBlogs = allBlogs
            };
            return response;

        }
    }
}
