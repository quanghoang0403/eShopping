using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class AdminUpdateStaffStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminUpdateStaffStatusRequestHandler : IRequestHandler<AdminUpdateStaffStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminUpdateStaffStatusRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateStaffStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var staff = await _unitOfWork.Staffs.GetStaffByIdAsync(request.Id);
            var account = staff.Account;
            if (staff == null)
            {
                return BaseResponseModel.ReturnError("Cannot find staff");
            }
            if (account == null)
            {
                BaseResponseModel.ReturnError("Account is not exist or was inactive");
            }
            account.IsActive = !account.IsActive;
            staff.IsActive = !staff.IsActive;
            staff.LastSavedUser = loggedUser.AccountId.Value;
            staff.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
