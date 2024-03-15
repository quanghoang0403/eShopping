using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Queries
{
    public class AdminGetCurrentStaffRequest : IRequest<AdminGetCurrentStaffResponse> { }

    public class AdminGetCurrentStaffResponse
    {
        public Guid StaffId { get; set; }

        public Guid AccountId { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public int Code { get; set; }

        public string Thumbnail { get; set; }
    }

    public class AdminGetStaffByAccountIdRequestHandler : IRequestHandler<AdminGetCurrentStaffRequest, AdminGetCurrentStaffResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;


        public AdminGetStaffByAccountIdRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }


        public async Task<AdminGetCurrentStaffResponse> Handle(AdminGetCurrentStaffRequest request, CancellationToken cancellationToken)
        {
            var currentUser = await _userProvider.ProvideAsync(cancellationToken);
            var userInformation = _unitOfWork.Accounts.GetIdentifier(currentUser.AccountId ?? Guid.Empty);
            var staff = _unitOfWork.Staffs.GetStaffByAccountId(currentUser.AccountId ?? Guid.Empty);
            ThrowError.Against(userInformation == null, "myAccount.notExist");

            var response = new AdminGetCurrentStaffResponse()
            {
                StaffId = staff.Id,
                AccountId = userInformation.Id,
                FullName = userInformation.FullName,
                PhoneNumber = userInformation.PhoneNumber,
                Email = userInformation.Email,
                Code = userInformation.Code,
                Thumbnail = userInformation.Thumbnail
            };

            return response;
        }
    }
}
