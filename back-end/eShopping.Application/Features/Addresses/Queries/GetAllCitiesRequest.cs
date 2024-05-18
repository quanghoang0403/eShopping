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
    public class GetAllCitiesRequest : IRequest<BaseResponseModel>
    {
    }

    public class GetAllCitiesRequestHandler : IRequestHandler<GetAllCitiesRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetAllCitiesRequestHandler(
            IUnitOfWork unitOfWork,
            MapperConfiguration mapperConfiguration)
        {
            _unitOfWork = unitOfWork;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(GetAllCitiesRequest request, CancellationToken cancellationToken)
        {
            var cities = await _unitOfWork.Cities
                .GetCities()
                .ProjectTo<CityModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = BaseResponseModel.ReturnData(cities);
            return response;
        }
    }
}
