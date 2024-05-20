using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class UpdatePasswordRequest : IRequest<BaseResponseModel>
    {
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }

        public string ConfirmPassword { get; set; }
    }

    public class UpdatePasswordHandler : IRequestHandler<UpdatePasswordRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public UpdatePasswordHandler(IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(UpdatePasswordRequest request, CancellationToken cancellationToken)
        {
            if (request.CurrentPassword == null || request.NewPassword == null || request.ConfirmPassword == null)
            {
                return BaseResponseModel.ReturnError("Password is required");
            }
            if (request.NewPassword != request.ConfirmPassword)
            {
                return BaseResponseModel.ReturnError("The new password and confirmation password does not match");
            }

            var loggedUser = _userProvider.Provide();
            if (loggedUser == null)
            {
                if (!loggedUser.AccountId.HasValue)
                {
                    return BaseResponseModel.ReturnError("Cannot find account information");
                }

            }

            var hasher = new PasswordHasher<Account>();

            Account account = _unitOfWork.Accounts.Find(a => a.Id == loggedUser.AccountId).FirstOrDefaultAsync().Result;
            var verified = hasher.VerifyHashedPassword(null, account.Password, request.CurrentPassword);
            if (verified == PasswordVerificationResult.Failed)
            {
                return BaseResponseModel.ReturnError("Password invalid");
            }

            var passwordHash = new PasswordHasher<Account>().HashPassword(null, request.NewPassword);
            account.Password = passwordHash;

            _unitOfWork.Accounts.Update(account);
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
