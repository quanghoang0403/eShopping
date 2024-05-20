using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class DisableAccountRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class DisableAccountRequestHandler : IRequestHandler<DisableAccountRequest, BaseResponseModel>
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
        public async Task<BaseResponseModel> Handle(DisableAccountRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = _userProvider.Provide();
            var account = await _unitOfWork.Accounts.GetAccountActivatedByIdAsync(request.Id);
            account.IsActivated = false;
            account.LastSavedUser = loggedUser.AccountId.Value;
            account.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();

            return BaseResponseModel.ReturnData();
        }
    }
}
