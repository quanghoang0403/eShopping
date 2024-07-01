using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminUpdateProductRootCategoryStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminUpdateProductRootCategoryStatusRequestHandler : IRequestHandler<AdminUpdateProductRootCategoryStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminUpdateProductRootCategoryStatusRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateProductRootCategoryStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var productRootCategory = await _unitOfWork.ProductRootCategories.Where(pc => pc.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            if (productRootCategory == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product root category");
            }
            productRootCategory.IsActive = !productRootCategory.IsActive;
            productRootCategory.LastSavedUser = loggedUser.AccountId.Value;
            productRootCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.ProductRootCategories.UpdateAsync(productRootCategory);
            return BaseResponseModel.ReturnData();
        }
    }
}
