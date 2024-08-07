﻿using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminUpdateProductSizeCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<ProductSize>? ProductSizes { get; set; }
    }
    public class AdminUpdateProductSizeCategoryRequestHandler : IRequestHandler<AdminUpdateProductSizeCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminUpdateProductSizeCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateProductSizeCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var modifiedProductSizeCategory = await _unitOfWork.ProductSizeCategories.Where(ps => ps.Id == request.Id).FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (modifiedProductSizeCategory == null)
            {
                return BaseResponseModel.ReturnError("Couldn't find product size category");
            }
            var productSizeCategoryNameExisted = await _unitOfWork.ProductSizeCategories.Where(ps => ps.Id != request.Id && ps.Name.Equals(request.Name)).FirstOrDefaultAsync();
            if (productSizeCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("This name is already existed");
            }
            modifiedProductSizeCategory.Name = request.Name;
            if(request.ProductSizes != null)
            {
                modifiedProductSizeCategory.ProductSizes = request.ProductSizes;
            }
            modifiedProductSizeCategory.LastSavedUser = loggedUser.AccountId.Value;
            modifiedProductSizeCategory.LastSavedTime = DateTime.Now;

            await _unitOfWork.ProductSizeCategories.UpdateAsync(modifiedProductSizeCategory);
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
