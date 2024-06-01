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
    public class AdminGetAllProductRootCategoriesRequest : IRequest<BaseResponseModel>
    {
        public EnumGenderProduct GenderProduct { get; set; }
    }


    public class AdminGetAllProductRootCategoriesRequestHandler : IRequestHandler<AdminGetAllProductRootCategoriesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetAllProductRootCategoriesRequestHandler(
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

        public async Task<BaseResponseModel> Handle(AdminGetAllProductRootCategoriesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var allProductRootCategoriesInStore = await _unitOfWork.ProductRootCategories
                    .GetAll()
                    .AsNoTracking()
                    .Include(pc => pc.Products)
                    .Where(pc => pc.GenderProduct == request.GenderProduct || pc.GenderProduct == EnumGenderProduct.All)
                    .Select(p => new AdminProductRootCategoryModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Priority = p.Priority,
                        GenderProduct = p.GenderProduct,
                        ProductCategories = _mapper.Map<IEnumerable<AdminProductCategorySelectedModel>>(p.ProductCategories.OrderBy(x => x.Priority))
                    })
                    .OrderBy(pc => pc.Priority)
                    .ToListAsync(cancellationToken: cancellationToken);


            return BaseResponseModel.ReturnData(allProductRootCategoriesInStore);
        }
    }
}
