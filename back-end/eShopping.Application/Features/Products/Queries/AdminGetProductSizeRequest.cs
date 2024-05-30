using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetProductSizeRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string KeySearch { get; set; }
        public Guid ProductSizeCategoryId { get; set; }
    }

    public class AdminGetProductSizeRequestHandler : IRequestHandler<AdminGetProductSizeRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductSizeRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminGetProductSizeRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var allProductSize = _unitOfWork.ProductSizes.GetAll();
            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                var key = request.KeySearch.Trim().ToLower();
                allProductSize = allProductSize.Where(ps => ps.Name.ToLower().Contains(key));
            }
            if (request.ProductSizeCategoryId != Guid.Empty)
            {
                allProductSize = allProductSize.Where(ps => ps.ProductSizeCategoryId == request.ProductSizeCategoryId);
            }
            var allProductSizeInStore = await allProductSize
                                    .Include(ps => ps.ProductSizeCategory)
                                    .OrderBy(ps => ps.Priority)
                                    .ThenByDescending(p => p.CreatedTime)
                                    .ToPaginationAsync(request.PageNumber, request.PageSize);
            var productSizesResponse = _mapper.Map<List<AdminProductSizeModel>>(allProductSizeInStore.Result);
            var response = new PagingResult<AdminProductSizeModel>(productSizesResponse, allProductSizeInStore.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
