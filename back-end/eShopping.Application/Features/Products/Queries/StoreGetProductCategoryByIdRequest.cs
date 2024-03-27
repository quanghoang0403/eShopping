using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductCategoryByIdRequest : IRequest<StoreGetProductCategoryByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class StoreGetProductCategoryByIdResponse
    {
        public StoreProductCategoryDetailModel ProductCategory { get; set; }
    }

    public class StoreGetProductCategoryByIdRequestHandler : IRequestHandler<StoreGetProductCategoryByIdRequest, StoreGetProductCategoryByIdResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetProductCategoryByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<StoreGetProductCategoryByIdResponse> Handle(StoreGetProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategoryData = await _unitOfWork.ProductCategories.GetProductCategoryDetailByIdAsync(request.Id);
            ThrowError.Against(productCategoryData == null, "Cannot find product category information");

            var productCategory = _mapper.Map<StoreProductCategoryDetailModel>(productCategoryData);
            return new StoreGetProductCategoryByIdResponse
            {
                ProductCategory = productCategory
            };
        }
    }
}
