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

    public class AdminSelfUpdateStaffRequest : IRequest<BaseResponseModel>
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

    public class AdminSelfUpdateStaffRequestHandler : IRequestHandler<AdminSelfUpdateStaffRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminSelfUpdateStaffRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminSelfUpdateStaffRequest request, CancellationToken cancellationToken)
        {
            // Get the current user information from the user token.
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            Account account = await _unitOfWork.Accounts.GetAccountActivatedByIdAsync(loggedUser.AccountId ?? Guid.Empty);
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
            // all permissions before update
            var allStaffPermissions = await _unitOfWork.StaffPermission.GetStaffPermissionsByStaffId(request.StaffId);

            // update permissions
            if (request.PermissionIds.Any())
            {
                // remove unused permissions
                var unusedStaffPermissions = allStaffPermissions.Where(x => !request.PermissionIds.Any(pn => pn == x.PermissionId));
                _unitOfWork.StaffPermission.RemoveRange(unusedStaffPermissions);

                // add new permissions
                var newStaffPermissionIds = request.PermissionIds.Where(p => !allStaffPermissions.Any(x => x.PermissionId == p));
                var newStaffPermissionsToDB = new List<StaffPermission>();
                foreach (var permissionId in newStaffPermissionIds)
                {
                    var newProductVariant = new StaffPermission()
                    {
                        StaffId = request.StaffId,
                        PermissionId = permissionId,
                        CreatedUser = loggedUser.AccountId.Value,
                        CreatedTime = DateTime.Now
                    };
                    newStaffPermissionsToDB.Add(newProductVariant);
                    await _unitOfWork.StaffPermission.AddRangeAsync(newStaffPermissionsToDB);
                }
            }
            #endregion

            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }

        private BaseResponseModel CheckUniqueAndValidation(AdminSelfUpdateStaffRequest request, Guid aid)
        {
            if (string.IsNullOrEmpty(request.FullName))
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                return BaseResponseModel.ReturnError("Phone number is existed");
            }

            var phoneExisted = _unitOfWork.Accounts.CheckAccountByPhone(request.PhoneNumber.Trim());
            if (phoneExisted)
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExisted = _unitOfWork.Accounts.CheckAccountByEmail(request.Email.Trim());
                if (emailExisted)
                {
                    return BaseResponseModel.ReturnError("Email is existed");
                }
            }
            return null;
        }
    }
}
