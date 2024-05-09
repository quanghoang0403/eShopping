using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminChangeFeatureStatusRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
        public bool IsActivate { get; set; }
    }
    public class AdminChangeFeatureStatusRequestHandler : IRequestHandler<AdminChangeFeatureStatusRequest, bool>
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
        public async Task<bool> Handle(AdminChangeFeatureStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var product = await _unitOfWork.Products.GetProductByIdAsync(request.Id);
            ThrowError.Against(product == null, "Couldn't find product");
            product.IsFeatured = request.IsActivate;
            product.LastSavedUser = loggedUser.AccountId.Value;
            product.LastSavedTime = DateTime.Now;
            await _unitOfWork.Products.UpdateAsync(product);
            return true;
        }
    }
}
