using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminDeleteProductSizeRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminDeleteProductSizeRequestHandler : IRequestHandler<AdminDeleteProductSizeRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteProductSizeRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminDeleteProductSizeRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var productSize = await _unitOfWork.ProductSizes.Find(ps => ps.Id == request.Id).FirstOrDefaultAsync(cancellationToken);
            if (productSize == null)
            {
                return BaseResponseModel.ReturnError("Product size not found");
            }
            productSize.IsDeleted = true;
            productSize.LastSavedUser = loggedUser.AccountId.Value;
            productSize.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
