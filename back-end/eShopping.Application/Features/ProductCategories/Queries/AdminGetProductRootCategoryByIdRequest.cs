using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetProductRootCategoryByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetProductRootCategoryByIdRequestHandler : IRequestHandler<AdminGetProductRootCategoryByIdRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductRootCategoryByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminGetProductRootCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ProductRootCategoryData = await _unitOfWork.ProductRootCategories.GetProductRootCategoryDetailByIdAsync(request.Id);
            if (ProductRootCategoryData == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category information");
            }

            var ProductRootCategory = _mapper.Map<AdminProductRootCategoryDetailModel>(ProductRootCategoryData);
            ProductRootCategory.Products = _mapper.Map<IEnumerable<AdminProductSelectedModel>>(ProductRootCategoryData.Products.OrderBy(x => x.Priority));
            ProductRootCategory.ProductCategories = _mapper.Map<IEnumerable<AdminProductCategorySelectedModel>>(ProductRootCategoryData.ProductCategories.OrderBy(x => x.Priority));
            return BaseResponseModel.ReturnData(ProductRootCategory);
        }
    }
}
