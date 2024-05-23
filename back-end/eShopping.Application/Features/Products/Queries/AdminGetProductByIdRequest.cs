using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Commons;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetProductByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetProductByIdRequestHandler : IRequestHandler<AdminGetProductByIdRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly MapperConfiguration _mapperConfiguration;
        private readonly IMapper _mapper;

        public AdminGetProductByIdRequestHandler(
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

        public async Task<BaseResponseModel> Handle(AdminGetProductByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ProductData = await _unitOfWork.Products
                .Find(p => p.Id == request.Id)
                .AsNoTracking()
                .Include(x => x.ProductPrices)
                .Include(x => x.Images)
                .Include(p => p.ProductCategory)
                .ProjectTo<AdminProductDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            ThrowError.Against(ProductData == null, "Cannot find product detail information");
            var images = await _unitOfWork.Images.GetAllImagesByObjectId(ProductData.Id, EnumImageTypeObject.Product);
            if (images.Count > 0)
            {
                ProductData.Images = _mapper.Map<List<AdminImageModel>>(images);
            }

            return BaseResponseModel.ReturnData(ProductData);
        }
    }
}
