using AutoMapper;
using eShopping.Interfaces;
using eShopping.Models.Common.Permission;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Settings.Queries
{
    /// <summary>
    ///  Get permissions from all store branches
    /// </summary>
    public class GetPermissionsRequest : IRequest<GetPermissionsResponse>
    {
        public string Token { get; set; }
    }

    public class GetPermissionsResponse
    {
        public IEnumerable<PermissionModel> Permissions { get; set; }

        public IEnumerable<PermissionGroupModel> PermissionGroups { get; set; }

    }

    public class GetPermissionsRequestHandler : IRequestHandler<GetPermissionsRequest, GetPermissionsResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetPermissionsRequestHandler(
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

        public async Task<GetPermissionsResponse> Handle(GetPermissionsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = _userProvider.GetLoggedUserModelFromJwt(request.Token);
            var permissionsResponse = new List<PermissionModel>();
            var permissionGroupsResponse = new List<PermissionModel>();

            // Get all permission assigned to user and check
            var permisionGroup = _unitOfWork
                .StaffPermissionGroup
                .GetAll()
                .AsNoTracking()
                .Where(s => s.StaffId == loggedUser.Id.Value)
                .Include(s => s.PermissionGroup)
                .Select(s => s.PermissionGroup)
                .ToList();

            var permisions = _unitOfWork
                .PermissionGroups
                .Find(g => permisionGroup.Any(gpid => gpid.Id == g.Id))
                .AsNoTracking()
                .Include(g => g.Permissions)
                .Select(g => g.Permissions)
                .ToList();

            permissionGroupsResponse = _mapper.Map<List<PermissionGroupModel>>(permisionGroup);
            permissionsResponse = _mapper.Map<List<PermissionModel>>(permisions);

            return new GetPermissionsResponse()
            {
                Permissions = permissionsResponse,
                PermissionGroups = permissionGroupsResponse
            };
        }
    }
}
