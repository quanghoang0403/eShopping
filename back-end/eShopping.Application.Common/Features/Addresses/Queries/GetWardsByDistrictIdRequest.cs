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
    public class GetWardsByDistrictIdRequest : IRequest<GetWardsByDistrictIdResponse>
    {
        public int DistrictId { get; set; }
    }

    public class GetWardsByDistrictIdResponse
    {
        public IList<WardModel> Wards { get; set; }
    }

    public class GetWardsByDistrictIdRequestHandler : IRequestHandler<GetWardsByDistrictIdRequest, GetWardsByDistrictIdResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetWardsByDistrictIdRequestHandler(
            IUnitOfWork unitOfWork,
            MapperConfiguration mapperConfiguration)
        {
            _unitOfWork = unitOfWork;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<GetWardsByDistrictIdResponse> Handle(GetWardsByDistrictIdRequest request, CancellationToken cancellationToken)
        {
            ThrowError.BadRequestAgainstNull(request.DistrictId, "Please enter the DistrictId");

            var wards = await _unitOfWork.Wards
                .GetWardsByDistrictId(request.DistrictId)
                .ProjectTo<WardModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = new GetWardsByDistrictIdResponse()
            {
                Wards = wards
            };

            return response;
        }
    }
}
