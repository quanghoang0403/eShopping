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
    public class AdminGetAllProductCategoriesRequest : IRequest<AdminGetAllProductCategoriesResponse>
    {
    }

    public class AdminGetAllProductCategoriesResponse
    {
        public IEnumerable<AdminProductCategoryModel> AllProductCategories { get; set; }
    }

    public class AdminGetAllProductCategoriesRequestHandler : IRequestHandler<AdminGetAllProductCategoriesRequest, AdminGetAllProductCategoriesResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetAllProductCategoriesRequestHandler(
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

        public async Task<AdminGetAllProductCategoriesResponse> Handle(AdminGetAllProductCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductCategoriesInStore = await _unitOfWork.ProductCategories
                    .GetAll()
                    .AsNoTracking()
                    .Include(pc => pc.ProductInCategories)
                    .ThenInclude(ppc => ppc.Product).ThenInclude(p => p.ProductPrices)
                    .Select(p => new AdminProductCategoryModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Priority = p.Priority,
                        Products = _mapper.Map<IEnumerable<AdminProductDatatableModel>>(p.ProductInCategories.Select(ppc => ppc.Product))
                    })
                    .OrderBy(pc => pc.Priority)
                    .ToListAsync(cancellationToken: cancellationToken);

            var response = new AdminGetAllProductCategoriesResponse()
            {
                AllProductCategories = allProductCategoriesInStore
            };

            return response;
        }
    }
}
