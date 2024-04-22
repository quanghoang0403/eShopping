using AutoMapper;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetAllProductCategoriesRequest : IRequest<IEnumerable<StoreProductCategoryModel>>
    {
    }

    public class StoreGetAllProductCategoriesRequestHandler : IRequestHandler<StoreGetAllProductCategoriesRequest, IEnumerable<StoreProductCategoryModel>>
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

        public async Task<IEnumerable<StoreProductCategoryModel>> Handle(StoreGetAllProductCategoriesRequest request, CancellationToken cancellationToken)
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
            return allProductCategoriesInStore;
        }
    }
}
