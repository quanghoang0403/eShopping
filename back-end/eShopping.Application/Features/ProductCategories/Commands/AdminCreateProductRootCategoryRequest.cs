using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
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
    public class AdminCreateProductRootCategoryRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

    }

    public class AdminCreateProductRootCategoryRequestHandler : IRequestHandler<AdminCreateProductRootCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateProductRootCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminCreateProductRootCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }

            var ProductRootCategoryNameExisted = await _unitOfWork.ProductRootCategories.GetProductRootCategoryDetailByNameAsync(request.Name);
            if (ProductRootCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("Product root category name has already existed");
            }

            var newProductRootCategory = _mapper.Map<ProductRootCategory>(request);
            var accountId = loggedUser.AccountId.Value;
            newProductRootCategory.CreatedUser = accountId;
            newProductRootCategory.CreatedTime = DateTime.Now;
            newProductRootCategory.UrlSEO = newProductRootCategory.Name.UrlEncode();
            _unitOfWork.ProductRootCategories.Add(newProductRootCategory);
            await _unitOfWork.SaveChangesAsync();

            return BaseResponseModel.ReturnData();
        }

        private static BaseResponseModel RequestValidation(AdminCreateProductRootCategoryRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product root category name");
            }
            return null;
        }
    }
}
