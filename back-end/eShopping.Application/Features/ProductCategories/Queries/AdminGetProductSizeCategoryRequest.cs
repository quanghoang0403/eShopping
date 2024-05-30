using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetProductSizeCategoryRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string KeySearch { get; set; }

    }
    public class AdminGetProductSizeCategoryRequestHandler : IRequestHandler<AdminGetProductSizeCategoryRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductSizeCategoryRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminGetProductSizeCategoryRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var query = _unitOfWork.ProductSizeCategories.GetAll();
            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                query = query.Where(pc => pc.Name.ToLower().Contains(keySearch));
            }
            var allSizeCategory = await query
                   .Include(ppc => ppc.ProductSizes)
                   .OrderBy(x => x.Name)
                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            var sizeCategoryResponse = new List<AdminProductSizeCategoryModel>();
            foreach (var category in allSizeCategory.Result)
            {
                sizeCategoryResponse.Add(new AdminProductSizeCategoryModel()
                {
                    Id = category.Id,
                    Name = category.Name,
                    NumberOfProductSize = category.ProductSizes.Count(),
                });
            }

            sizeCategoryResponse.ForEach(p =>
            {
                p.No = sizeCategoryResponse.IndexOf(p) + (request.PageNumber - 1) * request.PageSize + 1;
            });

            var response = new PagingResult<AdminProductSizeCategoryModel>(sizeCategoryResponse, allSizeCategory.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
