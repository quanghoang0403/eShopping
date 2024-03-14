using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Interfaces;
using eShopping.Models.Addresses;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Addresses.Queries
{
    public class GetAllCitiesRequest : IRequest<GetAllCitiesResponse>
    {
    }

    public class GetAllCitiesResponse
    {
        public IList<CityModel> Cities { get; set; }
    }

    public class GetAllCitiesRequestHandler : IRequestHandler<GetAllCitiesRequest, GetAllCitiesResponse>
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

        public async Task<GetAllCitiesResponse> Handle(GetAllCitiesRequest request, CancellationToken cancellationToken)
        {
            var cities = await _unitOfWork.Cities
                .GetCities()
                .ProjectTo<CityModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = new GetAllCitiesResponse()
            {
                Cities = cities
            };

            return response;
        }
    }
}
