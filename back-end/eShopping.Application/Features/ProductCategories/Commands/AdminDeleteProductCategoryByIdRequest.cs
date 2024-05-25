using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminDeleteProductCategoryByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeleteProductCategoryRequestHandler : IRequestHandler<AdminDeleteProductCategoryByIdRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteProductCategoryRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminDeleteProductCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productCategory = await _unitOfWork.ProductCategories.Find(p => p.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (productCategory == null)
            {
                return BaseResponseModel.ReturnError("Product category is not found");
            }

            productCategory.IsDeleted = true;
            productCategory.LastSavedUser = loggedUser.AccountId.Value;
            productCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
