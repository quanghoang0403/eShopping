using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminChangeFeatureStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
        public bool IsActivate { get; set; }
    }
    public class AdminChangeFeatureStatusRequestHandler : IRequestHandler<AdminChangeFeatureStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminChangeFeatureStatusRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminChangeFeatureStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var product = await _unitOfWork.Products.GetProductByIdAsync(request.Id);

            if (product == null)
                return BaseResponseModel.ReturnError("Couldn't find product");

            product.IsFeatured = request.IsActivate;
            product.LastSavedUser = loggedUser.AccountId.Value;
            product.LastSavedTime = DateTime.Now;
            await _unitOfWork.Products.UpdateAsync(product);
            return BaseResponseModel.ReturnData();
        }
    }
}
