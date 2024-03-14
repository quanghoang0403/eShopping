using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Settings.Queries
{
    /// <summary>
    ///  Get permissions from all store branches
    /// </summary>
    public class GetAllPermissionGroupsRequest : IRequest<GetAllPermissionGroupsResponse>
    {
    }

    public class GetAllPermissionGroupsResponse
    {
        public IEnumerable<PermissionGroupModel> PermissionGroups { get; set; }
    }

    public class GetAllPermissionGroupsRequestHandler : IRequestHandler<GetAllPermissionGroupsRequest, GetAllPermissionGroupsResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetAllPermissionGroupsRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper,
            MapperConfiguration mapperConfiguration)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<GetAllPermissionGroupsResponse> Handle(GetAllPermissionGroupsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var permissionGroups = await _unitOfWork.PermissionGroups
                            .GetAll()
                            .AsNoTracking()
                            .ProjectTo<PermissionGroupModel>(_mapperConfiguration)
                            .ToListAsync(cancellationToken: cancellationToken);

            return new GetAllPermissionGroupsResponse()
            {
                PermissionGroups = permissionGroups
            };
        }
    }
}
