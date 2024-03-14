using AutoMapper;
using eShopping.Common.Exceptions;
using eShopping.Interfaces;
using eShopping.Models.Permissions;
using eShopping.Models.Staffs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Staffs.Queries
{
    public class GetStaffByIdRequest : IRequest<GetStaffByIdResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetStaffByIdResponse
    {
        public StaffDetailModel Staff { get; set; }
    }

    public class GetStaffByIdRequestHandler : IRequestHandler<GetStaffByIdRequest, GetStaffByIdResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;

        public GetStaffByIdRequestHandler(IMapper mapper, IUnitOfWork unitOfWork, IUserProvider userProvider)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
        }

        /// <summary>
        /// This method is used to handle the current request.
        /// </summary>
        /// <param name="request">Data has been defined in the model.</param>
        /// <param name="cancellationToken">The current thread.</param>
        /// <returns></returns>
        public async Task<GetStaffByIdResponse> Handle(GetStaffByIdRequest request, CancellationToken cancellationToken)
        {
            // Get the staff by the id.
            var staff = await _unitOfWork.Staffs.GetStaffByIdAsync(request.Id);
            ThrowError.Against(staff == null, "Cannot find staff information");
            var perrmissionGroups = _mapper.Map<IEnumerable<PermissionGroupModel>>(staff.StaffPermissionGroups.Select(x => x.PermissionGroup));

            var staffDetailModel = new StaffDetailModel()
            {
                Id = staff.Id,
                Code = staff.Account.Code,
                PermissionGroups = perrmissionGroups,
                Email = staff.Account.Email,
                Thumbnail = staff.Account.Thumbnail,
                FullName = staff.Account.FullName,
                PhoneNumber = staff.Account.PhoneNumber,
                Gender = staff.Account.Gender,
                Birthday = staff.Account.Birthday
            };

            return new GetStaffByIdResponse
            {
                Staff = staffDetailModel
            };
        }
    }
}
