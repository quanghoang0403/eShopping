using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminCreateProductCategoryRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public Guid ProductRootCategoryId { get; set; }
    }

    public class AdminCreateProductCategoryRequestHandler : IRequestHandler<AdminCreateProductCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateProductCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminCreateProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }

            var productCategoryNameExisted = await _unitOfWork.ProductCategories.GetProductCategoryDetailByNameAsync(request.Name);
            if (productCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("Product category name has already existed");
            }

            var newProductCategory = _mapper.Map<ProductCategory>(request);
            var accountId = loggedUser.AccountId.Value;
            newProductCategory.CreatedUser = accountId;
            newProductCategory.CreatedTime = DateTime.Now;
            newProductCategory.UrlSEO = newProductCategory.Name.UrlEncode();
            _unitOfWork.ProductCategories.Add(newProductCategory);
            await _unitOfWork.SaveChangesAsync();

            return BaseResponseModel.ReturnData();
        }

        private static BaseResponseModel RequestValidation(AdminCreateProductCategoryRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product category name");
            }
            return null;
        }
    }
}
