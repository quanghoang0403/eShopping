using eShopping.Common.Exceptions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json.Linq;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class AdminCreateCustomerRequest : IRequest<bool>
    {
        public string Password { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public DateTime? Birthday { get; set; }

        public EnumGender Gender { get; set; }

        public string Note { get; set; }

        public int? CityId { get; set; }

        public int? DistrictId { get; set; }

        public int? WardId { get; set; }

        public string Address { get; set; }
    }

    public class AdminCreateCustomerHandler : IRequestHandler<AdminCreateCustomerRequest, bool>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminCreateCustomerHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<bool> Handle(AdminCreateCustomerRequest request, CancellationToken cancellationToken)
        {
            var loggerUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggerUser.Id.Value;
            CheckUniqueAndValidation(request);

            // Create a new transaction to save data more securely, data will be restored if an error occurs.
            using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
            try
            {
                var newAccount = new Account()
                {
                    Email = request.Email,
                    Password = (new PasswordHasher<Account>()).HashPassword(null, request.Password),
                    EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                    AccountType = EnumAccountType.Customer,
                    FullName = request.FullName,
                    Birthday = request.Birthday,
                    Gender = request.Gender,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };
                // await _unitOfWork.Accounts.AddAsync(newAccount);

                var newCustomer = new Customer()
                {
                    Note = request.Note,
                    Address = request.Address,
                    WardId = request.WardId,
                    DistrictId = request.DistrictId,
                    CityId = request.CityId,
                    Account = newAccount,
                    // AccountId = newAccount.Id,
                    LastSavedUser = accountId,
                    LastSavedTime = DateTime.UtcNow
                };

                await _unitOfWork.Customers.AddAsync(newCustomer);
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

        private void CheckUniqueAndValidation(AdminCreateCustomerRequest request)
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
