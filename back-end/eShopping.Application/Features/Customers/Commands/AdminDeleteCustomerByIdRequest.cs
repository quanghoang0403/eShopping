﻿using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Commands
{
    public class AdminDeleteCustomerByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminDeleteCustomerRequestHandler : IRequestHandler<AdminDeleteCustomerByIdRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminDeleteCustomerRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminDeleteCustomerByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var customer = await _unitOfWork.Customers.Where(m => m.Id == request.Id).FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (customer == null)
            {
                return BaseResponseModel.ReturnError("Customer is not found");
            }
            customer.IsDeleted = true;
            customer.LastSavedUser = loggedUser.AccountId.Value;
            customer.LastSavedTime = DateTime.Now;

            var customerAccount = await _unitOfWork.Accounts.GetIdentifierAsync(customer.AccountId);
            customerAccount.IsDeleted = true;
            customerAccount.LastSavedUser = loggedUser.AccountId.Value;
            customerAccount.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
