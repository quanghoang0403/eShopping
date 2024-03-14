using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class DisableAccountRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class DisableAccountRequestHandler : IRequestHandler<DisableAccountRequest, bool>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;

        public DisableAccountRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork
            )
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// This method is used to handle the current HTTP request.
        /// </summary>
        /// <param name="request">Data is mapped from the HTTP request.</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns>Boolean</returns>
        public async Task<bool> Handle(DisableAccountRequest request, CancellationToken cancellationToken)
        {
            var loggerUser = _userProvider.Provide();
            var account = await _unitOfWork.Accounts.GetAccountActivatedByIdAsync(request.Id);
            account.IsActivated = false;
            account.LastSavedUser = loggerUser.Id.Value;
            account.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
