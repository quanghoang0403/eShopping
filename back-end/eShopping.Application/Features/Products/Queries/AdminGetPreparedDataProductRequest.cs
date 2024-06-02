using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetPreparedDataProductRequest : IRequest<BaseResponseModel>
    {
    }

    public class AdminGetPreparedDataProductRequestHandler : IRequestHandler<AdminGetPreparedDataProductRequest, BaseResponseModel>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetPreparedDataProductRequestHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration

        )
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(AdminGetPreparedDataProductRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productRootCategories = await _unitOfWork.ProductRootCategories
                .GetAll()
                .Include(x => x.ProductCategories)
                .AsNoTracking()
                .ProjectTo<AdminProductRootCategoryModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var productSizeCategories = await _unitOfWork.ProductSizeCategories
                .GetAll()
                .Include(x => x.ProductSizes)
                .AsNoTracking()
                .ProjectTo<AdminProductSizeCategoryModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var res = new AdminPreparedDataProductModel()
            {
                ProductRootCategories = productRootCategories,
                ProductSizeCategories = productSizeCategories,
            };
            return BaseResponseModel.ReturnData(res);
        }
    }
}
