using eShopping.Common.Exceptions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class UpdateCustomerRequest : IRequest<BaseResponseModel>
    {
        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public string Thumbnail { get; set; }

        public string Email { get; set; }

        public EnumGender Gender { get; set; }

        public DateTime? Birthday { get; set; }

        public string Address { get; set; }

        public int? CityId { get; set; } // Province / city / town

        public int? DistrictId { get; set; } // District

        public int? WardId { get; set; } // ward
    }

    public class AdminUpdateCustomerHandler : IRequestHandler<UpdateCustomerRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminUpdateCustomerHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(UpdateCustomerRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var accountId = loggedUser.AccountId.Value;

            Customer customer = await _unitOfWork.Customers.GetCustomerById(loggedUser.Id.Value);
            ThrowError.Against(customer == null, "Customer is not exist or was inactive");

            Account account = await _unitOfWork.Accounts.GetAccountActivatedByIdAsync(accountId);
            ThrowError.Against(account == null, "Account is not exist or was inactive");

            if (CheckUniqueAndValidation(request) != null)
            {
                return CheckUniqueAndValidation(request);
            }

            using (var transaction = await _unitOfWork.BeginTransactionAsync())
            {
                try
                {
                    account.Email = request.Email;
                    account.FullName = request.FullName;
                    account.Birthday = request.Birthday;
                    account.Gender = request.Gender;
                    account.LastSavedUser = accountId;
                    account.LastSavedTime = DateTime.Now;
                    //await _unitOfWork.Accounts.UpdateAsync(account);

                    customer.Address = request.Address;
                    customer.WardId = request.WardId;
                    customer.DistrictId = request.DistrictId;
                    customer.CityId = request.CityId;
                    customer.LastSavedUser = accountId;
                    customer.LastSavedTime = DateTime.Now;
                    //await _unitOfWork.Customers.UpdateAsync(newCustomer);

                    await _unitOfWork.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return BaseResponseModel.ReturnData();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return BaseResponseModel.ReturnError(ex.Message);
                }
            }
        }

        private BaseResponseModel CheckUniqueAndValidation(UpdateCustomerRequest request)
        {
            if (string.IsNullOrEmpty(request.FullName))
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                return BaseResponseModel.ReturnError("Phone number is existed");
            }

            var phoneExisted = _unitOfWork.Accounts.CheckAccountByPhone(request.PhoneNumber.Trim());
            if (phoneExisted)
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExisted = _unitOfWork.Accounts.CheckAccountByEmail(request.Email.Trim());
                if (emailExisted)
                {
                    return BaseResponseModel.ReturnError("Email is existed");
                }
            }
            return null;
        }
    }
}
