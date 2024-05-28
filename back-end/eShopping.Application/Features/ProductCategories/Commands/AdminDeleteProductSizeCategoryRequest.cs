using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminDeleteProductSizeCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminDeleteProductSizeCategoryRequestHandler : IRequestHandler<AdminDeleteProductSizeCategoryRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminDeleteProductSizeCategoryRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminDeleteProductSizeCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var productSizeCategory = await _unitOfWork.ProductSizeCategories.Find(p => p.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (productSizeCategory == null)
            {
                return BaseResponseModel.ReturnError("Couldn't find product size category information");
            }
            productSizeCategory.IsDeleted = true;
            productSizeCategory.LastSavedUser = loggedUser.AccountId.Value;
            productSizeCategory.LastSavedTime = DateTime.Now;
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
