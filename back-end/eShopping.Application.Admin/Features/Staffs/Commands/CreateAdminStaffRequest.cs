using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Email;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class CreateAdminStaffRequest : IRequest<bool>
    {
    }

    public class CreateAdminStaffRequestHandler : IRequestHandler<CreateAdminStaffRequest, bool>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateAdminStaffRequestHandler(
             IUnitOfWork unitOfWork,
             IUserProvider userProvider,
             IEmailSenderProvider emailProvider
        )
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// This method is used to handle data from the request.
        /// </summary>
        /// <param name="request">Data attached from the current request.</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<bool> Handle(CreateAdminStaffRequest request, CancellationToken cancellationToken)
        {
            using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var newStaffAccount = new Account()
                {
                    Email = "admin@gmail.com",
                    FullName = "Admin",
                    Birthday = DateTime.Now,
                    Gender = EnumGender.Male,
                    Password = (new PasswordHasher<Account>()).HashPassword(null, "1"),
                    EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                    AccountType = EnumAccountType.Staff
                };

                var newStaff = new Staff()
                {
                    Account = newStaffAccount,
                };

                // Add a new staff to the database.
                await _unitOfWork.Staffs.AddAsync(newStaff);

                // Create permission for the current staff.
                List<StaffPermissionGroup> permissionGroups = new()
                {
                    new StaffPermissionGroup()
                    {
                        StaffId = newStaff.Id,
                        PermissionGroupId = EnumPermissionGroup.Admin.ToGuid()
                    }
                };

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
    }
}
