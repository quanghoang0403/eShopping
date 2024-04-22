using AutoMapper;
using eShopping.Common.Extensions;
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

namespace eShopping.Application.Features.Staffs.Queries
{
    public class AdminGetStaffsRequest : IRequest<AdminGetStaffsResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
        public Guid PermissionId { get; set; }
    }

    public class AdminGetStaffsResponse
    {
        public IEnumerable<AdminStaffModel> Staffs { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }


    public class AdminGetStaffsRequestHandler : IRequestHandler<AdminGetStaffsRequest, AdminGetStaffsResponse>
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

        public async Task<AdminGetStaffsResponse> Handle(AdminGetStaffsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var staffs = new PagingExtensions.Pager<Staff>(new List<Staff>(), 0);
            if (string.IsNullOrEmpty(request.KeySearch))
            {
                staffs = await _unitOfWork.Staffs
                                   .GetAll()
                                   .AsNoTracking()
                                   .Include(s => s.Account)
                                   .Include(s => s.StaffPermissions)
                                   .ThenInclude(gpb => gpb.Permission)
                                   .OrderByDescending(p => p.CreatedTime)
                                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            }
            else
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                staffs = await _unitOfWork.Staffs
                                   .GetAll()
                                   .AsNoTracking()
                                   .Include(s => s.Account)
                                   .Where(s => s.Account.FullName.ToLower().Contains(keySearch) || s.Account.PhoneNumber.ToLower().Contains(keySearch))
                                   .Include(s => s.StaffPermissions)
                                   .ThenInclude(gpb => gpb.Permission)
                                   .OrderByDescending(p => p.CreatedTime)
                                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            }
            var staffsResponse = await GetStaffModelAsync(staffs.Result.ToList(), request);
            if (request.PermissionId != Guid.Empty)
            {
                staffsResponse = staffsResponse.Where(s => s.Permissions.Any(p => p.PermissionGroupId == request.PermissionId)).ToList();
            }

            return new AdminGetStaffsResponse()
            {
                Staffs = staffsResponse,
                PageNumber = request.PageNumber,
                Total = staffs.Total
            };
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
