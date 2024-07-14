using AutoMapper;
using eShopping.Common.Models;
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
    public class StoreGetProductWishListRequest : IRequest<BaseResponseModel>
    {
        public List<int> ProductCodes { get; set; }
    }
    public class StoreGetProductByIdRequestHandler : IRequestHandler<StoreGetProductWishListRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public StoreGetProductByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetProductWishListRequest request, CancellationToken cancellationToken)
        {
            if (request.ProductCodes == null || !request.ProductCodes.Any())
            {
                return BaseResponseModel.ReturnData(new List<StoreProductModel>());
            }
            var product = await _unitOfWork.Products.Where(p => request.ProductCodes.Contains(p.Code) && p.IsActive).ToListAsync(cancellationToken);
            var response = _mapper.Map<List<StoreProductModel>>(product);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
