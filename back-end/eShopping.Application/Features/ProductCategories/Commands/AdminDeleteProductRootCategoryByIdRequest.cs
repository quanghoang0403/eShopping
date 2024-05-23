using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminDeleteProductRootCategoryByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeleteProductRootCategoryRequestHandler : IRequestHandler<AdminDeleteProductRootCategoryByIdRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteProductRootCategoryRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminDeleteProductRootCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var ProductRootCategory = await _unitOfWork.ProductRootCategories.Find(p => p.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (ProductRootCategory == null)
            {
                return BaseResponseModel.ReturnError("Product category is not found");
            }

            ProductRootCategory.IsDeleted = true;
            ProductRootCategory.LastSavedUser = loggedUser.AccountId.Value;
            ProductRootCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
