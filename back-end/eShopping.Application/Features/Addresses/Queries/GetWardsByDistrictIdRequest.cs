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
    public class GetWardsByDistrictIdRequest : IRequest<BaseResponseModel>
    {
        public int DistrictId { get; set; }
    }

    public class GetWardsByDistrictIdRequestHandler : IRequestHandler<GetWardsByDistrictIdRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(GetWardsByDistrictIdRequest request, CancellationToken cancellationToken)
        {
            if (request.DistrictId == 0)
                BaseResponseModel.ReturnError("Please enter the DistrictId");

            var wards = await _unitOfWork.Wards
                .GetWardsByDistrictId(request.DistrictId)
                .ProjectTo<WardModel>(_mapperConfiguration)
                .ToListAsync(cancellationToken: cancellationToken);

            var response = BaseResponseModel.ReturnData(wards);
            return response;
        }
    }
}
