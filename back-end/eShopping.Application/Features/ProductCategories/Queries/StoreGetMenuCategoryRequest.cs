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
            // Gender Male
            var maleCategories = await _unitOfWork.ProductRootCategories
                .Where(x => x.GenderProduct.IsMale())
                .Include(x => x.ProductCategories)
                .OrderBy(x => x.Priority)
                .Select(x => new StoreProductRootCategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = x.UrlSEO,
                    ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(x.ProductCategories)
                })
                .ToListAsync();

            // Gender Male
            var femaleCategories = await _unitOfWork.ProductRootCategories
                .Where(x => x.GenderProduct.IsFemale())
                .Include(x => x.ProductCategories)
                .OrderBy(x => x.Priority)
                .Select(x => new StoreProductRootCategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = x.UrlSEO,
                    ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(x.ProductCategories)
                })
                .ToListAsync();

            // Gender Kid
            var kidsCategories = await _unitOfWork.ProductRootCategories
                .Where(x => x.GenderProduct.IsFemale())
                .Include(x => x.ProductCategories)
                .OrderBy(x => x.Priority)
                .Select(x => new StoreProductRootCategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UrlSEO = x.UrlSEO,
                    ProductCategories = _mapper.Map<List<StoreProductCategoryModel>>(x.ProductCategories)
                })
                .ToListAsync();

            var data = new List<StoreMenuCategoryModel>() {
                new()
                {
                    EnumGenderProduct = EnumGenderProduct.Male,
                    ProductRootCategories = maleCategories
                },
                new()
                {
                    EnumGenderProduct = EnumGenderProduct.Female,
                    ProductRootCategories = femaleCategories
                },
                new()
                {
                    EnumGenderProduct = EnumGenderProduct.Kid,
                    ProductRootCategories = kidsCategories
                },
            };
            return BaseResponseModel.ReturnData(data);
        }
    }
}
