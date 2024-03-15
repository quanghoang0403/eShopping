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
    public class AdminGetCustomersRequest : IRequest<AdminGetCustomersResponse>
    {
        public string KeySearch { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }
    }

    public class AdminGetCustomersResponse
    {
        public IEnumerable<AdminCustomerModel> Customers { get; set; }

        public int PageNumber { get; set; }

        public int Total { get; set; }
    }

    public class AdminGetCustomerByNameHandler : IRequestHandler<AdminGetCustomersRequest, AdminGetCustomersResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminGetCustomerByNameHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<AdminGetCustomersResponse> Handle(AdminGetCustomersRequest request, CancellationToken cancellationToken)
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
            return new AdminGetCustomersResponse()
            {
                Customers = customersResponse,
                PageNumber = request.PageNumber,
                Total = customers.Total
            };
        }

        private List<AdminCustomerModel> GetCustomerModelAsync(List<Customer> customers, AdminGetCustomersRequest request)
        {
            var customersResponse = new List<AdminCustomerModel>();
            var customerIds = customers.Select(s => s.Id);

            customers.ForEach(customer =>
            {
                var index = customers.IndexOf(customer) + ((request.PageNumber - 1) * request.PageSize) + 1;
                var customerModel = new AdminCustomerModel()
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
