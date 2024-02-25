using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Commons;
using eShopping.Models.Products;
using GoFoodBeverage.POS.Models.Product;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.POS.Application.Features.Products.Queries
{
    public class GetProductDetailByIdRequest : IRequest<GetProductDetailByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetProductDetailByIdResponse
    {
        public ProductDetailModel ProductDetail { get; set; }

    }

    public class GetProductDetailByIdRequestHandler : IRequestHandler<GetProductDetailByIdRequest, GetProductDetailByIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDateTimeService _dateTimeService;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;

        public GetProductDetailByIdRequestHandler(
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

        public async Task<GetProductDetailByIdResponse> Handle(GetProductDetailByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productDetailData = await _unitOfWork.Products
                .Find(p => p.Id == request.Id)
                .AsNoTracking()
                .Include(x => x.ProductOptions)
                .Include(x => x.Images)
                .Include(p => p.ProductInCategories)
                .ProjectTo<ProductDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            ThrowError.Against(productDetailData == null, "Cannot find product detail information");
            var images = _unitOfWork.Images.GetAllImagesByObjectId(productDetailData.Id, EnumImageTypeObject.Product);
            var category = await _unitOfWork.Categories.GetCategoryListByProductId(productDetailData.Id).ProjectTo<ProductCategoryModel>(_mapperConfiguration).ToListAsync(cancellationToken);
            productDetailData.Images = _mapper.Map<List<ImageModel>>(images);
            productDetailData.ProductCategories = category;
            // TO DO: Apply promotion

            return new GetProductDetailByIdResponse
            {
                ProductDetail = productDetailData,
            };
        }
    }
}
