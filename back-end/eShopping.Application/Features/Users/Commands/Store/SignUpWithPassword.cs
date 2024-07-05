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
    public class SignUpWithPassword : IRequest<BaseResponseModel>
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

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }

    public class SignUpWithPasswordHandler : IRequestHandler<SignUpWithPassword, BaseResponseModel>
    {
        private readonly DomainFE _domainFE;
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IEmailSenderProvider _emailProvider;

        public SignUpWithPasswordHandler(
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

        public async Task<BaseResponseModel> Handle(SignUpWithPassword request, CancellationToken cancellationToken)
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
                    var newAccount = new Domain.Entities.Account()
                    {
                        Email = request.Email,
                        Password = (new PasswordHasher<Domain.Entities.Account>()).HashPassword(null, request.Password),
                        EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                        AccountType = EnumAccountType.Customer,
                        FullName = request.FullName,
                        Birthday = request.Birthday,
                        Gender = request.Gender,
                        LastSavedTime = DateTime.Now
                    };

                    var newCustomer = new Customer()
                    {
                        Address = request.Address,
                        WardId = request.WardId,
                        DistrictId = request.DistrictId,
                        CityId = request.CityId,
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

        private BaseResponseModel CheckUniqueAndValidation(SignUpWithPassword request)
        {
            if (string.IsNullOrEmpty(request.FullName))
            {
                return BaseResponseModel.ReturnError("Please enter full name");
            }
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                return BaseResponseModel.ReturnError("Please enter phone number");
            }

            var phoneExisted = _unitOfWork.Accounts.CheckAccountByPhone(request.PhoneNumber.Trim());
            if (phoneExisted)
            {
                return BaseResponseModel.ReturnError("Phone number is existed");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExisted = _unitOfWork.Accounts.CheckAccountByEmail(request.Email.Trim());
                if (emailExisted)
                {
                    return BaseResponseModel.ReturnError("Email is existed");
                }
            }
            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return BaseResponseModel.ReturnError("Password is empty or has white space");
            }
            if (string.IsNullOrWhiteSpace(request.ConfirmPassword))
            {
                return BaseResponseModel.ReturnError("Confirm Password is empty or has white space");
            }
            if (request.ConfirmPassword != request.Password)
            {
                return BaseResponseModel.ReturnError("Password and Confirm Password is not same");
            }
            return null;
        }

    }
}
