using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetProductRootCategoryByUrlRequest : IRequest<BaseResponseModel>
    {
        public string Url { get; set; }
    }

    public class StoreGetProductRootCategoryByUrlRequestHandler : IRequestHandler<StoreGetProductRootCategoryByUrlRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetProductRootCategoryByUrlRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetProductRootCategoryByUrlRequest request, CancellationToken cancellationToken)
        {
            var ProductRootCategoryData = await _unitOfWork.ProductRootCategories.GetProductRootCategoryDetailByUrlAsync(request.Url);
            if (ProductRootCategoryData == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category information");
            }

            var ProductRootCategory = _mapper.Map<StoreProductRootCategoryDetailModel>(ProductRootCategoryData);
            return BaseResponseModel.ReturnData(ProductRootCategory);
        }
    }
}
