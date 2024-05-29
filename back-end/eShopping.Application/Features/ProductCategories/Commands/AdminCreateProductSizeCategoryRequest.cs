using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Commands
{
    public class AdminCreateProductSizeCategoryRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }

        public int Priority { get; set; }
    }
    public class AdminCreateProductSizeCategoryRequestHandler : IRequestHandler<AdminCreateProductSizeCategoryRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateProductSizeCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminCreateProductSizeCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please provide name for this product size category");
            }
            var sizeCategoryNameExisted = await _unitOfWork.ProductSizeCategories.Where(psc => psc.Name.Trim().ToLower().Equals(request.Name.ToLower().Trim())).FirstOrDefaultAsync();
            if (sizeCategoryNameExisted != null)
            {
                return BaseResponseModel.ReturnError("This name is used");
            }
            var newSizeCategory = _mapper.Map<ProductSizeCategory>(request);
            var accountId = loggedUser.AccountId.Value;
            newSizeCategory.CreatedUser = accountId;
            newSizeCategory.CreatedTime = DateTime.Now;
            _unitOfWork.ProductSizeCategories.Add(newSizeCategory);
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
