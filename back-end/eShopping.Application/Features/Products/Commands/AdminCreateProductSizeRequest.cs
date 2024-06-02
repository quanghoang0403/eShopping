using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminCreateProductSizeRequest : IRequest<BaseResponseModel>
    {
        public string Name { get; set; }
        public int Priority { get; set; }

        public Guid ProductSizeCategoryId { get; set; }
    }

    public class AdminCreateProductSizeRequestHandler : IRequestHandler<AdminCreateProductSizeRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminCreateProductSizeRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminCreateProductSizeRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            if (string.IsNullOrEmpty(request.Name))
            {
                return BaseResponseModel.ReturnError("Please provide name for product size");
            }
            var productSizeNameExisted = await _unitOfWork.ProductSizes.Where(ps => ps.Name.Equals(request.Name)).FirstOrDefaultAsync();
            if (productSizeNameExisted != null)
            {
                return BaseResponseModel.ReturnError("This name is already existed");
            }
            var newProductSize = _mapper.Map<ProductSize>(request);
            var accountId = loggedUser.AccountId.Value;
            newProductSize.CreatedUser = accountId;
            newProductSize.CreatedTime = DateTime.Now;
            _unitOfWork.ProductSizes.Add(newProductSize);
            await _unitOfWork.SaveChangesAsync();

            return BaseResponseModel.ReturnData();
        }
    }
}
