using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class AdminGetBlogByIdRequest : IRequest<AdminGetBlogByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetBlogByIdResponse
    {
        public AdminBlogDetailModel Blog { get; set; }
    }
    public class AdminGetBlogByIdRequestHandler : IRequestHandler<AdminGetBlogByIdRequest, AdminGetBlogByIdResponse>
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
        public async Task<AdminGetBlogByIdResponse> Handle(AdminGetBlogByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var blog = await _unitOfWork.Blogs
                .Find(b => b.Id == request.Id)
                .AsNoTracking()
                .Include(b => b.BlogInCategories)
                .ProjectTo<AdminBlogDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken);
            ThrowError.Against(blog == null, "Cannot find blog information");
            var blogCategory = await _unitOfWork.BlogCategories
                .Where(bc => bc.InCategories
                .Any(bic => bic.blogId == request.Id))
                .ProjectTo<AdminBlogCategoryModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken);
            blog.BlogCategories = blogCategory;
            return new AdminGetBlogByIdResponse
            {
                Blog = blog
            };
        }
    }
}
