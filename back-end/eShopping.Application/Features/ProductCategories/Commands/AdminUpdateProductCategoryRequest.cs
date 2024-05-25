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
    public class AdminUpdateProductCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }

        public Guid ProductRootCategoryId { get; set; }
    }


    public class AdminUpdateProductCategoryRequestHandler : IRequestHandler<AdminUpdateProductCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminUpdateProductCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminUpdateProductCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategory = await _unitOfWork.ProductCategories.Where(c => c.Id == request.Id).AsNoTracking().FirstOrDefaultAsync();
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }
            if (productCategory == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category information");
            }

            var productCategoryNameExisted = await _unitOfWork.ProductCategories.Where(p => p.Id != request.Id && p.Name.Trim().ToLower().Equals(request.Name.Trim().ToLower())).AsNoTracking().FirstOrDefaultAsync();
            if (productCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("Product category name has already existed");
            }

            var modifiedProductCategory = _mapper.Map<ProductCategory>(request);
            modifiedProductCategory.LastSavedUser = loggedUser.AccountId.Value;
            modifiedProductCategory.LastSavedTime = DateTime.Now;
            modifiedProductCategory.UrlSEO = modifiedProductCategory.Name.UrlEncode();

            await _unitOfWork.ProductCategories.UpdateAsync(modifiedProductCategory);
            await _unitOfWork.SaveChangesAsync();

            return BaseResponseModel.ReturnData();
        }

        private static BaseResponseModel RequestValidation(AdminUpdateProductCategoryRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product category name");
            }
            return null;
        }
    }
}
