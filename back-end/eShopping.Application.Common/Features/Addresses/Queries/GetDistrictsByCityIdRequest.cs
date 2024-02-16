using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Common.Address;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Common.Features.Addresses.Queries
{
    public class GetDistrictsByCityIdRequest : IRequest<GetDistrictsByCityIdResponse>
    {
        public int? CityId { get; set; }
    }

    public class GetDistrictsByCityIdResponse
    {
        public IList<DistrictModel> Districts { get; set; }
    }

    public class GetDistrictsByCityIdRequestHandler : IRequestHandler<GetDistrictsByCityIdRequest, GetDistrictsByCityIdResponse>
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

        public async Task<GetDistrictsByCityIdResponse> Handle(GetDistrictsByCityIdRequest request, CancellationToken cancellationToken)
        {
            ThrowError.BadRequestAgainstNull(request.CityId, "Please enter the CityId");

            var districts = await _unitOfWork.Districts
                .GetDistrictsByCityId(request.CityId.Value)
                .ProjectTo<DistrictModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = new GetDistrictsByCityIdResponse()
            {
                Districts = districts
            };

            return response;
        }
    }
}
