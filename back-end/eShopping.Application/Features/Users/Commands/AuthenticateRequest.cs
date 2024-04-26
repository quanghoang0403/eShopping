using AutoMapper;
using eShopping.Application.Features.Settings.Queries;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Common.Models.User;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class AuthenticateRequest : IRequest<AuthenticateResponse>
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }

    public class AuthenticateResponse
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }

        public IEnumerable<AdminPermissionModel> Permissions { get; set; }
    }


    public class Handler : IRequestHandler<AuthenticateRequest, AuthenticateResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTService _jwtService;
        private readonly IMediator _mediator;

        public Handler(IUnitOfWork unitOfWork, IJWTService jwtService, IMapper mapper, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _mediator = mediator;
        }

        public async Task<AuthenticateResponse> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
        {
            ThrowError.ArgumentIsNull(request, request.Email);
            ThrowError.ArgumentIsNull(request, request.Password);

            PasswordHasher<Account> hasher = new();
            var accounts = await _unitOfWork.Accounts
                .Find(a => a.Email == request.Email.ToLower() && !a.IsDeleted)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);
            ThrowError.Against(!accounts.Any() || accounts.Count > 1, "login.errorLogin");

            var account = accounts.First();
            PasswordVerificationResult verified = hasher.VerifyHashedPassword(null, account.Password, request.Password);
            if (verified == PasswordVerificationResult.Failed)
            {
                ThrowError.Against(true, "login.errorLogin");
            }

            LoggedUserModel user = new();
            Staff staff = await _unitOfWork.Staffs
                .Find(s => s.AccountId == account.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            if (staff == null)
            {
                Customer customer = await _unitOfWork.Customers
                    .Find(s => s.AccountId == account.Id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(cancellationToken: cancellationToken);
                ThrowError.Against(customer == null, "login.errorLogin");
                user.Id = customer?.Id;
            }
            else
            {
                user.Id = staff.Id;
            }

            user.AccountId = account.Id;
            user.FullName = account.FullName;
            user.Email = account.Email;
            user.Password = account.Password;
            user.AccountType = account.AccountType.GetDescription();
            user.PhoneNumber = account.PhoneNumber;
            user.Thumbnail = account.Thumbnail;

            var token = _jwtService.GenerateAccessToken(user);
            var refreshToken = await _jwtService.GenerateRefreshToken(account.Id);
            var permissions = await _mediator.Send(new AdminGetPermissionsRequest() { Token = token }, cancellationToken);
            AuthenticateResponse response = new()
            {
                Token = token,
                RefreshToken = refreshToken,
                Permissions = permissions?.Permissions
            };

            return response;
        }
    }
}