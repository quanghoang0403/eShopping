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
using System.Reflection;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class CreateCustomerRequest : IRequest<bool>
    {
        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public DateTime? Birthday { get; set; }

        public EnumGender Gender { get; set; }

        public int? CityId { get; set; }

        public int? DistrictId { get; set; }

        public int? WardId { get; set; }

        public string Address { get; set; }
    }

    public class CreateCustomerHandler : IRequestHandler<CreateCustomerRequest, bool>
    {
        private readonly DomainFE _domainFE;
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IEmailSenderProvider _emailProvider;

        public CreateCustomerHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IOptions<DomainFE> domainFE,
            IEmailSenderProvider emailProvider
        )
        {
            _domainFE = domainFE.Value;
            _emailProvider = emailProvider;
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(CreateCustomerRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId.Value;
            CheckUniqueAndValidation(request);

            // Create a new transaction to save data more securely, data will be restored if an error occurs.
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    // Generate the user's password.
                    var password = StringHelpers.GeneratePassword();
                    var newAccount = new Domain.Entities.Account()
                    {
                        Email = request.Email,
                        Password = (new PasswordHasher<Domain.Entities.Account>()).HashPassword(null, password),
                        EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                        AccountType = EnumAccountType.Customer,
                        FullName = request.FullName,
                        Birthday = request.Birthday,
                        Gender = request.Gender,
                        LastSavedUser = accountId,
                        LastSavedTime = DateTime.Now
                    };
                    // await _unitOfWork.Accounts.AddAsync(newAccount);

                    var newCustomer = new Customer()
                    {
                        Address = request.Address,
                        WardId = request.WardId,
                        DistrictId = request.DistrictId,
                        CityId = request.CityId,
                        Account = newAccount,
                        // AccountId = newAccount.Id,
                        LastSavedUser = accountId,
                        LastSavedTime = DateTime.Now
                    };

                    await _unitOfWork.Customers.AddAsync(newCustomer);
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
            var link = $"{_domainFE.StoreWeb}/dang-nhap?email={emailAddress?.Trim()}";
            string subject = $"Chào bạn đến với {EmailTemplates.SHOP_NAME}";

            string htmlFromResource = myManager.GetString(EmailTemplates.REGISTER_NEW_STORE_ACCOUNT);
            string htmlContext = string.Format(htmlFromResource, EmailTemplates.SHOP_NAME, fullName, emailAddress, password, link);

            await _emailProvider.SendEmailAsync(subject, htmlContext, emailAddress);
        }

        private void CheckUniqueAndValidation(CreateCustomerRequest request)
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
