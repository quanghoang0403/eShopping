using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class StoreGetProductCategoryByUrlRequest : IRequest<StoreGetProductCategoryByUrlResponse>
    {
        public string Url { get; set; }
    }

    public class StoreGetProductCategoryByUrlResponse
    {
        public StoreProductCategoryDetailModel ProductCategory { get; set; }
    }

    public class StoreGetProductCategoryByUrlRequestHandler : IRequestHandler<StoreGetProductCategoryByUrlRequest, StoreGetProductCategoryByUrlResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetProductCategoryByUrlRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<StoreGetProductCategoryByUrlResponse> Handle(StoreGetProductCategoryByUrlRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategoryData = await _unitOfWork.ProductCategories.GetProductCategoryDetailByUrlAsync(request.Url);
            ThrowError.Against(productCategoryData == null, "Cannot find product category information");

            var productCategory = _mapper.Map<StoreProductCategoryDetailModel>(productCategoryData);
            return new StoreGetProductCategoryByUrlResponse
            {
                ProductCategory = productCategory
            };
        }
    }
}
