using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class DeleteCustomerByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class DeleteCustomerRequestHandler : IRequestHandler<DeleteCustomerByIdRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public DeleteCustomerRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(DeleteCustomerByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var customer = await _unitOfWork.Customers.Where(m => m.Id == request.Id).FirstOrDefaultAsync(cancellationToken: cancellationToken); ;
            ThrowError.Against(customer == null, "Customer is not found");
            customer.IsDeleted = true;
            customer.LastSavedUser = loggedUser.AccountId.Value;
            customer.LastSavedTime = DateTime.UtcNow;

            var customerAccount = await _unitOfWork.Accounts.GetIdentifierAsync(customer.AccountId);
            customerAccount.IsDeleted = true;
            customerAccount.LastSavedUser = loggedUser.AccountId.Value;
            customerAccount.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
