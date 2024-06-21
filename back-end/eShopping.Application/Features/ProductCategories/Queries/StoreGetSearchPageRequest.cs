using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
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
    public class StoreGetSearchPageRequest : IRequest<BaseResponseModel>
    {
        public string KeySearch { get; set; }
    }

    public class StoreGetSearchPageResponse
    {
        public string KeySearch { get; set; }
        public PagingResult<StoreProductModel> Data { get; set; }
        public List<StoreProductRootCategoryModel> ProductRootCategories { get; set; }
        public List<StoreProductCategoryModel> ProductCategories { get; set; }
    }


    public class StoreGetSearchPageRequestHandler : IRequestHandler<StoreGetSearchPageRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetSearchPageRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetSearchPageRequest request, CancellationToken cancellationToken)
        {

            var res = new StoreGetSearchPageResponse() { KeySearch = request.KeySearch };

            var products = _unitOfWork.Products.GetAll();

            if (!string.IsNullOrEmpty(request.KeySearch))
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                products = products.Where(p => p.Name.ToLower().Contains(keySearch));
            }

            var productRootCategories = await _unitOfWork.ProductRootCategories
                .GetAll()
                .OrderBy(x => x.Priority)
                .ToListAsync();
            res.ProductRootCategories = _mapper.Map<List<StoreProductRootCategoryModel>>(productRootCategories);

            var productCategories = await _unitOfWork.ProductCategories
                .GetAll()
                .OrderBy(x => x.Priority)
                .ToListAsync();
            res.ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(productCategories);

            var productPaging = await products
                .AsNoTracking()
                .Include(p => p.ProductVariants)
                .Include(p => p.ProductCategory)
                .Include(p => p.ProductRootCategory)
                .Include(p => p.ProductSizeCategory.ProductSizes)
                .Include(p => p.ProductStocks)
                .OrderBy(x => x.Priority)
                .ToPaginationAsync(PageSetting.FirstPage, PageSetting.PageSize);

            var productModel = _mapper.Map<List<StoreProductModel>>(productPaging.Result);
            res.Data = new PagingResult<StoreProductModel>(productModel, productPaging.Paging); ;
            return BaseResponseModel.ReturnData(res);
        }
    }
}
