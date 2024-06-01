using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetAllProductSizeCategoriesRequest : IRequest<BaseResponseModel>
    {
    }

    public class AdminGetAllProductSizeCategoriesRequestHandler : IRequestHandler<AdminGetAllProductSizeCategoriesRequest, BaseResponseModel>
    {
        private IUnitOfWork _unitOfOfWork;
        private IMapper _mapper;
        private IUserProvider _userProvider;
        public AdminGetAllProductSizeCategoriesRequestHandler(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IUserProvider userProvider
            )
        {
            _unitOfOfWork = unitOfWork;
            _mapper = mapper;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminGetAllProductSizeCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductSizeCategories = await _unitOfOfWork.ProductSizeCategories.GetAll()
                .AsNoTracking()
                .Include(p => p.ProductSizes)
                .Select(p => new AdminProductSizeCategoryModel()
                {
                    Id = p.Id,
                    Name = p.Name,
                    NumberOfProductSize = p.ProductSizes.Count(),
                })
                .ToListAsync();
            return BaseResponseModel.ReturnData(allProductSizeCategories);
        }
    }
}
