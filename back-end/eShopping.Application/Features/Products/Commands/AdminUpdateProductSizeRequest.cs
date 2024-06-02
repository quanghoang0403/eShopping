using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Commands
{
    public class AdminUpdateProductSizeRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Priority { get; set; }
        public Guid ProductSizeCategoryId { get; set; }
    }
    public class AdminUpdateProductSizeRequestHandler : IRequestHandler<AdminUpdateProductSizeRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;


        public AdminUpdateProductSizeRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
        )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminUpdateProductSizeRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var modifiedProductSize = await _unitOfWork.ProductSizes.Find(ps => ps.Id == request.Id).FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (modifiedProductSize == null)
            {
                return BaseResponseModel.ReturnError("Product size not found");
            }
            var productSizeNameExisted = await _unitOfWork.ProductSizes.Where(ps => ps.Id != request.Id && ps.Name.Equals(request.Name)).FirstOrDefaultAsync();
            if (productSizeNameExisted != null)
            {
                return BaseResponseModel.ReturnError("This product size name is used");
            }
            modifiedProductSize.Name = request.Name;
            modifiedProductSize.ProductSizeCategoryId = request.ProductSizeCategoryId;
            modifiedProductSize.Priority = request.Priority;
            modifiedProductSize.LastSavedUser = loggedUser.AccountId.Value;
            modifiedProductSize.LastSavedTime = DateTime.Now;

            await _unitOfWork.ProductSizes.UpdateAsync(modifiedProductSize);
            await _unitOfWork.SaveChangesAsync();
            return BaseResponseModel.ReturnData();
        }
    }
}
