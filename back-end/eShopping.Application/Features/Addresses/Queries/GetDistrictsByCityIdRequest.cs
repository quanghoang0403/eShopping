using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Addresses;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Addresses.Queries
{
    public class GetDistrictsByCityIdRequest : IRequest<BaseResponseModel>
    {
        public int CityId { get; set; }
    }

    public class GetDistrictsByCityIdRequestHandler : IRequestHandler<GetDistrictsByCityIdRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetDistrictsByCityIdRequestHandler(
            IUnitOfWork unitOfWork,
            MapperConfiguration mapperConfiguration)
        {
            _unitOfWork = unitOfWork;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(GetDistrictsByCityIdRequest request, CancellationToken cancellationToken)
        {
            if (request.CityId == 0)
                BaseResponseModel.ReturnError("Please enter the CityId");

            var districts = await _unitOfWork.Districts
                .GetDistrictsByCityId(request.CityId)
                .ProjectTo<DistrictModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = BaseResponseModel.ReturnData(districts);
            return response;
        }
    }
}
