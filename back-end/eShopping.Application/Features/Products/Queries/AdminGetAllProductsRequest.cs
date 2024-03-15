using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetAllProductsRequest : IRequest<AdminGetAllProductsResponse>
    {
    }

    public class AdminGetAllProductsResponse
    {
        public IEnumerable<ProductModel> Products { get; set; }
    }

    public class AdminGetAllProductsRequestHandler : IRequestHandler<AdminGetAllProductsRequest, AdminGetAllProductsResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetAllProductsRequestHandler(
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

        public async Task<AdminGetAllProductsResponse> Handle(AdminGetAllProductsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var products = await _unitOfWork.Products
                .GetAll()
                .AsNoTracking()
                .ProjectTo<ProductModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = new AdminGetAllProductsResponse()
            {
                Products = products
            };

            return response;
        }
    }
}
