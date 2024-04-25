using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Common.Models.User;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class RefreshTokenRequest : IRequest<RefreshTokenResponse>
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }
    }

    public class RefreshTokenResponse
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }
    }

    public class RefreshTokenRequestHandler : IRequestHandler<RefreshTokenRequest, RefreshTokenResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTService _jwtService;
        private readonly IUserProvider _userProvider;
        private readonly IMediator _mediator;

        public RefreshTokenRequestHandler(IUnitOfWork unitOfWork, IJWTService jwtService, IUserProvider userProvider, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _userProvider = userProvider;
            _mediator = mediator;
        }

        public async Task<RefreshTokenResponse> Handle(RefreshTokenRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = _userProvider.GetLoggedUserModelFromJwt(request.Token);
            ThrowError.Against(!loggedUser.AccountId.HasValue, "Cannot find account information");

            var account = await _unitOfWork.Accounts
                .Find(a => a.Id == loggedUser.AccountId)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            var refreshToken = await _unitOfWork.RefreshTokens.GetRefreshToken(account.Id);
            ThrowError.Against(refreshToken.ExpiredDate < DateTime.Now, "Refresh token is expired");
            ThrowError.Against(refreshToken.Token != request.RefreshToken, "Refresh token is not valid");
            ThrowError.Against(refreshToken.IsInvoked == true, "Refresh token is invoked");

            var user = new LoggedUserModel();
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

            var accessToken = _jwtService.GenerateAccessToken(user);
            var newRefreshToken = await _jwtService.GenerateRefreshToken(account.Id);

            return new RefreshTokenResponse()
            {
                Token = accessToken,
                RefreshToken = newRefreshToken
            };
        }
    }
}
