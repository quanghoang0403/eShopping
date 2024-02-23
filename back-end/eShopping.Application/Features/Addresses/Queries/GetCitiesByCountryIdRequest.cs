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
    public class GetCitiesByCountryIdRequest : IRequest<GetCitiesByCountryIdResponse>
    {
    }

    public class GetCitiesByCountryIdResponse
    {
        public IList<CityModel> Cities { get; set; }
    }

    public class GetCitiesByCountryIdRequestHandler : IRequestHandler<GetCitiesByCountryIdRequest, GetCitiesByCountryIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetCitiesByCountryIdRequestHandler(
            IUnitOfWork unitOfWork,
            MapperConfiguration mapperConfiguration)
        {
            _unitOfWork = unitOfWork;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<GetCitiesByCountryIdResponse> Handle(GetCitiesByCountryIdRequest request, CancellationToken cancellationToken)
        {
            var cities = await _unitOfWork.Cities
                .GetCities()
                .ProjectTo<CityModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = new GetCitiesByCountryIdResponse()
            {
                Cities = cities
            };

            return response;
        }
    }
}
