using AutoMapper;
using eShopping.Common.Models;
using eShopping.Domain.Enums;
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
    ///  Get permissions
    /// </summary>
    public class AdminGetPermissionsRequest : IRequest<BaseResponseModel>
    {
        public string Token { get; set; }
    }

    public class AdminGetPermissionsResponse
    {
        public IEnumerable<AdminPermissionModel> Permissions { get; set; }

    }

    public class AdminGetPermissionsRequestHandler : IRequestHandler<AdminGetPermissionsRequest, BaseResponseModel>
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

        public async Task<BaseResponseModel> Handle(AdminGetPermissionsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = _userProvider.GetLoggedUserModelFromJwt(request.Token);

            var permissions = _unitOfWork
                .StaffPermission
                .GetAll()
                .AsNoTracking()
                .Where(s => s.StaffId == loggedUser.Id.Value)
                .Include(s => s.Permission)
                .Select(s => s.Permission)
                .ToList();

            if (permissions.Any(p => p.Id == EnumPermission.ADMIN.ToGuid()))
            {
                permissions = _unitOfWork.Permissions.GetAll().AsNoTracking().ToList();
            }
            var permissionsResponse = _mapper.Map<List<AdminPermissionModel>>(permissions);
            return BaseResponseModel.ReturnData(permissionsResponse);
        }
    }
}
