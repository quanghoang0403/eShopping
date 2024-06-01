using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Products.Queries
{
    public class AdminGetAllProductSizesRequest : IRequest<BaseResponseModel>
    {
    }
    public class AdminGetAllProductSizesRequestHandler : IRequestHandler<AdminGetAllProductSizesRequest, BaseResponseModel>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public AdminGetAllProductSizesRequestHandler(
             IUserProvider userProvider,
            IUnitOfWork unitOfWork,
            IMapper mapper
            )
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<BaseResponseModel> Handle(AdminGetAllProductSizesRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            return BaseResponseModel.ReturnData(
                await _unitOfWork.ProductSizes.GetAll()
                .AsNoTracking()
                .Select(ps => new AdminProductSizeModel
                {
                    Id = ps.Id,
                    Name = ps.Name
                }).ToListAsync()
            );
        }
    }
}
