using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetAllProductSizeCategoryRequest : IRequest<BaseResponseModel>
    {
    }

    public class AdminGetAllProductSizeCategoryRequestHandler : IRequestHandler<AdminGetAllProductSizeCategoryRequest, BaseResponseModel>
    {
        private IUnitOfWork _unitOfOfWork;
        private IMapper _mapper;
        private IUserProvider _userProvider;
        public AdminGetAllProductSizeCategoryRequestHandler(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IUserProvider userProvider
            )
        {
            _unitOfOfWork = unitOfWork;
            _mapper = mapper;
            _userProvider = userProvider;
        }
        public async Task<BaseResponseModel> Handle(AdminGetAllProductSizeCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allSizeCategory = await _unitOfOfWork.ProductSizeCategories.GetAll()
                .AsNoTracking()
                .OrderBy(p => p.Priority)
                .Include(p => p.ProductSizes).ToListAsync();
            var categoryResponse = new List<AdminProductSizeCategoryModel>();
            foreach (var item in allSizeCategory)
            {
                categoryResponse.Add(new AdminProductSizeCategoryModel
                {
                    Id = item.Id,
                    Name = item.Name,
                    NumberOfProductSize = item.ProductSizes.Count()
                });
            }
            return BaseResponseModel.ReturnData(categoryResponse);
        }
    }
}
