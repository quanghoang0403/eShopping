using AutoMapper;
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
    public class AdminGetAllBlogCategoryRequest : IRequest<AdminGetAllBlogCategoryResponse>
    {
    }

    public class AdminGetAllBlogCategoryResponse
    {
        public IEnumerable<AdminBlogCategoryModel> BlogCategories { get; set; }
    }
    public class AdminGetAllBlogCategoryRequestHandler : IRequestHandler<AdminGetAllBlogCategoryRequest, AdminGetAllBlogCategoryResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetAllBlogCategoryRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AdminGetAllBlogCategoryResponse> Handle(AdminGetAllBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allBlogCategory = await _unitOfWork.BlogCategories
                .GetAll()
                .AsNoTracking()
                .Include(b => b.InCategories).ThenInclude(bc => bc.blog)
                .Select(b => new AdminBlogCategoryModel
                {
                    Id = b.Id,
                    Name = b.Name,
                    Priority = b.Priority,
                    Blogs = _mapper.Map<IEnumerable<AdminBlogModel>>(b.InCategories.Select(bc => bc.blog))
                }).OrderBy(b => b.Priority).ToListAsync(cancellationToken);
            var response = new AdminGetAllBlogCategoryResponse
            {
                BlogCategories = allBlogCategory
            };
            return response;
        }
    }
}
