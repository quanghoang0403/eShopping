using AutoMapper;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminUpdateProductRootCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }

        public bool IsActive { get; set; }
        public string Name { get; set; }

        public int Priority { get; set; }

        public string Content { get; set; }

        public string KeywordSEO { get; set; }

        public string UrlSEO { get; set; }

        public string TitleSEO { get; set; }

        public string DescriptionSEO { get; set; }

        public string Description { get; set; }

        public EnumGenderProduct GenderProduct { get; set; }
    }

    public class AdminUpdateProductRootCategoryRequestHandler : IRequestHandler<AdminUpdateProductRootCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminUpdateProductRootCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminUpdateProductRootCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ProductRootCategory = await _unitOfWork.ProductRootCategories.Where(c => c.Id == request.Id).AsNoTracking().FirstOrDefaultAsync();
            if (RequestValidation(request) != null)
            {
                return RequestValidation(request);
            }
            if (ProductRootCategory == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category information");
            }

            var ProductRootCategoryNameExisted = await _unitOfWork.ProductRootCategories.Where(p => p.Id != request.Id && p.Name.Trim().ToLower().Equals(request.Name.Trim().ToLower())).AsNoTracking().FirstOrDefaultAsync();
            if (ProductRootCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("Product category name has already existed");
            }

            var modifiedProductRootCategory = _mapper.Map<ProductRootCategory>(request);
            modifiedProductRootCategory.LastSavedUser = loggedUser.AccountId.Value;
            modifiedProductRootCategory.LastSavedTime = DateTime.Now;
            modifiedProductRootCategory.UrlSEO = modifiedProductRootCategory.Name.UrlEncode();

            await _unitOfWork.ProductRootCategories.UpdateAsync(modifiedProductRootCategory);
            await _unitOfWork.SaveChangesAsync();

            return BaseResponseModel.ReturnData();
        }

        private static BaseResponseModel RequestValidation(AdminUpdateProductRootCategoryRequest request)
        {
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please enter product category name");
            }
            return null;
        }
    }
}
