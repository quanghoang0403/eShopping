using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetProductCategoryByUrlRequest : IRequest<BaseResponseModel>
    {
        public string Url { get; set; }
    }

    public class StoreGetProductCategoryByUrlRequestHandler : IRequestHandler<StoreGetProductCategoryByUrlRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(StoreGetProductCategoryByUrlRequest request, CancellationToken cancellationToken)
        {
            var productCategoryData = await _unitOfWork.ProductCategories.Where(p => p.UrlSEO == request.Url && p.IsActive).FirstOrDefaultAsync(cancellationToken);
            if (productCategoryData == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category information");
            }

            var productCategory = _mapper.Map<StoreProductCategoryDetailModel>(productCategoryData);
            return BaseResponseModel.ReturnData(productCategory);
        }
    }
}
