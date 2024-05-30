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
    public class AdminUpdateProductSizeCategoryRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public int Priority { get; set; }
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
            var modifiedSizeCategory = await _unitOfWork.ProductSizeCategories.Where(ps => ps.Id == request.Id).FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (modifiedSizeCategory == null)
            {
                return BaseResponseModel.ReturnError("Couldn't find product size category");
            }
            var sizeCategoryNameExisted = await _unitOfWork.ProductSizeCategories.Where(ps => ps.Id != request.Id && ps.Name.Equals(request.Name)).FirstOrDefaultAsync();
            if (sizeCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("This name is already existed");
            }
            modifiedSizeCategory.Name = request.Name;
            modifiedSizeCategory.LastSavedUser = loggedUser.AccountId.Value;
            modifiedSizeCategory.LastSavedTime = DateTime.Now;

            await _unitOfWork.ProductSizeCategories.UpdateAsync(modifiedSizeCategory);
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
