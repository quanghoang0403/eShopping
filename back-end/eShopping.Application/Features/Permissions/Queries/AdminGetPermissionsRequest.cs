using AutoMapper;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Settings.Queries
{
    /// <summary>
    ///  Get permissions from all store branches
    /// </summary>
    public class AdminGetPermissionsRequest : IRequest<AdminGetPermissionsResponse>
    {
        public string Token { get; set; }
    }

    public class AdminGetPermissionsResponse
    {
        public IEnumerable<AdminPermissionModel> Permissions { get; set; }

        public IEnumerable<AdminPermissionGroupModel> PermissionGroups { get; set; }

    }

    public class AdminGetPermissionsRequestHandler : IRequestHandler<AdminGetPermissionsRequest, AdminGetPermissionsResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetPermissionsRequestHandler(
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

        public async Task<AdminGetPermissionsResponse> Handle(AdminGetPermissionsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = _userProvider.GetLoggedUserModelFromJwt(request.Token);

            var permisionGroup = _unitOfWork
                .StaffPermissionGroup
                .GetAll()
                .AsNoTracking()
                .Where(s => s.StaffId == loggedUser.AccountId.Value)
                .Include(s => s.PermissionGroup)
                .Select(s => s.PermissionGroup)
                .ToList();

            var permissionIds = permisionGroup.Select(gpid => gpid.Id);
            var permissions = _unitOfWork.PermissionGroups
                .Where(g => permissionIds.Contains(g.Id))
                .AsNoTracking()
                .Include(g => g.Permissions)
                .SelectMany(g => g.Permissions)
                .ToList();

            var permissionGroupsResponse = _mapper.Map<List<AdminPermissionGroupModel>>(permisionGroup);
            var permissionsResponse = _mapper.Map<List<AdminPermissionModel>>(permissions);
            return new AdminGetPermissionsResponse()
            {
                Permissions = permissionsResponse,
                PermissionGroups = permissionGroupsResponse
            };
        }
    }
}
