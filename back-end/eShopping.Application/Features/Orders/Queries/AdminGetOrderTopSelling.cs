using AutoMapper;
using eShopping.Common.Constants;
using eShopping.Domain.Enums;
using eShopping.Interfaces;
using eShopping.Models.Orders;
using eShopping.Models.Products;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Application.Features.Orders.Queries
{
    public class AdminGetOrderTopSellingRequest : IRequest<AdminGetOrderTopSellingResponse>
    {

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }
    }

    public class AdminGetOrderTopSellingResponse
    {
        public IEnumerable<AdminOrderTopProductModel> ListTopSelling { get; set; }
        public IEnumerable<AdminOrderTopCustomerModel> ListTopCustomer { get; set; }
    }

    public class AdminGetOrderTopProductHandler : IRequestHandler<AdminGetOrderTopSellingRequest, AdminGetOrderTopSellingResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminGetOrderTopProductHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<AdminGetOrderTopSellingResponse> Handle(AdminGetOrderTopSellingRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var listOrder = await _unitOfWork.Orders.Find(o => o.CreatedTime.Value.CompareTo(request.StartDate) >= 0
                                                            && request.EndDate.CompareTo(o.CreatedTime.Value) >= 0
                                                            && o.Status != EnumOrderStatus.Canceled
                                                            && o.Status != EnumOrderStatus.Confirmed
                                                            && o.Status != EnumOrderStatus.Returned)
                .Select(x => new { x.Id, x.CreatedTime, x.Status, x.CustomerId, x.TotalPrice, x.DeliveryFee, x.TotalAmount })
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);

            var listOrderIds = listOrder.Select(x => x.Id);
            var listAllProductPrices = await _unitOfWork.OrderItems.Find(x => listOrderIds.Contains(x.OrderId))
                                                             .Select(x => new { x.ProductPriceId, x.Quantity })
                                                             .GroupBy(x => new { x.ProductPriceId })
                                                             .Select(g => new AdminProductPriceGroupModel { ProductPriceId = g.Key.ProductPriceId, Quantity = g.Sum(x => x.Quantity) })
                                                             .ToListAsync();

            var listAllProductPricesGroup = listAllProductPrices.GroupBy(x => new { x.ProductPriceId, x.ProductId })
                                                                .Select(g => new AdminProductPriceGroupModel { ProductPriceId = g.Key.ProductPriceId, Quantity = g.Sum(x => x.Quantity), ProductId = g.Key.ProductId })
                                                                .ToList();
            var listProductPriceIds = listAllProductPricesGroup.Select(x => x.ProductPriceId);
            var listProductPrice = await _unitOfWork.ProductPrices.Find(x => (listProductPriceIds.Contains(x.Id)))
                                                                  .Include(x => x.Product)
                                                                  .Select(x => new { x.Id, x.PriceName, x.PriceValue, x.Product, ProductId = x.Product.Id })
                                                                  .ToListAsync(cancellationToken: cancellationToken);
            var listTopSelling = new List<AdminOrderTopProductModel>();
            var listProductPriceIdsTemp = new List<Guid?>();
            listAllProductPricesGroup = listAllProductPricesGroup.OrderByDescending(x => x.Quantity).ToList();
            foreach (var productPriceItem in listAllProductPricesGroup)
            {
                var topSelling = new AdminOrderTopProductModel();
                var productPrice = listProductPrice.FirstOrDefault(x => x.Id == productPriceItem.ProductPriceId || x.ProductId == productPriceItem.ProductId);
                if (productPrice == null) { continue; }
                if (!listProductPriceIdsTemp.Contains(productPriceItem.ProductPriceId) || productPriceItem.ProductPriceId == null)
                {
                    listProductPriceIdsTemp.Add(productPriceItem.ProductPriceId);
                }
                else
                {
                    continue;
                }
                topSelling.ProductId = productPrice?.Product?.Id;
                topSelling.ProductName = productPrice?.Product?.Name;
                topSelling.PriceName = productPrice?.PriceName;
                topSelling.Quantity = productPriceItem.Quantity;
                topSelling.TotalCost = productPriceItem.Quantity * productPrice.PriceValue;
                topSelling.Thumbnail = productPrice?.Product?.Thumbnail;
                listTopSelling.Add(topSelling);
                if (listTopSelling.Count == DefaultConstants.DEFAULT_NUMBER_TOP_SELLING)
                {
                    break;
                }
            }
            listTopSelling = listTopSelling.OrderByDescending(x => x.Quantity).ThenByDescending(y => y.TotalCost).ToList();
            var listCustomereObject = listOrder.GroupBy(x => new { x.CustomerId })
                                                              .Select(g => new { CustomerId = g.Key.CustomerId, Cost = g.Sum(x => x.TotalAmount) })
                                                              .OrderByDescending(x => x.Cost).Take(5).ToList();

            var listCustomerIds = listCustomereObject.Select(x => x.CustomerId);
            var listCustomer = await _unitOfWork.Customers.Find(x => listCustomerIds.Contains(x.Id))
                                                          .Include(a => a.Account)
                                                          .Select(x => new { x.Id, x.Account.FullName, x.Account.Thumbnail })
                                                          .ToListAsync(cancellationToken: cancellationToken);
            var listTopCustomer = new List<AdminOrderTopCustomerModel>();
            foreach (var customerItem in listCustomereObject)
            {
                var topTopCustomer = new AdminOrderTopCustomerModel();
                var customer = listCustomer.FirstOrDefault(x => x.Id == customerItem.CustomerId);
                topTopCustomer.Cost = customerItem.Cost;
                topTopCustomer.CustomerName = customer?.FullName;
                topTopCustomer.Thumbnail = customer?.Thumbnail;
                topTopCustomer.Id = customer?.Id;
                listTopCustomer.Add(topTopCustomer);
            }

            var response = new AdminGetOrderTopSellingResponse()
            {
                ListTopSelling = listTopSelling.Select((b, index) => new AdminOrderTopProductModel
                {
                    No = index + 1,
                    TotalCost = b.TotalCost,
                    PriceName = b.PriceName,
                    ProductName = b.ProductName,
                    Quantity = b.Quantity,
                    Thumbnail = b.Thumbnail,
                    ProductId = b.ProductId
                }),
                ListTopCustomer = listTopCustomer.Select((b, index) => new AdminOrderTopCustomerModel
                {
                    No = index + 1,
                    Cost = b.Cost,
                    CustomerName = b.CustomerName,
                    Thumbnail = b.Thumbnail,
                    Id = b.Id
                })
            };

            return response;
        }
    }
}
