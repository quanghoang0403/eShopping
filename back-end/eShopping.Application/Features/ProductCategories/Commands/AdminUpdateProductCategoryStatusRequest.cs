using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminUpdateProductCategoryStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminUpdateProductCategoryStatusRequestHandler : IRequestHandler<AdminUpdateProductCategoryStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminUpdateProductCategoryStatusRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateProductCategoryStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var productCategory = await _unitOfWork.ProductCategories.Where(pc => pc.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            if (productCategory == null)
            {
                return BaseResponseModel.ReturnError("Cannot find product category");
            }
            productCategory.IsActive = !productCategory.IsActive;
            productCategory.LastSavedUser = loggedUser.AccountId.Value;
            productCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.ProductCategories.UpdateAsync(productCategory);
            return BaseResponseModel.ReturnData();
        }
    }
}
