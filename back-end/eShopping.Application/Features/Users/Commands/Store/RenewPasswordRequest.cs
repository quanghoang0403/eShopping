using AutoMapper;
using eShopping.Application.Providers.Email;
using eShopping.Common.Helpers;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Settings;
using eShopping.Email;
using eShopping.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Users.Commands.Store
{
    public class RenewPasswordRequest : IRequest<BaseResponseModel>
    {
        public string Email { get; set; }
    }


    public class RenewPasswordRequestHandler : IRequestHandler<RenewPasswordRequest, BaseResponseModel>
    {
        private readonly DomainFE _domainFE;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTService _jwtService;
        private readonly IMediator _mediator;
        private readonly IEmailSenderProvider _emailProvider;

        public RenewPasswordRequestHandler(IOptions<DomainFE> domainFE, IUnitOfWork unitOfWork, IJWTService jwtService, IMapper mapper, IMediator mediator, IEmailSenderProvider emailProvider)
        {
            _domainFE = domainFE.Value;
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _mediator = mediator;
            _emailProvider = emailProvider;
        }

        public async Task<BaseResponseModel> Handle(RenewPasswordRequest request, CancellationToken cancellationToken)
        {
            if (request.Email == null)
            {
                return BaseResponseModel.ReturnError("Email is required");
            }

            var password = StringHelpers.GeneratePassword();
            PasswordHasher<Account> hasher = new();
            var newPassword = hasher.HashPassword(null, password);
            var accounts = await _unitOfWork.Accounts
                .Find(a => a.Email == request.Email.ToLower() && !a.IsDeleted)
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);

            if (accounts.Count == 0)
            {
                return BaseResponseModel.ReturnError("Can not find account with this email");
            }

            var account = accounts.First();
            await SendEmailPasswordAsync(account.FullName, account.Email, newPassword);

            return BaseResponseModel.ReturnData();
        }


        /// <summary>
        /// This method is used to send a email to the current staff when the data has been saved successfully.
        /// </summary>
        /// <param name="emailAddress">Staff's email, for example: staff001@gmail.com</param>
        /// <param name="password">Staff's temporary password.</param>
        /// <returns></returns>
        private async Task SendEmailPasswordAsync(string fullName, string emailAddress, string password)
        {
            ResourceManager myManager = new("eShopping.Application.Providers.Email.EmailTemplate", Assembly.GetExecutingAssembly());
            var link = $"{_domainFE.AdminWeb}/login?email={emailAddress?.Trim()}";
            string subject = $"Chào bạn đến với {EmailTemplates.SHOP_NAME}";

            string htmlFromResource = myManager.GetString(EmailTemplates.REGISTER_NEW_ADMIN_ACCOUNT);
            string htmlContext = string.Format(htmlFromResource, EmailTemplates.SHOP_NAME, fullName, emailAddress, password, link);

            await _emailProvider.SendEmailAsync(subject, htmlContext, emailAddress);
        }
    }
}