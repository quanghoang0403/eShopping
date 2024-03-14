using AutoMapper;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Settings.Queries
{
    public class GetPermissionGroupByIdRequest : IRequest<GetPermissionGroupByIdResponse>
    {
        public Guid? Id { get; set; }
    }

    public class GetPermissionGroupByIdResponse
    {
        public PermissionGroupDetailModel PermissionGroup { get; set; }
    }

    public class GetPermissionGroupByIdRequestHandler : IRequestHandler<GetPermissionGroupByIdRequest, GetPermissionGroupByIdResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetPermissionGroupByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<GetPermissionGroupByIdResponse> Handle(GetPermissionGroupByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var PermissionGroupData = await _unitOfWork.PermissionGroups.Where(x => x.Id == request.Id).Include(x => x.Permissions).FirstOrDefaultAsync(cancellationToken);
            var PermissionGroup = _mapper.Map<PermissionGroupDetailModel>(PermissionGroupData);

            return new GetPermissionGroupByIdResponse
            {
                PermissionGroup = PermissionGroup
            };
        }
    }
}
