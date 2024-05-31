using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductByUrlRequest : IRequest<BaseResponseModel>
    {
        public string Url { get; set; }
    }

    public class StoreGetProductByUrlRequestHandler : IRequestHandler<StoreGetProductByUrlRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;

        public StoreGetProductByUrlRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetProductByUrlRequest request, CancellationToken cancellationToken)
        {
            var productData = await _unitOfWork.Products
                .Find(p => p.UrlSEO == request.Url)
                .AsNoTracking()
                .Include(x => x.ProductVariants)
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductRootCategory)
                .Include(p => p.ProductSizeCategory.ProductSizes)
                .Include(p => p.ProductStocks)
                .ProjectTo<StoreProductModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (productData == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product detail information");
            }

            var images = await _unitOfWork.Images.GetAllImagesByObjectId(productData.Id, EnumImageTypeObject.Product);
            return BaseResponseModel.ReturnData(productData);
        }
    }
}
