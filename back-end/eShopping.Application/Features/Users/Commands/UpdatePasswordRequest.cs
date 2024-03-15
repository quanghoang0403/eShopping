using eShopping.Common.Exceptions;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class UpdatePasswordRequest : IRequest<bool>
    {
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
    }

    public class UpdatePasswordHandler : IRequestHandler<UpdatePasswordRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public UpdatePasswordHandler(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(UpdatePasswordRequest request, CancellationToken cancellationToken)
        {
            ThrowError.ArgumentIsNull(request, request.CurrentPassword);
            ThrowError.ArgumentIsNull(request, request.NewPassword);
            ThrowError.ArgumentIsNull(request, request.ConfirmPassword);
            ThrowError.Against(request.NewPassword != request.ConfirmPassword, new JObject()
            {
                { $"{nameof(request.NewPassword)} && {nameof(request.ConfirmPassword)}", "The new password and confirmation password does not match" },
            });

            var loggedUser = _userProvider.Provide();
            if (loggedUser == null)
            {
                ThrowError.Against(!loggedUser.AccountId.HasValue, "Cannot find account information");
            }

            var hasher = new PasswordHasher<Account>();

            Account account = _unitOfWork.Accounts.Find(a => a.Id == loggedUser.AccountId).FirstOrDefaultAsync().Result;
            var verified = hasher.VerifyHashedPassword(null, account.Password, request.CurrentPassword);

            ThrowError.Against(verified == PasswordVerificationResult.Failed, new JObject()
            {
                { $"{nameof(request.CurrentPassword)}", "Password invalid" },
            });

            var passwordHash = (new PasswordHasher<Account>()).HashPassword(null, request.NewPassword);
            account.Password = passwordHash;

            _unitOfWork.Accounts.Update(account);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
