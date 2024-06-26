using AutoMapper;
using eShopping.Application.Features.Settings.Queries;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class AuthenticateRequest : IRequest<BaseResponseModel>
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }

    public class AuthenticateResponse
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }

        public Guid? CustomerId { get; set; }

        public Guid? AccountId { get; set; }

        public IEnumerable<AdminPermissionModel> Permissions { get; set; }
    }


    public class Handler : IRequestHandler<AuthenticateRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
        {
            if (request.Email == null)
            {
                return BaseResponseModel.ReturnError("Email is required");
            }
            if (request.Password == null)
            {
                return BaseResponseModel.ReturnError("Password is required");
            }

            PasswordHasher<Account> hasher = new();
            var accounts = await _unitOfWork.Accounts
                .Find(a => a.Email == request.Email.ToLower() && !a.IsDeleted)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);
            if (!accounts.Any() || accounts.Count > 1)
            {
                return BaseResponseModel.ReturnError("Invalid email or password");
            }

            var account = accounts.First();
            PasswordVerificationResult verified = hasher.VerifyHashedPassword(null, account.Password, request.Password);
            if (verified == PasswordVerificationResult.Failed)
            {
                return BaseResponseModel.ReturnError("login.errorLogin");
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
                if (customer == null)
                {
                    return BaseResponseModel.ReturnError("login.errorLogin");
                }
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
                CustomerId = user.Id,
                AccountId = user.AccountId,
                Permissions = permissions?.Data
            };

            return BaseResponseModel.ReturnData(response);
        }
    }
}