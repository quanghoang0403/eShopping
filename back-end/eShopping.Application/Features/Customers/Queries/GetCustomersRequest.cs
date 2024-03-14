using AutoMapper;
using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Interfaces;
using eShopping.Models.Customers;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Customers.Queries
{
    public class GetCustomersRequest : IRequest<GetCustomersResponse>
    {
        public string KeySearch { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }

    public class GetCustomersResponse
    {
        public IEnumerable<CustomerModel> Customers { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class GetCustomerByNameHandler : IRequestHandler<GetCustomersRequest, GetCustomersResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public GetCustomerByNameHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<GetCustomersResponse> Handle(GetCustomersRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var customers = new PagingExtensions.Pager<Customer>(new List<Customer>(), 0);
            if (string.IsNullOrEmpty(request.KeySearch))
            {
                customers = await _unitOfWork.Customers
                                   .GetAll()
                                   .AsNoTracking()
                                   .Include(s => s.Account)
                                   .OrderByDescending(p => p.CreatedTime)
                                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            }
            else
            {
                string keySearch = request.KeySearch.Trim().ToLower();
                customers = await _unitOfWork.Customers
                                   .GetAll()
                                   .AsNoTracking()
                                   .Include(s => s.Account)
                                   .Where(s => s.Account.FullName.ToLower().Contains(keySearch) || s.Account.PhoneNumber.ToLower().Contains(keySearch))
                                   .OrderByDescending(p => p.CreatedTime)
                                   .ToPaginationAsync(request.PageNumber, request.PageSize);
            }

            var customersResponse = GetCustomerModelAsync(customers.Result.ToList(), request);
            return new GetCustomersResponse()
            {
                Customers = customersResponse,
                PageNumber = request.PageNumber,
                Total = customers.Total
            };
        }

        private List<CustomerModel> GetCustomerModelAsync(List<Customer> customers, GetCustomersRequest request)
        {
            var customersResponse = new List<CustomerModel>();
            var customerIds = customers.Select(s => s.Id);

            customers.ForEach(customer =>
            {
                var index = customers.IndexOf(customer) + ((request.PageNumber - 1) * request.PageSize) + 1;
                var customerModel = new CustomerModel()
                {
                    Id = customer.Id,
                    No = index,
                    Code = customer.Account.Code,
                    Email = customer.Account.Email,
                    Thumbnail = customer.Account.Thumbnail,
                    FullName = customer.Account.FullName,
                    PhoneNumber = customer.Account.PhoneNumber
                };
                customersResponse.Add(customerModel);
            });

            return customersResponse;
        }
    }
}
