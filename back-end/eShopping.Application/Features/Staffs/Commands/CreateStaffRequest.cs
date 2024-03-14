using eShopping.Common.Exceptions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class CreateStaffRequest : IRequest<bool>
    {
        public string Password { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Thumbnail { get; set; }

        public string Email { get; set; }

        public EnumGender Gender { get; set; }

        public DateTime? Birthday { get; set; }

        public List<Guid> PermissionGroupIds { get; set; }
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

            CheckUniqueAndValidation(request);

            // Create a new transaction to save data more securely, data will be restored if an error occurs.
            using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var newStaffAccount = new Account()
                {
                    Email = request.Email,
                    Password = (new PasswordHasher<Account>()).HashPassword(null, request.Password),
                    EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                    AccountType = EnumAccountType.Staff,
                    FullName = request.FullName,
                    Birthday = request.Birthday,
                    Gender = request.Gender,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };
                // await _unitOfWork.Accounts.AddAsync(newStaffAccount);


                var newStaff = new Staff()
                {
                    // AccountId = newStaffAccount.Id,
                    Account = newStaffAccount,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };
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
        private void CheckUniqueAndValidation(CreateStaffRequest request)
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
