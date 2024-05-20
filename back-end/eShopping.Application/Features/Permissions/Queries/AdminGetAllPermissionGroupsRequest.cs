using AutoMapper;
using AutoMapper.QueryableExtensions;
using eShopping.Common.Models;
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
    public class AdminGetAllPermissionGroupsRequest : IRequest<BaseResponseModel>
    {
    }

    public class AdminGetAllPermissionGroupsResponse
    {
        public IEnumerable<AdminPermissionGroupModel> PermissionGroups { get; set; }
    }

    public class AdminGetAllPermissionGroupsRequestHandler : IRequestHandler<AdminGetAllPermissionGroupsRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public AdminGetAllPermissionGroupsRequestHandler(
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

        public async Task<BaseResponseModel> Handle(AdminGetAllPermissionGroupsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var permissionGroups = await _unitOfWork.PermissionGroups
                            .GetAll()
                            .Include(p => p.Permissions)
                            .AsNoTracking()
                            .ProjectTo<AdminPermissionGroupModel>(_mapperConfiguration)
                            .ToListAsync(cancellationToken: cancellationToken);

            return BaseResponseModel.ReturnData(permissionGroups);
        }
    }
}
