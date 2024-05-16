using eShopping.Application.Providers.Email;
using eShopping.Common.Exceptions;
using eShopping.Common.Helpers;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Domain.Settings;
using eShopping.Email;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Commands
{
    public class AdminCreateStaffRequest : IRequest<bool>
    {

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Thumbnail { get; set; }

        public string Email { get; set; }

        public EnumGender Gender { get; set; }

        public DateTime? Birthday { get; set; }

        public List<Guid> PermissionIds { get; set; }
    }

    public class AdminCreateStaffRequestHandler : IRequestHandler<AdminCreateStaffRequest, bool>
    {
        private readonly DomainFE _domainFE;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IEmailSenderProvider _emailProvider;

        public AdminCreateStaffRequestHandler(
             IOptions<DomainFE> domainFE,
             IUnitOfWork unitOfWork,
             IUserProvider userProvider,
             IEmailSenderProvider emailProvider
        )
        {
            _domainFE = domainFE.Value;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _emailProvider = emailProvider;
        }

        /// <summary>
        /// This method is used to handle data from the request.
        /// </summary>
        /// <param name="request">Data attached from the current request.</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<bool> Handle(AdminCreateStaffRequest request, CancellationToken cancellationToken)
        {
            // Get the current user information from the user token.
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId;

            CheckUniqueAndValidation(request);

            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                // Create a new transaction to save data more securely, data will be restored if an error occurs.
                using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    // Generate the user's password.
                    var password = StringHelpers.GeneratePassword();
                    var newStaffAccount = new Account()
                    {
                        Email = request.Email,
                        Password = (new PasswordHasher<Account>()).HashPassword(null, password),
                        EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                        AccountType = EnumAccountType.Staff,
                        FullName = request.FullName,
                        Birthday = request.Birthday,
                        Gender = request.Gender,
                        LastSavedUser = accountId,
                        LastSavedTime = DateTime.Now,
                        PhoneNumber = request.PhoneNumber,
                        Thumbnail = request.Thumbnail
                    };
                    // await _unitOfWork.Accounts.AddAsync(newStaffAccount);


                    var newStaff = new Staff()
                    {
                        // AccountId = newStaffAccount.Id,
                        Account = newStaffAccount,
                        LastSavedUser = accountId,
                        LastSavedTime = DateTime.Now
                    };
                    await _unitOfWork.Staffs.AddAsync(newStaff);

                    // Create permission for the current staff.
                    List<StaffPermission> permissionGroups = new();
                    foreach (var permissionId in request.PermissionIds)
                    {
                        StaffPermission permissionGroup = new()
                        {
                            StaffId = newStaff.Id,
                            PermissionId = permissionId,
                            CreatedUser = accountId,
                            LastSavedUser = accountId,
                            LastSavedTime = DateTime.Now
                        };
                        permissionGroups.Add(permissionGroup);
                    }

                    // Add permission list for the current staff.
                    await _unitOfWork.StaffPermission.AddRangeAsync(permissionGroups);
                    await _unitOfWork.SaveChangesAsync();

                    // Complete this transaction, data will be saved.
                    await createStaffTransaction.CommitAsync(cancellationToken);
                    await SendEmailPasswordAsync(request.FullName, request.Email, password);

                }
                catch
                {
                    // Data will be restored.
                    await createStaffTransaction.RollbackAsync(cancellationToken);

                    return false;
                }

                return true;
            });
        }

        /// <summary>
        /// This method is used to send a email to the current staff when the data has been saved successfully.
        /// </summary>
        /// <param name="emailAddress">Staff's email, for example: staff001@gmail.com</param>
        /// <param name="password">Staff's temporary password.</param>
        /// <returns></returns>
        private async Task SendEmailPasswordAsync(string fullName, string emailAddress, string password)
        {
            ResourceManager myManager = new("eShopping.Application.Providers.Email.EmailTemplate", Assembly.GetExecutingAssembly());
            var link = $"{_domainFE.AdminWeb}/login?email={emailAddress?.Trim()}";
            string subject = $"Chào bạn đến với {EmailTemplates.SHOP_NAME}";

            string htmlFromResource = myManager.GetString(EmailTemplates.REGISTER_NEW_ADMIN_ACCOUNT);
            string htmlContext = string.Format(htmlFromResource, EmailTemplates.SHOP_NAME, fullName, emailAddress, password, link);

            await _emailProvider.SendEmailAsync(subject, htmlContext, emailAddress);
        }

        /// <summary>
        /// This method is used to check valid data.
        /// </summary>
        /// <param name="request">The request data.</param>
        /// <returns></returns>
        private void CheckUniqueAndValidation(AdminCreateStaffRequest request)
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
