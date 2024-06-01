using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.ProductCategories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.ProductCategories.Queries
{
    public class AdminGetAllProductCategoriesRequest : IRequest<BaseResponseModel>
    {
        public EnumGenderProduct GenderProduct { get; set; }
        public Guid? ProductRootCategoryId { get; set; }
    }

    public class AdminGetAllProductCategoriesRequestHandler : IRequestHandler<AdminGetAllProductCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetAllProductCategoriesRequestHandler(
            IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration mapperConfiguration)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(AdminGetAllProductCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductCategoriesInStore = _unitOfWork.ProductCategories.GetAll();
            if (request.ProductRootCategoryId != Guid.Empty && request.ProductRootCategoryId != null)
            {
                allProductCategoriesInStore = allProductCategoriesInStore.Where(pc => pc.ProductRootCategoryId == request.ProductRootCategoryId);
            }
            if (request.GenderProduct != EnumGenderProduct.All)
            {
                allProductCategoriesInStore = allProductCategoriesInStore.Where(pc => pc.GenderProduct == request.GenderProduct || pc.GenderProduct == EnumGenderProduct.All);
            }
            var allProductCategoriesResponse = await allProductCategoriesInStore.Include(pc => pc.Products).OrderByDescending(p => p.Priority).Select(p => new AdminProductCategoryModel
            {
                Id = p.Id,
                Name = p.Name,
                Priority = p.Priority,
                Products = _mapper.Map<IEnumerable<AdminProductSelectedModel>>(p.Products)
            }).ToListAsync(cancellationToken: cancellationToken);

            return BaseResponseModel.ReturnData(allProductCategoriesResponse);
        }
    }
}
