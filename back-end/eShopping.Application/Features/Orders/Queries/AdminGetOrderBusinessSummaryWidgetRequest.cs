using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class AdminGetOrderBusinessSummaryWidgetRequest : IRequest<AdminGetOrderBusinessSummaryWidgetResponse>
    {
        public Guid? BranchId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public EnumBusinessSummaryWidgetFilter BusinessSummaryWidgetFilter { get; set; }
    }

    public class AdminGetOrderBusinessSummaryWidgetResponse
    {
        public int TotalOrder { get; set; }

        public decimal AverageTotalRevenue { get; set; }

        public decimal AverageTotalCost { get; set; }

        public decimal PercentOrder { get; set; }

        public decimal TotalRevenue { get; set; }

        public decimal PercentRevenue { get; set; }

        public decimal TotalCost { get; set; }

        public decimal PercentCost { get; set; }

        public bool OrderIsDecrease { get; set; }

        public bool RevenueIsDecrease { get; set; }

        public bool CostIsDecrease { get; set; }

        public decimal PercentAverageRevenue { get; set; }

        public decimal PercentAverageCost { get; set; }
    }

    public class AdminGetOrderBusinessSummaryWidgetRequestHandler : IRequestHandler<AdminGetOrderBusinessSummaryWidgetRequest, AdminGetOrderBusinessSummaryWidgetResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IReportService _reportService;


        public AdminGetOrderBusinessSummaryWidgetRequestHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IReportService reportService)
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _reportService = reportService;
        }

        public async Task<AdminGetOrderBusinessSummaryWidgetResponse> Handle(AdminGetOrderBusinessSummaryWidgetRequest request, CancellationToken cancellationToken)
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

            var listOrderQuery = _unitOfWork.Orders
                .GetAllOrdersInStoreHasValid(loggedUser.StoreId)
                .Where(order => order.CreatedTime.Value.CompareTo(startDateCompare) >= 0 && endDate.CompareTo(order.CreatedTime.Value) >= 0);

            if (request.BranchId.HasValue)
            {
                listOrderQuery = listOrderQuery.Where(o => o.BranchId == request.BranchId);
            }

            var listOrder = await listOrderQuery
                .Select(order => new Domain.Entities.Order
                {
                    Id = order.Id,
                    BranchId = order.BranchId,
                    CreatedTime = order.CreatedTime,
                    TotalAmount = order.TotalAmount,
                    TotalCost = order.TotalCost
                }).ToListAsync(cancellationToken);

            if (listOrder.Count == 0)
            {
                return new AdminGetOrderBusinessSummaryWidgetResponse() { };
            }

            // Get orders yesterday
            var listOrderYesterday = listOrder.Where(o => o.CreatedTime.Value.CompareTo(startDateCompare) >= 0 && endDateCompare.CompareTo(o.CreatedTime.Value) >= 0);

            // Get orders by filter (branchId, startDate, endDate)
            var listOrderByFilter = listOrder.Where(o => o.CreatedTime.Value.CompareTo(startDate) >= 0 && endDate.CompareTo(o.CreatedTime.Value) >= 0);

            // Total order yesterday
            var totalOrderYesterday = listOrderYesterday.Count();

            // Total order by filter (branchId, startDate, endDate)
            var totalOrderByFilter = listOrderByFilter.Count();

            // Total revenue orders yesterday
            var totalRevenueYesterday = listOrderYesterday.Sum(o => o.TotalAmount);

            // Total revenue orders filter (branchId, startDate, endDate)
            var totalRevenueByFilter = listOrderByFilter.Sum(o => o.TotalAmount);

            // Total cost orders yesterday
            var totalCostYesterday = listOrderYesterday.Sum(o => o.TotalCost);

            // Total cost orders filter (branchId, startDate, endDate)
            var totalCostByFilter = listOrderByFilter.Sum(o => o.TotalCost);

            var totalAverageRevenue = totalOrderByFilter > 0 ? totalRevenueByFilter / totalOrderByFilter : 0;

            var totalAverageRevenueYesterday = totalOrderYesterday > 0 ? totalRevenueYesterday / totalOrderYesterday : 0;

            var totalAverageCost = totalOrderByFilter > 0 ? totalCostByFilter / totalOrderByFilter : 0;

            var totalAverageCostYesterday = totalOrderYesterday > 0 ? totalCostYesterday / totalOrderYesterday : 0;

            // Percentage between order yesterday and order by filter (branchId, startDate, endDate) 
            // PercentOrder 
            decimal percentOrder = _reportService.CalculatePercentCompare(totalOrderYesterday, totalOrderByFilter);
            bool orderIsDecrease = percentOrder < 0;

            // PercentRevenue
            decimal percentRevenue = _reportService.CalculatePercentCompare(totalRevenueYesterday, totalRevenueByFilter);
            bool revenueIsDecrease = percentRevenue < 0;

            // PercentCost
            decimal percentCost = _reportService.CalculatePercentCompare(totalCostYesterday, totalCostByFilter);
            bool costIsDecrease = percentCost < 0;

            decimal percentAverageRevenue = _reportService.CalculatePercentCompare(totalAverageRevenueYesterday, totalAverageRevenue);

            decimal percentAverageCost = _reportService.CalculatePercentCompare(totalAverageCostYesterday, totalAverageCost);

            var response = new AdminGetOrderBusinessSummaryWidgetResponse()
            {
                TotalOrder = totalOrderByFilter,
                PercentOrder = Math.Round(percentOrder, 2),
                TotalRevenue = Math.Round(totalRevenueByFilter, 2),
                PercentRevenue = Math.Round(percentRevenue, 2),
                TotalCost = Math.Round(totalCostByFilter, 2),
                PercentCost = Math.Round(percentCost, 2),
                OrderIsDecrease = orderIsDecrease,
                RevenueIsDecrease = revenueIsDecrease,
                CostIsDecrease = costIsDecrease,
                AverageTotalRevenue = totalOrderByFilter > 0 ? Math.Round(totalRevenueByFilter / totalOrderByFilter, 2) : 0,
                AverageTotalCost = totalOrderByFilter > 0 ? Math.Round(totalCostByFilter / totalOrderByFilter, 2) : 0,
                PercentAverageRevenue = Math.Round(percentAverageRevenue, 2),
                PercentAverageCost = Math.Round(percentAverageCost, 2),
            };

            return response;
        }
    }
}
