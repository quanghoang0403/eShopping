using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class AdminDeleteStaffByIdRequest : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeleteStaffByIdRequestHandler : IRequestHandler<AdminDeleteStaffByIdRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteStaffByIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(AdminDeleteStaffByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var staff = await _unitOfWork.Staffs.Where(m => m.Id == request.Id).FirstOrDefaultAsync(cancellationToken: cancellationToken); ;
            ThrowError.Against(staff == null, "Staff is not found");
            staff.IsDeleted = true;
            staff.LastSavedUser = loggedUser.AccountId.Value;
            staff.LastSavedTime = DateTime.UtcNow;

            var staffAccount = await _unitOfWork.Accounts.GetIdentifierAsync(staff.AccountId);
            staffAccount.IsDeleted = true;
            staffAccount.LastSavedUser = loggedUser.AccountId.Value;
            staffAccount.LastSavedTime = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }

}
