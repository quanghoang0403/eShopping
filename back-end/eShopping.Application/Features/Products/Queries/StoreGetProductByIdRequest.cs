using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductByIdRequest : IRequest<StoreGetProductByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class StoreGetProductByIdResponse
    {
        public StoreProductDetailModel Product { get; set; }

    }

    public class StoreGetProductByIdRequestHandler : IRequestHandler<StoreGetProductByIdRequest, StoreGetProductByIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateTimeService _dateTimeService;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;

        public StoreGetProductByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IDateTimeService dateTimeService,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _dateTimeService = dateTimeService;
            _userProvider = userProvider;
            _mapperConfiguration = mapperConfiguration;
            _mapper = mapper;
        }

        public async Task<StoreGetProductByIdResponse> Handle(StoreGetProductByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productData = await _unitOfWork.Products
                .Find(p => p.Id == request.Id)
                .AsNoTracking()
                .Include(x => x.ProductPrices)
                .Include(x => x.Images)
                .Include(p => p.ProductInCategories)
                .ProjectTo<StoreProductDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            ThrowError.Against(productData == null, "Cannot find product detail information");
            var images = await _unitOfWork.Images.GetAllImagesByObjectId(productData.Id, EnumImageTypeObject.Product);
            var category = await _unitOfWork.ProductCategories.GetProductCategoryListByProductId(productData.Id).FirstOrDefaultAsync();
            productData.ProductCategory = new StoreProductCategoryModel()
            {
                Id = category.Id,
                Name = category.Name,
                UrlSEO = category.UrlSEO,
            };
            productData.Gallery = images.Select(x => x.ImagePath).ToList();

            return new StoreGetProductByIdResponse
            {
                Product = productData,
            };
        }
    }
}
