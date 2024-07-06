using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class UpdateCustomerRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
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

        public bool IsActive { get; set; }
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


            Customer customer = await _unitOfWork.Customers.GetCustomerById(request.Id);
            if (customer == null)
            {
                return BaseResponseModel.ReturnError("Customer is not exist or was inactive");
            }
            var accountId = customer.AccountId;
            Account account = await _unitOfWork.Accounts.GetAccountActivatedByIdAsync(accountId);
            if (account == null)
            {
                return BaseResponseModel.ReturnError("Account is not exist or was inactive");
            }

            if (CheckUniqueAndValidation(request, accountId) != null)
            {
                return CheckUniqueAndValidation(request, accountId);
            }
            return await _unitOfWork.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                using var transaction = await _unitOfWork.BeginTransactionAsync();

                try
                {
                    account.Email = request.Email;
                    account.FullName = request.FullName;
                    account.Birthday = request.Birthday;
                    account.Gender = request.Gender;
                    account.LastSavedUser = accountId;
                    account.LastSavedTime = DateTime.Now;
                    account.PhoneNumber = request.PhoneNumber;
                    await _unitOfWork.Accounts.UpdateAsync(account);

                    customer.Address = request.Address;
                    customer.WardId = request.WardId;
                    customer.DistrictId = request.DistrictId;
                    customer.CityId = request.CityId;
                    customer.LastSavedUser = loggedUser.AccountId;
                    customer.LastSavedTime = DateTime.Now;
                    await _unitOfWork.Customers.UpdateAsync(customer);

                    await _unitOfWork.SaveChangesAsync();
                    await transaction.CommitAsync();

                    return BaseResponseModel.ReturnData();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return BaseResponseModel.ReturnError(ex.Message);
                }

            });
        }

        private BaseResponseModel CheckUniqueAndValidation(UpdateCustomerRequest request, Guid accountId)
        {
            if (string.IsNullOrEmpty(request.FullName))
            {
                return BaseResponseModel.ReturnError("Please enter fill name");
            }
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                return BaseResponseModel.ReturnError("Please enter phone number");
            }

            var phoneExisted = _unitOfWork.Accounts.CheckAccountByPhone(request.PhoneNumber.Trim(), accountId);
            if (phoneExisted)
            {
                return BaseResponseModel.ReturnError("Phone number is existed");
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExisted = _unitOfWork.Accounts.CheckAccountByEmail(request.Email.Trim(), accountId);
                if (emailExisted)
                {
                    return BaseResponseModel.ReturnError("Email is existed");
                }
            }
            return null;
        }
    }
}
