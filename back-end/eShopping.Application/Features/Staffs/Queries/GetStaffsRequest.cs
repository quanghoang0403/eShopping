using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using eShopping.Models.Staffs;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Queries
{
    public class GetStaffsRequest : IRequest<GetStaffsResponse>
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class GetStaffsResponse
    {
        public IEnumerable<StaffModel> Staffs { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }


    public class GetStaffsRequestHandler : IRequestHandler<GetStaffsRequest, GetStaffsResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IUserProvider _userProvider;

        public GetStaffsRequestHandler(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IUserProvider userProvider)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userProvider = userProvider;
        }

        public async Task<GetStaffsResponse> Handle(GetStaffsRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var staffs = new PagingExtensions.Pager<Staff>(new List<Staff>(), 0);
            if (string.IsNullOrEmpty(request.KeySearch))
            {
                staffs = await _unitOfWork.Staffs
                                   .GetAll()
                                   .AsNoTracking()
                                   .Include(s => s.Account)
                                   .Include(s => s.StaffPermissionGroups)
                                   .ThenInclude(gpb => gpb.PermissionGroup)
                                   .ThenInclude(gp => gp.Permissions)
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
                                   .Include(s => s.StaffPermissionGroups)
                                   .ThenInclude(gpb => gpb.PermissionGroup)
                                   .ThenInclude(gp => gp.Permissions)
                                   .OrderByDescending(p => p.CreatedTime)
                                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            }

            var staffsResponse = await GetStaffModelAsync(staffs.Result.ToList(), request);
            return new GetStaffsResponse()
            {
                Staffs = staffsResponse,
                PageNumber = request.PageNumber,
                Total = staffs.Total
            };
        }

        private async Task<List<StaffModel>> GetStaffModelAsync(List<Staff> staffs, GetStaffsRequest request)
        {
            var staffsResponse = new List<StaffModel>();
            var staffIds = staffs.Select(s => s.Id);
            var staffGroupPermission = await _unitOfWork.StaffPermissionGroup.GetStaffGroupPermissionByStaffIds(staffIds);
            staffs.ForEach(staff =>
            {
                var index = staffs.IndexOf(staff) + ((request.PageNumber - 1) * request.PageSize) + 1;
                var staffGroupPermissionsByStaff = staffGroupPermission.Where(i => i.StaffId == staff.Id);
                var groups = staffGroupPermissionsByStaff.Select(s => s.PermissionGroup).AsQueryable().DistinctBy(g => g.Id);
                var perrmissionGroups = _mapper.Map<IEnumerable<PermissionGroupModel>>(groups);

                var staffModel = new StaffModel()
                {
                    Id = staff.Id,
                    No = index,
                    PermissionGroups = perrmissionGroups,
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
