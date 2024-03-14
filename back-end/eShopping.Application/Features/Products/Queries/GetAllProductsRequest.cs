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
    public class GetAllProductsRequest : IRequest<GetAllProductsResponse>
    {

    }

    public class GetAllProductsResponse
    {
        public IEnumerable<ProductModel> Products { get; set; }
    }

    public class GetAllProductsRequestHandler : IRequestHandler<GetAllProductsRequest, GetAllProductsResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetAllProductsRequestHandler(
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

        public async Task<GetAllProductsResponse> Handle(GetAllProductsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var products = await _unitOfWork.Products
                .GetAll()
                .AsNoTracking()
                .ProjectTo<ProductModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = new GetAllProductsResponse()
            {
                Products = products
            };

            return response;
        }
    }
}
