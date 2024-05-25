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
    public class AdminGetAllProductCategoriesRequest : IRequest<BaseResponseModel>
    {
        public EnumGenderProduct GenderProduct { get; set; }
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

            var allProductCategoriesInStore = await _unitOfWork.ProductCategories
                    .GetAll()
                    .AsNoTracking()
                    .Include(pc => pc.Products).ThenInclude(p => p.ProductVariants)
                    .Select(p => new AdminProductCategoryModel
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Priority = p.Priority,
                        Products = _mapper.Map<IEnumerable<AdminProductSelectedModel>>(p.Products)
                    })
                    .OrderBy(pc => pc.Priority)
                    .ToListAsync(cancellationToken: cancellationToken);

            return BaseResponseModel.ReturnData(allProductCategoriesInStore);
        }
    }
}
