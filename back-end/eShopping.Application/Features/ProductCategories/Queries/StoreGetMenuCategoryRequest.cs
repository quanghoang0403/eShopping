using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
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

            var data = new List<StoreMenuCategoryModel>() {
                new()
                {
                    GenderProduct = EnumGenderProduct.Male,
                    Children = MapMenuModel(rootCategories, EnumGenderProduct.Male)
                },
                new()
                {
                    GenderProduct = EnumGenderProduct.Female,
                    Children = MapMenuModel(rootCategories, EnumGenderProduct.Female)
                },
                new()
                {
                    GenderProduct = EnumGenderProduct.Kid,
                    Children = MapMenuModel(rootCategories, EnumGenderProduct.Kid)
                },
            };
            return BaseResponseModel.ReturnData(data);
        }

        private List<StoreNavigationModel> MapMenuModel(List<ProductRootCategory> productRootCategories, EnumGenderProduct gender)
        {
            var menuCategories = new List<StoreNavigationModel>();
            foreach (var rootCategory in productRootCategories.Where(x => x.GenderProduct == EnumGenderProduct.All || x.GenderProduct == gender))
            {
                menuCategories.Add(new StoreNavigationModel()
                {
                    Id = rootCategory.Id,
                    Name = rootCategory.Name,
                    UrlSEO = rootCategory.UrlSEO,
                    IsMain = true
                });
                menuCategories.AddRange(_mapper.Map<List<StoreNavigationModel>>(rootCategory.ProductCategories.Where(c => c.GenderProduct == EnumGenderProduct.All || c.GenderProduct == gender)));
            }
            return menuCategories;
        }
    }
}
