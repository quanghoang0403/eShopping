using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetProductSizeCategoryByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }
    public class AdminGetProductSizeCategoryByIdRequestHandler : IRequestHandler<AdminGetProductSizeCategoryByIdRequest, BaseResponseModel>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public AdminGetProductSizeCategoryByIdRequestHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IUserProvider userProvider)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminGetProductSizeCategoryByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var productSizeCategory = await _unitOfWork.ProductSizeCategories.Where(ps => ps.Id == request.Id).Include(ps => ps.ProductSizes).AsNoTracking().FirstOrDefaultAsync(cancellationToken: cancellationToken);
            if (productSizeCategory == null)
            {
                return BaseResponseModel.ReturnError("Couldn't find product size category information");
            }
            var ProductSizeCategoryResponse = new AdminProductSizeCategoryDetailModel
            {
                Id = productSizeCategory.Id,
                Name = productSizeCategory.Name,
                Priority = productSizeCategory.Priority,
                ProductSizes = _mapper.Map<IEnumerable<AdminProductSizeModel>>(productSizeCategory.ProductSizes)
            };
            return BaseResponseModel.ReturnData(ProductSizeCategoryResponse);
        }
    }
}
