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
    public class AdminGetProductCategoryByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminGetProductCategoryByIdRequestHandler : IRequestHandler<AdminGetProductCategoryByIdRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductCategoryByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminGetProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategoryData = await _unitOfWork.ProductCategories.GetProductCategoryDetailByIdAsync(request.Id);
            if (productCategoryData == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category information");
            }

            var productCategory = _mapper.Map<AdminProductCategoryDetailModel>(productCategoryData);
            productCategory.Products = _mapper.Map<List<AdminProductSelectedModel>>(productCategoryData.Products.OrderBy(x => x.Priority));
            return BaseResponseModel.ReturnData(productCategory);
        }
    }
}
