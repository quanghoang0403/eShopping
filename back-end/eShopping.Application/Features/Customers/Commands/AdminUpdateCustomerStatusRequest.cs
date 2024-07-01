using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class AdminUpdateCustomerStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminUpdateCustomerStatusRequestHandler : IRequestHandler<AdminUpdateCustomerStatusRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        public AdminUpdateCustomerStatusRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateCustomerStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var customer = await _unitOfWork.Customers.Where(c => c.Id == request.Id).Include(c => c.Account).FirstOrDefaultAsync();
            var account = customer.Account;
            if (customer == null)
            {
                return BaseResponseModel.ReturnError("Cannot find customer");
            }
            if (account == null)
            {
                return BaseResponseModel.ReturnError("Account is not exist or was inactive");
            }
            account.IsActive = !account.IsActive;
            customer.IsActive = !customer.IsActive;
            customer.LastSavedUser = loggedUser.AccountId.Value;
            customer.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
