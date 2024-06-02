using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetAllProductsRequest : IRequest<BaseResponseModel>
    {
    }

    public class AdminGetAllProductsRequestHandler : IRequestHandler<AdminGetAllProductsRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(AdminGetAllProductsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var products = await _unitOfWork.Products
                .GetAll()
                .AsNoTracking()
                .ProjectTo<AdminProductModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            return BaseResponseModel.ReturnData(products);
        }
    }
}
