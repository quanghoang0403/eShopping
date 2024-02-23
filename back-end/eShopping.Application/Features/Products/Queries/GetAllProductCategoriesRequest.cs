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
    public class GetAllProductCategoriesRequest : IRequest<GetAllProductCategoriesResponse>
    {
    }

    public class GetAllProductCategoriesResponse
    {
        public IEnumerable<ProductCategoryModel> AllProductCategories { get; set; }
    }

    public class GetAllProductCategoriesRequestHandler : IRequestHandler<GetAllProductCategoriesRequest, GetAllProductCategoriesResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetAllProductCategoriesRequestHandler(
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

        public async Task<GetAllProductCategoriesResponse> Handle(GetAllProductCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductCategoriesInStore = await _unitOfWork.Categories
                    .GetAll()
                    .AsNoTracking()
                    .Include(pc => pc.ProductInCategories)
                    .ThenInclude(ppc => ppc.Product).ThenInclude(p => p.ProductOptions)
                    .Select(p => new ProductCategoryModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Priority = p.Priority,
                        Products = _mapper.Map<IEnumerable<ProductDatatableModel>>(p.ProductInCategories.Select(ppc => ppc.Product))
                    })
                    .OrderBy(pc => pc.Priority)
                    .ToListAsync(cancellationToken: cancellationToken);

            var response = new GetAllProductCategoriesResponse()
            {
                AllProductCategories = allProductCategoriesInStore
            };

            return response;
        }
    }
}
