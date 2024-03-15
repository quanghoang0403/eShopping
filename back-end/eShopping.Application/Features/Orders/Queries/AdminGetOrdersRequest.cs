using AutoMapper;
using eShopping.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class AdminGetOrdersRequest : IRequest<AdminGetOrdersResponse>
    {
        public Guid? BranchId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public EnumBusinessSummaryWidgetFilter BusinessSummaryWidgetFilter { get; set; }

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public string KeySearch { get; set; }
    }

    public class AdminGetOrdersResponse
    {
        public IEnumerable<OrderModel> Orders { get; set; }

        public OrderReportFilterModel OrderReportFilters { get; set; }

        public OrderTransactionReport OrderTransactionReport { get; set; }

        public int Total { get; set; }
    }

    public class AdminGetOrdersRequestHandler : IRequestHandler<AdminGetOrdersRequest, AdminGetOrdersResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;
        private readonly IBranchService _branchService;
        private readonly IReportService _reportService;
        private readonly IAddressService _addressService;
        private readonly IOrderService _orderService;

        public AdminGetOrdersRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper,
            IBranchService branchService,
            IReportService reportService,
            IAddressService addressService,
            IOrderService orderService
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
            _branchService = branchService;
            _reportService = reportService;
            _addressService = addressService;
            _orderService = orderService;
        }

        public async Task<AdminGetOrdersResponse> Handle(AdminGetOrdersRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);

            BusinessSummaryWidgetFilterRequest filterRequest = new()
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                BusinessSummaryWidgetFilter = request.BusinessSummaryWidgetFilter
            };
            BusinessSummaryWidgetFilterResponse businessSummaryWidgetFilterResponse = _reportService.GetBusinessSummaryWidgetFilter(filterRequest);
            DateTime startDate = businessSummaryWidgetFilterResponse.StartDate;
            DateTime endDate = businessSummaryWidgetFilterResponse.EndDate;
            DateTime startDateCompare = businessSummaryWidgetFilterResponse.StartDateCompare;
            DateTime endDateCompare = businessSummaryWidgetFilterResponse.EndDateCompare;
            var branchIds = _branchService.GetBranches((Guid)loggedUser.StoreId, loggedUser.AccountId).Select(b => b.Id).ToList();

            var listAllOrder = _unitOfWork.Orders
                .GetAllOrdersReportInStore(loggedUser.StoreId)
                .Where(o => (!request.BranchId.HasValue && o.BranchId.HasValue && branchIds.Contains(o.BranchId.Value)) || o.BranchId == request.BranchId)
                .Include(o => o.Customer).ThenInclude(c => c.CustomerPoint)
                .AsNoTracking();

            var listOrderCurrent = listAllOrder.Where(o => o.StatusId != EnumOrderStatus.New && o.CreatedTime >= startDate && o.CreatedTime <= endDate).AsNoTracking();

            string keySearch = request?.KeySearch?.Trim().ToLower();

            if (!string.IsNullOrEmpty(keySearch))
            {
                bool isDefault;
                if (int.TryParse(keySearch, out _))
                {
                    listOrderCurrent = listOrderCurrent
                        .Where(o => o.Code.Contains(keySearch));
                }
                else
                {
                    string firstCharacterFromString = keySearch.Substring(0, 1)?.ToUpper();
                    string numberFromString = "";
                    if (keySearch.Length > 1)
                    {
                        var orderCodeSubString = keySearch.Substring(1);
                        if (int.TryParse(orderCodeSubString, out _))
                        {
                            numberFromString = orderCodeSubString;
                        }
                    }
                    _orderService.FilterByFirstCharacter(firstCharacterFromString, ref listOrderCurrent, numberFromString, out isDefault);

                }
            }

            //Filter
            var orderReportFilter = new OrderReportFilterModel();
            orderReportFilter.ServiceTypes = Enum.GetValues(typeof(EnumOrderType))
                                .Cast<EnumOrderType>()
                                .Select(e => new OrderReportFilterModel.ServiceTypeDto { Id = e })
                                .ToList();

            var paymentMethods = await _unitOfWork.PaymentMethods
                .Where(payment => payment.EnumId == EnumPaymentMethod.MoMo ||
                        payment.EnumId == EnumPaymentMethod.Cash ||
                        payment.EnumId == EnumPaymentMethod.BankTransfer)
                .Select(payment => new OrderReportFilterModel.AllPaymentMethodDto
                {
                    Id = payment.Id,
                    Name = payment.Name,
                    Position = payment.Position,
                    Type = EnumPaymentMethodType.Enterprise
                })
                .OrderBy(payment => payment.Position)
                .ToListAsync(cancellationToken);

            var personalPaymentMethods = await _unitOfWork.PersonalPaymentMethod
                .Where(payment => payment.StoreId == loggedUser.StoreId)
                .Select(payment => new OrderReportFilterModel.AllPaymentMethodDto
                {
                    Id = payment.Id,
                    Name = payment.Name,
                    Position = payment.Position,
                    Type = EnumPaymentMethodType.Personal
                })
                .OrderByDescending(payment => payment.Position)
                .ToListAsync(cancellationToken);

            var allPaymentMethods = paymentMethods.Concat(personalPaymentMethods).ToList();

            orderReportFilter.PaymentMethods = allPaymentMethods;

            var isDefaultCountryVN = await _addressService.CheckIsDefaultCountryVN(loggedUser.StoreId, cancellationToken);
            orderReportFilter.Customers = _unitOfWork.Customers.Find(c => c.StoreId == loggedUser.StoreId)
                .Select(c => new OrderReportFilterModel.OrderReportFilterCustomerDto
                {
                    Id = c.Id,
                    Name = HelperExtensions.GetFullNameByDefaultCountry(isDefaultCountryVN, c.FirstName, c.LastName)
                })
                .ToList();

            var removeStatuses = new List<EnumOrderStatus> { EnumOrderStatus.Draft };

            var orderStatusFilters = Enum.GetValues(typeof(EnumOrderStatus))
                .Cast<EnumOrderStatus>()
                .Select(e => new OrderReportFilterModel.OrderStatusDto { Id = e })
                .ToList();

            orderReportFilter.OrderStatus = orderStatusFilters
                .Where(dto => !removeStatuses.Contains(dto.Id))
                .ToList();

            //Transaction Order Pie Chart

            var orderTransactionReport = new OrderTransactionReport();
            //Total Order
            orderTransactionReport.TotalOrderCurrent = listOrderCurrent.Count();
            var totalOrderPrev = listAllOrder.Where(o => o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderPercent, totalOrderIncrease) = CalculateUpDown(totalOrderPrev, orderTransactionReport.TotalOrderCurrent);
            orderTransactionReport.TotalOrderPercent = totalOrderPercent;
            orderTransactionReport.TotalOrderIncrease = totalOrderIncrease;

            //Total Order Cancel
            orderTransactionReport.TotalOrderCancelCurrent = listOrderCurrent.Where(x => x.StatusId == EnumOrderStatus.Canceled).Count();
            var totalOrderCancelPrev = listAllOrder.Where(o => o.StatusId == EnumOrderStatus.Canceled && o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderCancelPercent, totalOrderCancelIncrease) = CalculateUpDown(totalOrderCancelPrev, orderTransactionReport.TotalOrderCancelCurrent);
            orderTransactionReport.TotalOrderCancelPercent = totalOrderCancelPercent;
            orderTransactionReport.TotalOrderCancelIncrease = totalOrderCancelIncrease;

            //Total Order Instore
            orderTransactionReport.TotalOrderInstoreCurrent = listOrderCurrent.Where(x => x.OrderTypeId == EnumOrderType.Instore).Count();
            var totalOrderInstorePrev = listAllOrder.Where(o => o.OrderTypeId == EnumOrderType.Instore && o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderInstorePercent, totalOrderInstoreIncrease) = CalculateUpDown(totalOrderInstorePrev, orderTransactionReport.TotalOrderInstoreCurrent);
            orderTransactionReport.TotalOrderInstorePercent = totalOrderInstorePercent;
            orderTransactionReport.TotalOrderInstoreIncrease = totalOrderInstoreIncrease;

            //Total Order TakeAway
            orderTransactionReport.TotalOrderTakeAwayCurrent = listOrderCurrent.Where(x => x.OrderTypeId == EnumOrderType.TakeAway).Count();
            var totalOrderTakeAwayPrev = listAllOrder.Where(o => o.OrderTypeId == EnumOrderType.TakeAway && o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderTakeAwayPercent, totalOrderTakeAwayIncrease) = CalculateUpDown(totalOrderTakeAwayPrev, orderTransactionReport.TotalOrderTakeAwayCurrent);
            orderTransactionReport.TotalOrderTakeAwayPercent = totalOrderTakeAwayPercent;
            orderTransactionReport.TotalOrderTakeAwayIncrease = totalOrderTakeAwayIncrease;

            //Total Order GoF&B App
            orderTransactionReport.TotalOrderGoFnBAppCurrent = listOrderCurrent.Where(x => x.PlatformId == EnumPlatform.GoFnBApp.ToGuid()).Count();
            var totalOrderGoFnBAppPrev = listAllOrder.Where(o => o.PlatformId == EnumPlatform.GoFnBApp.ToGuid() && o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderGoFnBAppPercent, totalOrderGoFnBAppIncrease) = CalculateUpDown(totalOrderGoFnBAppPrev, orderTransactionReport.TotalOrderGoFnBAppCurrent);
            orderTransactionReport.TotalOrderGoFnBAppPercent = totalOrderGoFnBAppPercent;
            orderTransactionReport.TotalOrderGoFnBAppIncrease = totalOrderGoFnBAppIncrease;

            //Total Order Store Web
            orderTransactionReport.TotalOrderStoreWebCurrent = listOrderCurrent.Where(x => x.PlatformId == EnumPlatform.StoreWebsite.ToGuid()).Count();
            var totalOrderStoreWebPrev = listAllOrder.Where(o => o.PlatformId == EnumPlatform.StoreWebsite.ToGuid() && o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderStoreWebPercent, totalOrderStoreWebIncrease) = CalculateUpDown(totalOrderGoFnBAppPrev, orderTransactionReport.TotalOrderStoreWebCurrent);
            orderTransactionReport.TotalOrderStoreWebPercent = totalOrderStoreWebPercent;
            orderTransactionReport.TotalOrderStoreWebIncrease = totalOrderStoreWebIncrease;

            //Total Order Store App
            orderTransactionReport.TotalOrderStoreAppCurrent = listOrderCurrent.Where(x => x.PlatformId == EnumPlatform.StoreMobileApp.ToGuid()).Count();
            var totalOrderStoreAppPrev = listAllOrder.Where(o => o.PlatformId == EnumPlatform.StoreMobileApp.ToGuid() && o.CreatedTime >= startDateCompare && o.CreatedTime <= endDateCompare).Count();
            var (totalOrderStoreAppPercent, totalOrderStoreAppIncrease) = CalculateUpDown(totalOrderStoreAppPrev, orderTransactionReport.TotalOrderStoreAppCurrent);
            orderTransactionReport.TotalOrderStoreAppPercent = totalOrderStoreAppPercent;
            orderTransactionReport.TotalOrderStoreAppIncrease = totalOrderStoreAppIncrease;

            var listOrderOrdered = listOrderCurrent.OrderByDescending(o => o.CreatedTime);
            int pageNumber = request.PageNumber > 0 ? request.PageNumber : 1;
            int pageSize = request.PageSize > 0 ? request.PageSize : 20;
            var listOrderByPaging = await listOrderOrdered.ToPaginationAsync(pageNumber, pageSize);
            var listOrderModels = _mapper.Map<IEnumerable<OrderModel>>(listOrderByPaging.Result);

            //Customer
            var customerMemberships = await _unitOfWork.CustomerMemberships.GetAllCustomerMembershipInStore(loggedUser.StoreId).ToListAsync(cancellationToken);
            customerMemberships = customerMemberships.OrderByDescending(x => x.AccumulatedPoint).ToList();
            var listPersonalPaymentMethod = _unitOfWork.PersonalPaymentMethod.GetAll().AsNoTracking();
            var store = await _unitOfWork.Stores.GetStoreInformationByIdAsync(loggedUser.StoreId);
            var defaultCountry = store?.Address?.Country.Iso == DefaultConstants.DEFAULT_NEW_STORE_COUNTRY_ISO;

            listOrderModels.ToList().ForEach(order =>
            {
                if (order.PaymentMethodId == EnumPaymentMethod.Personal)
                {
                    order.PersonalPaymentMethodName = listPersonalPaymentMethod.Where(per => per.Id == order.PersonalPaymentMethodId).FirstOrDefault()?.Name;
                }
                if (order.Customer != null)
                {
                    order.Customer.FullName = defaultCountry
                        ? (order.Customer.LastName + " " + order.Customer.FirstName).Trim()
                        : (order.Customer.FirstName + " " + order.Customer.LastName).Trim();
                }
                foreach (var membership in customerMemberships)
                {
                    if (order?.Customer?.AccumulatedPoint >= membership?.AccumulatedPoint)
                    {
                        order.Customer.Rank = membership.Name;
                        break;
                    }
                }
            });

            var response = new AdminGetOrdersResponse()
            {
                Orders = listOrderModels,
                OrderReportFilters = orderReportFilter,
                OrderTransactionReport = orderTransactionReport,
                Total = listOrderByPaging.Total
            };

            return response;
        }

        public (double, bool) CalculateUpDown(double prev, double current)
        {
            if (prev == 0)
            {
                if (current == 0)
                {
                    return (0, true);
                }
                else
                {
                    return (100, true);
                }
            }
            else
            {
                var percent = Math.Round((100 * current) / (double)prev) - 100;
                if (percent == 0)
                {
                    return (Math.Abs(percent), true);
                }
                else
                {
                    return (Math.Abs(percent), percent >= 0);
                }
            }
        }
    }
}
