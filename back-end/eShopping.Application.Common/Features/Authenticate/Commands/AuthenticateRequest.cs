using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Common.Models.User;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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

        public string Thumbnail { get; set; }

    }


    public class Handler : IRequestHandler<AuthenticateRequest, AuthenticateResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTService _jwtService;

        public Handler(IUnitOfWork unitOfWork, IJWTService jwtService, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }

        public async Task<AuthenticateResponse> Handle(AuthenticateRequest request, CancellationToken cancellationToken)
        {
            ThrowError.ArgumentIsNull(request, request.Email);
            ThrowError.ArgumentIsNull(request, request.Password);

            PasswordHasher<Account> hasher = new();
            var accounts = await _unitOfWork.Accounts
                .Find(a => a.Email == request.Email.ToLower() && a.AccountType == EnumAccountType.Staff && !a.IsDeleted)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);
            ThrowError.Against(!accounts.Any() || accounts.Count > 1, "Error login");

            var account = accounts.First();
            PasswordVerificationResult verified = hasher.VerifyHashedPassword(null, account.Password, request.Password);
            if (verified == PasswordVerificationResult.Failed)
            {
                ThrowError.Against(true, "Error login");
            }

            LoggedUserModel user = new();
            Staff staff = await _unitOfWork.Staffs
                .Find(s => s.AccountId == account.Id)
                .AsNoTracking()
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            ThrowError.Against(staff == null, "Error login");

            if (staff == null)
            {
                Customer customer = await _unitOfWork.Customers
                    .Find(s => s.AccountId == account.Id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(cancellationToken: cancellationToken);

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

            AuthenticateResponse response = new()
            {
                Thumbnail = user.Thumbnail,
                Token = _jwtService.GenerateAccessToken(user)
            };

            return response;
        }
    }
}