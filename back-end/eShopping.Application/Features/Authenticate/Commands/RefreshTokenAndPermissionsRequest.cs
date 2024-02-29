using eShopping.Common.Exceptions;
using eShopping.Common.Extensions;
using eShopping.Common.Models.User;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Authenticate.Commands
{
    public class RefreshTokenAndPermissionsRequest : IRequest<RefreshTokenAndPermissionsResponse>
    {
    }

    public class RefreshTokenAndPermissionsResponse
    {
        public string Token { get; set; }

        public IEnumerable<PermissionModel> Permissions { get; set; }
    }

    public class RefreshTokenAndPermissionsRequestHandler : IRequestHandler<RefreshTokenAndPermissionsRequest, RefreshTokenAndPermissionsResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTService _jwtService;
        private readonly IUserProvider _userProvider;
        private readonly IMediator _mediator;

        public RefreshTokenAndPermissionsRequestHandler(IUnitOfWork unitOfWork, IJWTService jwtService, IUserProvider userProvider, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _userProvider = userProvider;
            _mediator = mediator;
        }

        public async Task<RefreshTokenAndPermissionsResponse> Handle(RefreshTokenAndPermissionsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            ThrowError.Against(!loggedUser.AccountId.HasValue, "Cannot find account information");

            var account = await _unitOfWork.Accounts
                .Find(a => a.Id == loggedUser.AccountId)
                .Include(a => a.AccountType)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            var user = new LoggedUserModel();
            Staff staff = await _unitOfWork.Staffs
                    .Find(s => s.AccountId == account.Id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(cancellationToken: cancellationToken);

            ThrowError.Against(staff == null, "login:errorLogin");

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

            //var permissions = new GetPermissionsRequest()
            //{
            //    Token = accessToken
            //};
            //var permissionsResult = await _mediator.Send(permissions, cancellationToken);

            return new RefreshTokenAndPermissionsResponse()
            {
                Token = accessToken,
                //Permissions = permissionsResult.Permissions
            };
        }
    }
}
