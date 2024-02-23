using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class CreateStaffRequest : IRequest<bool>
    {
        public CreateStaffRequestModel Staff { get; set; }

        public List<Guid> PermissionGroupIds { get; set; }
    }

    public class CreateStaffRequestModel
    {
        public string FullName { get; set; }

        public DateTime? Birthday { get; set; }

        public EnumGender Gender { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PhoneNumber { get; set; }

    }

    public class CreateStaffRequestHandler : IRequestHandler<CreateStaffRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public CreateStaffRequestHandler(
             IUnitOfWork unitOfWork,
             IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        /// <summary>
        /// This method is used to handle data from the request.
        /// </summary>
        /// <param name="request">Data attached from the current request.</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<bool> Handle(CreateStaffRequest request, CancellationToken cancellationToken)
        {
            // Get the current user information from the user token.
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId;

            await RequestValidation(request);

            // Create a new transaction to save data more securely, data will be restored if an error occurs.
            using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var newStaffAccount = new Account()
                {
                    Email = request.Staff.Email,
                    Password = (new PasswordHasher<Account>()).HashPassword(null, request.Staff.Password),
                    EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                    AccountType = EnumAccountType.Staff,
                    FullName = request.Staff.FullName,
                    Birthday = request.Staff.Birthday,
                    Gender = request.Staff.Gender,
                    CreatedUser = accountId,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };

                var newStaff = new Staff()
                {
                    Account = newStaffAccount,
                    CreatedUser = accountId,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };

                // Add a new staff to the database.
                await _unitOfWork.Staffs.AddAsync(newStaff);

                // Create permission for the current staff.
                List<StaffPermissionGroup> permissionGroups = new List<StaffPermissionGroup>();
                foreach (var permissionId in request.PermissionGroupIds)
                {
                    StaffPermissionGroup permissionGroup = new()
                    {
                        StaffId = newStaff.Id,
                        PermissionGroupId = permissionId,
                        CreatedUser = accountId,
                        LastSavedUser = accountId,
                        LastSavedTime = DateTime.UtcNow
                    };
                    permissionGroups.Add(permissionGroup);
                }

                // Add permission list for the current staff.
                await _unitOfWork.StaffPermissionGroup.AddRangeAsync(permissionGroups);
                await _unitOfWork.SaveChangesAsync();

                // Complete this transaction, data will be saved.
                await createStaffTransaction.CommitAsync(cancellationToken);

            }
            catch
            {
                // Data will be restored.
                await createStaffTransaction.RollbackAsync(cancellationToken);

                return false;
            }

            return true;
        }

        /// <summary>
        /// This method is used to check valid data.
        /// </summary>
        /// <param name="request">The request data.</param>
        /// <returns></returns>
        private async Task RequestValidation(CreateStaffRequest request)
        {
            // Password valid
            ThrowError.Against(string.IsNullOrEmpty(request.Staff.Password), "Password is not valid");

            // Staff phone unique inside tenant
            var staffPhoneExisted = await _unitOfWork.Accounts.
                Where(s => s.PhoneNumber == request.Staff.PhoneNumber)
                .AsNoTracking().FirstOrDefaultAsync();

            ThrowError.Against(staffPhoneExisted != null, new JObject()
            {
                { $"{nameof(request.Staff.PhoneNumber)}", "Phone is existed" },
            });

            // Staff email valid
            ThrowError.Against(!request.Staff.Email.IsValidEmail(), "Email is not valid");

            // Staff email unique inside tenant
            var staffEmailExisted = await _unitOfWork.Accounts.
                Where(s => s.Email == request.Staff.Email)
                .AsNoTracking().FirstOrDefaultAsync();

            ThrowError.Against(staffPhoneExisted != null, new JObject()
            {
                { $"{nameof(request.Staff.Email)}", "Email is existed" },
            });
        }
    }
}
