using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetProductSizeRequest : IRequest<BaseResponseModel>
    {
        public Guid? ProductSizeCategoryId { get; set; }
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
            if (request.ProductSizeCategoryId != Guid.Empty && request.ProductSizeCategoryId != null)
            {
                allProductSize = allProductSize.Where(ps => ps.ProductSizeCategoryId == request.ProductSizeCategoryId);
            }
            var allProductSizeInStore = await allProductSize
                                    .Include(ps => ps.ProductSizeCategory)
                                    .OrderBy(ps => ps.Priority)
                                    .ThenByDescending(p => p.CreatedTime).ToListAsync();
            return BaseResponseModel.ReturnData(allProductSizeInStore);
        }
    }
}
