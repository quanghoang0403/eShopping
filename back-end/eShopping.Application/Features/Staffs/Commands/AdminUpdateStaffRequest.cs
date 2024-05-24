using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class AdminUpdateStaffRequest : IRequest<BaseResponseModel>
    {
        public Guid StaffId { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Thumbnail { get; set; }

        public string Email { get; set; }

        public EnumGender Gender { get; set; }

        public DateTime? Birthday { get; set; }

        public List<Guid> PermissionIds { get; set; }
    }
    public class AdminUpdateStaffRequestHandler : IRequestHandler<AdminUpdateStaffRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminUpdateStaffRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateStaffRequest request, CancellationToken cancellationToken)
        {
            // Get the current user information from the user token.
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            Staff staff = await _unitOfWork.Staffs.GetStaffByIdAsync(request.StaffId);
            Account account = staff.Account;
            if (account == null)
            {
                BaseResponseModel.ReturnError("Account is not exist or was inactive");
            }

            if (CheckUniqueAndValidation(request, account.Id) != null)
            {
                return CheckUniqueAndValidation(request, account.Id);
            }

            account.FullName = request.FullName;
            account.PhoneNumber = request.PhoneNumber;
            account.Thumbnail = request.Thumbnail;
            account.Gender = request.Gender;
            account.Email = request.Email;
            account.Birthday = request.Birthday;
            account.LastSavedUser = loggedUser.AccountId.Value;
            account.LastSavedTime = DateTime.Now;

            #region Handle update permissions

            // update permissions

            // remove unused permissions
            var unusedStaffPermissions = staff.StaffPermissions.Where(x => !request.PermissionIds.Any(pn => pn == x.PermissionId));
            _unitOfWork.StaffPermission.RemoveRange(unusedStaffPermissions);

            // add new permissions
            var newStaffPermissionIds = request.PermissionIds.Where(p => !staff.StaffPermissions.Any(x => x.PermissionId == p));
            var newStaffPermissionsToDB = new List<StaffPermission>();
            foreach (var permissionId in newStaffPermissionIds)
            {
                var newProductPrice = new StaffPermission()
                {
                    StaffId = request.StaffId,
                    PermissionId = permissionId,
                    CreatedUser = loggedUser.AccountId.Value,
                    CreatedTime = DateTime.Now
                };
                newStaffPermissionsToDB.Add(newProductPrice);

            }
            await _unitOfWork.StaffPermission.AddRangeAsync(newStaffPermissionsToDB);

            #endregion

            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
        private BaseResponseModel CheckUniqueAndValidation(AdminUpdateStaffRequest request, Guid accountId)
        {
            if (string.IsNullOrEmpty(request.FullName))
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                return BaseResponseModel.ReturnError("Phone number is existed");
            }

            var phoneExisted = _unitOfWork.Accounts.CheckAccountByPhone(request.PhoneNumber.Trim(), accountId);
            if (phoneExisted)
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExisted = _unitOfWork.Accounts.CheckAccountByEmail(request.Email.Trim(), accountId);
                if (emailExisted)
                {
                    return BaseResponseModel.ReturnError("Email is existed");
                }
            }
            return null;
        }
    }
}
