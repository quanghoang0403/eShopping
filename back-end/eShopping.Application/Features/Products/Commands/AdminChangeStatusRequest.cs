using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminChangeStatusRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class AdminChangeStatusRequestHandler : IRequestHandler<AdminChangeStatusRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminChangeStatusRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(AdminChangeStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var product = await _unitOfWork.Products.GetProductByIdAsync(request.Id);
            product.Status = product.Status == EnumStatus.Active ? EnumStatus.InActive : EnumStatus.Active;
            product.LastSavedUser = loggedUser.AccountId.Value;
            product.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.Products.UpdateAsync(product);
            return true;
        }
    }
}
