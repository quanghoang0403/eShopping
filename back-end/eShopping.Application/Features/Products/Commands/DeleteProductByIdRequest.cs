using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Products.Commands
{
    public class DeleteProductByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class DeactivateProductByIdRequestHandler : IRequestHandler<DeleteProductByIdRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public DeactivateProductByIdRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(DeleteProductByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var product = await _unitOfWork.Products.GetProductByIdAsync(request.Id);
            ThrowError.Against(product == null, "Product is not found");
            var accountId = loggedUser.AccountId.Value;
            product.IsDeleted = true;
            product.LastSavedUser = accountId;
            product.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
