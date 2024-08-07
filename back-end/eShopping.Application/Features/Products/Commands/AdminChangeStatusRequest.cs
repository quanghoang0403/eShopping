﻿using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminChangeStatusRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class AdminChangeStatusRequestHandler : IRequestHandler<AdminChangeStatusRequest, BaseResponseModel>
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminChangeStatusRequestHandler(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider
        )
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminChangeStatusRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var product = await _unitOfWork.Products.GetProductByIdAsync(request.Id);
            product.IsActive = !product.IsActive;
            product.LastSavedUser = loggedUser.AccountId.Value;
            product.LastSavedTime = DateTime.Now;
            await _unitOfWork.Products.UpdateAsync(product);
            return BaseResponseModel.ReturnData();
        }
    }
}
