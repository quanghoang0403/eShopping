using eShopping.Application.Features.Settings.Queries;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands
{
    public class RefreshTokenRequest : IRequest<BaseResponseModel>
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }
    }

    public class RefreshTokenResponse
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }

        public IEnumerable<AdminPermissionModel> Permissions { get; set; }
    }

    public class RefreshTokenRequestHandler : IRequestHandler<RefreshTokenRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(RefreshTokenRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = _userProvider.GetLoggedUserModelFromJwt(request.Token);
            if (!loggedUser.AccountId.HasValue)
            {
                return BaseResponseModel.ReturnError("Cannot find account information");
            }

            var account = await _unitOfWork.Accounts
                .Find(a => a.Id == loggedUser.AccountId)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            var refreshToken = await _unitOfWork.RefreshTokens.GetRefreshToken(account.Id);
            if (refreshToken == null)
            {
                return BaseResponseModel.ReturnError("User dont have refresh token");
            }
            if (refreshToken.ExpiredDate < DateTime.Now)
            {
                return BaseResponseModel.ReturnError("Refresh token is expired");
            }
            if (refreshToken.Token != request.RefreshToken)
            {
                return BaseResponseModel.ReturnError("Refresh token is not valid");
            }
            if (refreshToken.IsInvoked == true)
            {
                return BaseResponseModel.ReturnError("Refresh token is invoked");
            }

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
            var permissions = await _mediator.Send(new AdminGetPermissionsRequest() { Token = accessToken }, cancellationToken);

            return BaseResponseModel.ReturnData(new RefreshTokenResponse()
            {
                Token = accessToken,
                RefreshToken = newRefreshToken,
                Permissions = permissions.Data
            });
        }
    }
}
