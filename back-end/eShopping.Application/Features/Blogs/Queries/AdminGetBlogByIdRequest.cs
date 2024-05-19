using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
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
    public class AdminGetBlogByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    //public class AdminGetBlogByIdResponse
    //{
    //    public AdminBlogDetailModel Blog { get; set; }
    //}
    public class AdminGetBlogByIdRequestHandler : IRequestHandler<AdminGetBlogByIdRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;

        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;
        public AdminGetBlogByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminGetBlogByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blog = await _unitOfWork.Blogs
                .Find(b => b.Id == request.Id)
                .AsNoTracking()
                .Include(b => b.BlogInCategories)
                .ProjectTo<AdminBlogDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken);

            if (blog == null)
            {
                BaseResponseModel.ReturnError("Cannot find blog information");
            }
            var blogCategory = await _unitOfWork.BlogCategories
                .Where(bc => bc.BlogInCategories
                .Any(bic => bic.blogId == request.Id))
                .ProjectTo<AdminBlogCategoryModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken);
            blog.BlogCategories = blogCategory;
            return BaseResponseModel.ReturnData(blog);
        }
    }
}
