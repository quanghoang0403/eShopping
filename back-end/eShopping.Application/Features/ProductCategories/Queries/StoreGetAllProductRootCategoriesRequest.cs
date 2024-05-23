using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetAllProductRootCategoriesRequest : IRequest<BaseResponseModel>
    {
    }

    public class StoreGetAllProductRootCategoriesRequestHandler : IRequestHandler<StoreGetAllProductRootCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public StoreGetAllProductRootCategoriesRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration mapperConfiguration)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(StoreGetAllProductRootCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductRootCategoriesInStore = await _unitOfWork.ProductRootCategories
                    .GetAll()
                    .AsNoTracking()
                    .OrderBy(pc => pc.Priority)
                    .Select(p => new StoreProductRootCategoryModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        UrlSEO = p.UrlSEO
                    })
                    .ToListAsync(cancellationToken: cancellationToken);
            return BaseResponseModel.ReturnData(allProductRootCategoriesInStore);
        }
    }
}
