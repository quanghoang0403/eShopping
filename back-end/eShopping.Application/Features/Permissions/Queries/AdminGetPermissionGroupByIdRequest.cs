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
    public class AdminGetPermissionGroupByIdRequest : IRequest<AdminGetPermissionGroupByIdResponse>
    {
        public Guid? Id { get; set; }
    }

    public class AdminGetPermissionGroupByIdResponse
    {
        public PermissionGroupDetailModel PermissionGroup { get; set; }
    }

    public class AdminGetPermissionGroupByIdRequestHandler : IRequestHandler<AdminGetPermissionGroupByIdRequest, AdminGetPermissionGroupByIdResponse>
    {
        private readonly IUserProvider _userProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminGetPermissionGroupByIdRequestHandler(IUserProvider userProvider, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userProvider = userProvider;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<AdminGetPermissionGroupByIdResponse> Handle(AdminGetPermissionGroupByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            var PermissionGroupData = await _unitOfWork.PermissionGroups.Where(x => x.Id == request.Id).Include(x => x.Permissions).FirstOrDefaultAsync(cancellationToken);
            var PermissionGroup = _mapper.Map<PermissionGroupDetailModel>(PermissionGroupData);

            return new AdminGetPermissionGroupByIdResponse
            {
                PermissionGroup = PermissionGroup
            };
        }
    }
}
