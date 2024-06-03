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
    public class AdminGetProductSizeCategoriesRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string KeySearch { get; set; }

    }
    public class AdminGetProductSizeCategoriesRequestHandler : IRequestHandler<AdminGetProductSizeCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetProductSizeCategoriesRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<BaseResponseModel> Handle(AdminGetProductSizeCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var query = _unitOfWork.ProductSizeCategories.GetAll();
            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                query = query.Where(pc => pc.Name.ToLower().Contains(keySearch));
            }
            var allProductSizeCategory = await query
                   .Include(ppc => ppc.ProductSizes)
                   .OrderBy(x => x.Name)
                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            var productSizeCategoryResponse = new List<AdminProductSizeCategoryModel>();
            foreach (var category in allProductSizeCategory.Result)
            {
                productSizeCategoryResponse.Add(new AdminProductSizeCategoryModel()
                {
                    Id = category.Id,
                    Name = category.Name,
                    ProductSizes = _mapper.Map<List<AdminProductSizeModel>>(category.ProductSizes)
                });
            }

            productSizeCategoryResponse.ForEach(p =>
            {
                p.No = productSizeCategoryResponse.IndexOf(p) + (request.PageNumber - 1) * request.PageSize + 1;
            });

            var response = new PagingResult<AdminProductSizeCategoryModel>(productSizeCategoryResponse, allProductSizeCategory.Paging);
            return BaseResponseModel.ReturnData(response);
        }
    }
}
