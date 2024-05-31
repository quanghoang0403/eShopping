using AutoMapper;
using eShopping.Common.Models;
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
    public class AdminGetAllBlogCategoryRequest : IRequest<BaseResponseModel>
    {
    }

    //public class AdminGetAllBlogCategoryResponse
    //{
    //    public IEnumerable<AdminBlogCategoryModel> BlogCategories { get; set; }
    //}
    public class AdminGetAllBlogCategoryRequestHandler : IRequestHandler<AdminGetAllBlogCategoryRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(AdminGetAllBlogCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allBlogCategory = await _unitOfWork.BlogCategories
                .GetAll()
                .AsNoTracking()
                .Include(b => b.BlogInCategories).ThenInclude(bc => bc.Blog)
                .Select(b => new AdminBlogCategoryModel
                {
                    Id = b.Id,
                    Name = b.Name,
                    Priority = b.Priority,
                    Blogs = _mapper.Map<IEnumerable<AdminBlogModel>>(b.BlogInCategories.Select(bc => bc.Blog))
                }).OrderBy(b => b.Priority).ToListAsync(cancellationToken);
            return BaseResponseModel.ReturnData(allBlogCategory);
        }
    }
}
