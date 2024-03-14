using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{

    public class UpdateStaffRequest : IRequest<bool>
    {
        public Guid StaffId { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Thumbnail { get; set; }

        public string Email { get; set; }

        public EnumGender Gender { get; set; }

        public DateTime? Birthday { get; set; }

        public List<Guid> PermissionGroupIds { get; set; }
    }

    public class UpdateStaffRequestHandler : IRequestHandler<UpdateStaffRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public UpdateStaffRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateStaffRequest request, CancellationToken cancellationToken)
        {
            // Get the current user information from the user token.
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            Account account = await _unitOfWork.Accounts.GetAccountActivatedByIdAsync(loggedUser.Id ?? Guid.Empty);
            ThrowError.Against(account == null, "Account is not exist or was inactive");

            CheckUniqueAndValidation(request);

            account.FullName = request.FullName;
            account.PhoneNumber = request.PhoneNumber;
            account.Thumbnail = request.Thumbnail;
            account.Gender = request.Gender;
            account.Email = request.Email;
            account.Birthday = request.Birthday;
            account.LastSavedUser = loggedUser.AccountId.Value;
            account.LastSavedTime = DateTime.UtcNow;

            #region Handle update permissions
            // all permissions before update
            var allStaffPermissions = await _unitOfWork.StaffPermissionGroup.GetStaffGroupPermissionByStaffId(request.StaffId);

            // update permissions
            if (request.PermissionGroupIds.Any())
            {
                // remove unused permissions
                var unusedStaffPermissions = allStaffPermissions.Where(x => !request.PermissionGroupIds.Any(pn => pn == x.Id));
                _unitOfWork.StaffPermissionGroup.RemoveRange(unusedStaffPermissions);

                // add new permissions
                var newStaffPermissionIds = request.PermissionGroupIds.Where(p => !allStaffPermissions.Any(x => x.Id == p));
                var newStaffPermissionsToDB = new List<StaffPermissionGroup>();
                foreach (var permissionId in newStaffPermissionIds)
                {
                    var newProductPrice = new StaffPermissionGroup()
                    {
                        StaffId = request.StaffId,
                        PermissionGroupId = permissionId,
                        CreatedUser = loggedUser.AccountId.Value,
                        CreatedTime = DateTime.UtcNow
                    };
                    newStaffPermissionsToDB.Add(newProductPrice);
                    await _unitOfWork.StaffPermissionGroup.AddRangeAsync(newStaffPermissionsToDB);
                }
            }
            #endregion

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private void CheckUniqueAndValidation(UpdateStaffRequest request)
        {
            ThrowError.Against(string.IsNullOrEmpty(request.FullName), new JObject()
            {
                { $"{nameof(request.FullName)}",   "Please enter fullName"},
            });

            ThrowError.Against(string.IsNullOrEmpty(request.PhoneNumber), new JObject()
            {
                { $"{nameof(request.PhoneNumber)}",  "Please enter phone"},
            });

            var phoneExisted = _unitOfWork.Accounts.CheckAccountByPhone(request.PhoneNumber.Trim());
            ThrowError.Against(phoneExisted == true, new JObject()
            {
                { $"{nameof(request.PhoneNumber)}",  "Phone number is existed"},
            });

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExisted = _unitOfWork.Accounts.CheckAccountByEmail(request.Email.Trim());
                ThrowError.Against(emailExisted == true, new JObject()
                {
                    { $"{nameof(request.Email)}",  "Email is existed"},
                });
            }
        }
    }
}
