using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Blog;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Blogs.Queries
{
    public class AdminGetAllBlogRequest : IRequest<BaseResponseModel>
    {
    }
    //public class AdminGetAllBlogResponse
    //{
    //    public IEnumerable<AdminBlogModel> AllBlogs { get; set; }
    //}
    public class AdminGetAllBlogRequestHandler : IRequestHandler<AdminGetAllBlogRequest, BaseResponseModel>
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
        public async Task<BaseResponseModel> Handle(AdminGetAllBlogRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allBlogs = await _unitOfWork.Blogs
                .GetAll().AsNoTracking()
                .ProjectTo<AdminBlogModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);
            var categoryIds = await _unitOfWork.BlogInCategories.GetAll().ToListAsync(cancellationToken: cancellationToken);
            allBlogs.ForEach(b =>
            {
                b.BlogCategoryId = categoryIds.Where(c => c.BlogId == b.Id).Select(c => c.BlogCategoryId).FirstOrDefault();
            });
            var response = BaseResponseModel.ReturnData(allBlogs);
            return response;

        }
    }
}
