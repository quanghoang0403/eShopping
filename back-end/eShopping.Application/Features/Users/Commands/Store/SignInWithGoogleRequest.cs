using eShopping.Application.Features.Settings.Queries;
using eShopping.Common.Extensions;
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
    public class SignInWithGoogleRequest : IRequest<BaseResponseModel>
    {
        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public DateTime? Birthday { get; set; }

        public EnumGender Gender { get; set; }
    }

    public class SignInWithGoogleHandler : IRequestHandler<SignInWithGoogleRequest, BaseResponseModel>
    {
        private readonly DomainFE _domainFE;
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IEmailSenderProvider _emailProvider;
        private readonly IJWTService _jwtService;

        public SignInWithGoogleHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IOptions<DomainFE> domainFE,
            IEmailSenderProvider emailProvider,
            IJWTService jwtService
        )
        {
            _domainFE = domainFE.Value;
            _emailProvider = emailProvider;
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _jwtService = jwtService;
        }

        public async Task<BaseResponseModel> Handle(SignInWithGoogleRequest request, CancellationToken cancellationToken)
        {
            var account = await _unitOfWork.Accounts
                .Find(a => a.Email == request.Email.ToLower())
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            var customer = new Customer();

            // Has created account
            if (account == null)
            {
                using var createStaffTransaction = await _unitOfWork.BeginTransactionAsync();
                try
                {
                    // Generate the user's password.
                    var password = StringHelpers.GeneratePassword();
                    account = new Domain.Entities.Account()
                    {
                        Email = request.Email,
                        PhoneNumber = request.PhoneNumber,
                        Password = (new PasswordHasher<Domain.Entities.Account>()).HashPassword(null, password),
                        EmailConfirmed = true, /// bypass email confirm, will be remove in the feature
                        AccountType = EnumAccountType.Customer,
                        IsActivated = true,/// bypass email confirm, will be remove in the feature
                        FullName = request.FullName,
                        Thumbnail = request.Thumbnail,
                        Gender = request.Gender,
                        LastSavedTime = DateTime.Now,
                    };

                    customer = new Customer()
                    {
                        Account = account,
                        LastSavedTime = DateTime.Now
                    };

                    await _unitOfWork.Customers.AddAsync(customer);
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
            }
            else
            {
                customer = await _unitOfWork.Customers
                   .Find(s => s.AccountId == account.Id)
                   .AsNoTracking()
                   .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            }

            LoggedUserModel user = new()
            {
                Id = customer.Id,
                AccountId = account.Id,
                FullName = account.FullName,
                Email = account.Email,
                Password = account.Password,
                AccountType = account.AccountType.GetDescription(),
                PhoneNumber = account.PhoneNumber,
                Thumbnail = account.Thumbnail
            };

            var token = _jwtService.GenerateAccessToken(user);
            var refreshToken = await _jwtService.GenerateRefreshToken(account.Id);
            var permissions = await _mediator.Send(new AdminGetPermissionsRequest() { Token = token }, cancellationToken);
            AuthenticateResponse response = new()
            {
                Token = token,
                RefreshToken = refreshToken,
                CustomerId = user.Id,
                AccountId = user.AccountId,
                Permissions = permissions?.Data
            };

            return BaseResponseModel.ReturnData(response);
        }
    }
}
