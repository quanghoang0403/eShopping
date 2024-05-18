using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Common.Models;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using eShopping.Models.Staffs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using static eShopping.Common.Extensions.PagingExtensions;

namespace eShopping.Application.Features.Staffs.Queries
{
    public class AdminGetStaffsRequest : IRequest<BaseResponseModel>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
        public Guid PermissionId { get; set; }
    }

    public class AdminGetStaffsRequestHandler : IRequestHandler<AdminGetStaffsRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IUserProvider _userProvider;

        public AdminGetStaffsRequestHandler(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userProvider = userProvider;
        }

        public async Task<BaseResponseModel> Handle(AdminGetStaffsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var query = _unitOfWork.Staffs.GetAll().AsNoTracking();
            if (string.IsNullOrEmpty(request.KeySearch))
            {
                query = query.Include(s => s.Account);
            }
            else
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                query = query.Include(s => s.Account).Where(s => s.Account.FullName.ToLower().Contains(keySearch) || s.Account.PhoneNumber.ToLower().Contains(keySearch));
            }
            var staffs = await query.Include(s => s.StaffPermissions)
                                   .ThenInclude(gpb => gpb.Permission)
                                   .OrderByDescending(p => p.CreatedTime)
                                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            var staffsResponse = await GetStaffModelAsync(staffs.Result.ToList(), request);
            if (request.PermissionId != Guid.Empty)
            {
                staffsResponse = staffsResponse.Where(s => s.Permissions.Any(p => p.PermissionGroupId == request.PermissionId)).ToList();
            }

            var response = new PagingResult<AdminStaffModel>(staffsResponse, staffs.Paging);
            return BaseResponseModel.ReturnData(response);
        }

        private async Task<List<AdminStaffModel>> GetStaffModelAsync(List<Staff> staffs, AdminGetStaffsRequest request)
        {
            var staffsResponse = new List<AdminStaffModel>();
            var staffIds = staffs.Select(s => s.Id);
            var staffGroupPermission = await _unitOfWork.StaffPermission.GetStaffPermissionsByStaffIds(staffIds);
            staffs.ForEach(staff =>
            {
                var index = staffs.IndexOf(staff) + ((request.PageNumber - 1) * request.PageSize) + 1;
                var staffGroupPermissionsByStaff = staffGroupPermission.Where(i => i.StaffId == staff.Id);
                var permissions = staffGroupPermissionsByStaff.Select(s => s.Permission);
                var perrmissionModels = _mapper.Map<IEnumerable<AdminPermissionModel>>(permissions);

                var staffModel = new AdminStaffModel()
                {
                    Id = staff.Id,
                    No = index,
                    Permissions = perrmissionModels,
                    Email = staff.Account.Email,
                    Thumbnail = staff.Account.Thumbnail,
                    FullName = staff.Account.FullName,
                    PhoneNumber = staff.Account.PhoneNumber
                };
                staffsResponse.Add(staffModel);
            });

            return staffsResponse;
        }
    }
}
