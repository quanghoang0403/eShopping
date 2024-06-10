using AutoMapper;
using eShopping.Common.Models;
using eShopping.Interfaces;
using eShopping.Models.Customers;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Queries
{
    public class GetCustomerByIdRequest : IRequest<BaseResponseModel>
    {
        public Guid Id { get; set; }
    }

    public class GetCustomerByIdHandler : IRequestHandler<GetCustomerByIdRequest, BaseResponseModel>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _mapperConfiguration;

        public GetCustomerByIdHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper,
            MapperConfiguration mapperConfiguration
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
            _mapperConfiguration = mapperConfiguration;
        }

        public async Task<BaseResponseModel> Handle(GetCustomerByIdRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var customer = await _unitOfWork.Customers.Find(x => x.Id == request.Id).Include(x => x.Account).FirstOrDefaultAsync();
            if (customer == null)
            {
                return BaseResponseModel.ReturnError("Cannot find customer information");
            }

            var customerDetailModel = new CustomerDetailModel()
            {
                Id = customer.Id,
                Code = customer.Account.Code,
                Email = customer.Account.Email,
                Thumbnail = customer.Account.Thumbnail,
                FullName = customer.Account.FullName,
                PhoneNumber = customer.Account.PhoneNumber,
                Gender = customer.Account.Gender,
                Birthday = customer.Account.Birthday,
                Address = customer.Address,
                Note = customer.Note,
                WardId = customer.WardId,
                DistrictId = customer.DistrictId,
                CityId = customer.CityId,
            };

            return BaseResponseModel.ReturnData(customerDetailModel);
        }
    }
}
