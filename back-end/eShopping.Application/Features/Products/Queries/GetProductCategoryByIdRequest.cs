using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class GetProductCategoryByIdRequest : IRequest<GetProductCategoryByIdResponse>
    {
        public Guid? Id { get; set; }
    }

    public class GetProductCategoryByIdResponse
    {
        public ProductCategoryDetailModel ProductCategory { get; set; }
    }

    public class GetProductCategoryByIdRequestHandler : IRequestHandler<GetProductCategoryByIdRequest, GetProductCategoryByIdResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetProductCategoryByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetProductCategoryByIdResponse> Handle(GetProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategoryData = await _unitOfWork.Categories.GetCategoryDetailByIdAsync(request.Id.Value);
            ThrowError.Against(productCategoryData == null, "Cannot find product category information");

            var productCategory = _mapper.Map<ProductCategoryDetailModel>(productCategoryData);
            productCategory.Products = productCategoryData.ProductInCategories
                .Select(x => new ProductCategoryDetailModel.ProductSelectedModel
                {
                    Id = x.ProductId,
                    Name = x.Product.Name,
                    Priority = x.Product.Priority,
                    Thumbnail = x.Product?.Thumbnail,
                })
                .OrderByDescending(x => x.Priority)
                .ToList();

            return new GetProductCategoryByIdResponse
            {
                ProductCategory = productCategory
            };
        }
    }
}
