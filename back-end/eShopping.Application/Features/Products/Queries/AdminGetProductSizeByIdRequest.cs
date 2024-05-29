using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetProductSizeByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }

    }
    public class AdminGetProductSizeByIdRequestHanlder : IRequestHandler<AdminGetProductSizeByIdRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetProductSizeByIdRequestHanlder(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            MapperConfiguration mapperConfiguration,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
        }
        public async Task<BaseResponseModel> Handle(AdminGetProductSizeByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ProductSizeData = await _unitOfWork.ProductSizes
                .Find(p => p.Id == request.Id)
                .AsNoTracking()
                .Include(ps => ps.ProductSizeCategory)
                .ProjectTo<AdminProductSizeDetailModel>(_mapperConfiguration)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (ProductSizeData == null)
            {
                return BaseResponseModel.ReturnError("Product size not found");
            }
            return BaseResponseModel.ReturnData(ProductSizeData);
        }
    }
}
