using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class StoreGetMenuCategoryRequest : IRequest<BaseResponseModel>
    {
    }

    public class StoreGetMenuCategoryRequestHandler : IRequestHandler<StoreGetMenuCategoryRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public StoreGetMenuCategoryRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(StoreGetMenuCategoryRequest request, CancellationToken cancellationToken)
        {
            var rootCategories = await _unitOfWork.ProductRootCategories
                .GetAll()
                .Include(x => x.ProductCategories)
                .OrderBy(x => x.Priority)
                .AsNoTracking()
                .ToListAsync();

            // Gender Male
            var maleCategories = rootCategories
                .Where(x => x.GenderProduct.IsMale())
                .Select(x => new StoreProductRootCategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = x.UrlSEO,
                    ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(x.ProductCategories.Where(c => c.GenderProduct.IsMale()))
                });

            // Gender Male
            var femaleCategories = rootCategories
                .Where(x => x.GenderProduct.IsFemale())
                .Select(x => new StoreProductRootCategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = x.UrlSEO,
                    ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(x.ProductCategories.Where(c => c.GenderProduct.IsFemale()))
                });

            // Gender Kid
            var kidsCategories = rootCategories
                .Where(x => x.GenderProduct.IsKid())
                .Select(x => new StoreProductRootCategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = x.UrlSEO,
                    ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(x.ProductCategories.Where(c => c.GenderProduct.IsKid()))
                });

            var data = new List<StoreMenuCategoryModel>() {
                new()
                {
                    GenderProduct = EnumGenderProduct.Male,
                    ProductRootCategories = maleCategories
                },
                new()
                {
                    GenderProduct = EnumGenderProduct.Female,
                    ProductRootCategories = femaleCategories
                },
                new()
                {
                    GenderProduct = EnumGenderProduct.Kid,
                    ProductRootCategories = kidsCategories
                },
            };
            return BaseResponseModel.ReturnData(data);
        }
    }
}
