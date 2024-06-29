using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Domain.Settings;
using eShopping.Email;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class SignUpWithGoogleRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public DateTime? Birthday { get; set; }

        public EnumGender Gender { get; set; }
    }

    public class SignUpWithGoogleHandler : IRequestHandler<SignUpWithGoogleRequest, BaseResponseModel>
    {
        private readonly DomainFE _domainFE;
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IEmailSenderProvider _emailProvider;

        public SignUpWithGoogleHandler(
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

        public async Task<BaseResponseModel> Handle(SignUpWithGoogleRequest request, CancellationToken cancellationToken)
        {
            if (CheckUniqueAndValidation(request) != null)
            {
                return CheckUniqueAndValidation(request);
            }
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
                        PhoneNumber = request.PhoneNumber,
                        Password = (new PasswordHasher<Domain.Entities.Account>()).HashPassword(null, password),
                        EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                        AccountType = EnumAccountType.Customer,
                        IsActivated = true,/// bypass email confirm, will be remove in the feature
                        FullName = request.Name,
                        Thumbnail = request.Thumbnail,
                        Gender = request.Gender,
                        LastSavedTime = DateTime.Now
                    };

                    var newCustomer = new Customer()
                    {
                        Account = newAccount,
                        LastSavedTime = DateTime.Now
                    };

                    await _unitOfWork.Customers.AddAsync(newCustomer);
                    await _unitOfWork.SaveChangesAsync();

                    // Complete this transaction, data will be saved.
                    await createStaffTransaction.CommitAsync(cancellationToken);
                }
                catch (Exception ex)
                {
                    // Data will be restored.
                    await createStaffTransaction.RollbackAsync(cancellationToken);
                    return BaseResponseModel.ReturnError(ex.Message);
                }

                return BaseResponseModel.ReturnData();
            });
        }

        private BaseResponseModel CheckUniqueAndValidation(SignUpWithGoogleRequest request)
        {
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
