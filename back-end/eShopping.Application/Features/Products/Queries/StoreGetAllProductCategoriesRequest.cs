using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetAllProductCategoriesRequest : IRequest<BaseResponseModel>
    {
    }

    public class StoreGetAllProductCategoriesRequestHandler : IRequestHandler<StoreGetAllProductCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public StoreGetAllProductCategoriesRequestHandler(
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

        public async Task<BaseResponseModel> Handle(StoreGetAllProductCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductCategoriesInStore = await _unitOfWork.ProductCategories
                    .GetAll()
                    .AsNoTracking()
                    .OrderBy(pc => pc.Priority)
                    .Select(p => new StoreProductCategoryModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        UrlSEO = p.UrlSEO,
                        IsShowOnHome = p.IsShowOnHome
                    })
                    .ToListAsync(cancellationToken: cancellationToken);
            return BaseResponseModel.ReturnData(allProductCategoriesInStore);
        }
    }
}
