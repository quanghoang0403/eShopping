using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GoFoodBeverage.Application.Features.Orders.Queries
{
    public class AdminGetOrderTopSellingProductRequest : IRequest<AdminGetOrderTopSellingProductResponse>
    {
        public Guid? BranchId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int? PageNumber { get; set; }

        public int? PageSize { get; set; }
    }

    public class AdminGetOrderTopSellingProductResponse
    {
        public IEnumerable<OrderSellingProductModel> ListTopSellingProduct { get; set; }
        public IEnumerable<OrderTopCustomerModel> ListTopCustomer { get; set; }
    }

    public class AdminGetOrderTopSellingProductHandler : IRequestHandler<AdminGetOrderTopSellingProductRequest, AdminGetOrderTopSellingProductResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserProvider _userProvider;
        private readonly IMapper _mapper;

        public AdminGetOrderTopSellingProductHandler(
            IUnitOfWork unitOfWork,
            IUserProvider userProvider,
            IMapper mapper
            )
        {
            _unitOfWork = unitOfWork;
            _userProvider = userProvider;
            _mapper = mapper;
        }

        public async Task<AdminGetOrderTopSellingProductResponse> Handle(AdminGetOrderTopSellingProductRequest request, CancellationToken cancellationToken)
        {
            var loggedUser = await _userProvider.ProvideAsync(cancellationToken);
            var timeZone = _userProvider.GetTimezoneOffset() ?? 0;
            var startDate = request.StartDate.StartOfDay().AddMinutes(timeZone);
            var endDate = request.EndDate.EndOfDay().AddMinutes(timeZone);

            var listOrder = await _unitOfWork.Orders.Find(o => o.StoreId == loggedUser.StoreId
                    && o.CreatedTime.Value.CompareTo(startDate) >= 0
                    && endDate.CompareTo(o.CreatedTime.Value) >= 0
                    && o.StatusId != EnumOrderStatus.Canceled
                    && o.StatusId != EnumOrderStatus.Draft
                    && o.StatusId != EnumOrderStatus.ToConfirm
                    && o.StatusId != EnumOrderStatus.Returned
                    && (request.BranchId == null || o.BranchId == request.BranchId))
                .Select(x => new { x.Id, x.CreatedTime, x.StatusId, x.BranchId, x.CustomerId, x.PriceAfterDiscount, x.TotalFee, x.TotalTax, x.DeliveryFee, x.CustomerDiscountAmount, x.TotalAmount })
                .AsNoTracking()
                .ToListAsync(cancellationToken: cancellationToken);

            var listOrderIds = listOrder.Select(x => x.Id);
            var listOrderItems = await _unitOfWork.OrderItems.Find(x => x.StoreId == loggedUser.StoreId && listOrderIds.Contains(x.OrderId.Value))
                                                             .Include(i => i.OrderItemToppings)
                                                             .Include(i => i.OrderComboItem)
                                                             .ThenInclude(x => x.OrderComboProductPriceItems).ThenInclude(y => y.OrderItemToppings)
                                                             .Where(x => x.StatusId != EnumOrderItemStatus.Canceled)
                                                             .Select(x => new { x.IsCombo, x.ProductPriceId, x.OrderComboItem, x.Quantity, x.OrderItemToppings })
                                                             .ToListAsync(cancellationToken: cancellationToken);
            var listAllProductPrices = new List<ProductPriceGroupModel>();
            var listNotOrderComboItems = listOrderItems.Where(x => x.IsCombo == false)
                                                       .GroupBy(x => new { x.ProductPriceId })
                                                       .Select(g => new ProductPriceGroupModel { ProductPriceId = g.Key.ProductPriceId, Quantity = g.Sum(x => x.Quantity) });
            listAllProductPrices.AddRange(listNotOrderComboItems);
            var listOrderComboItems = listOrderItems.Where(x => x.IsCombo == true)
                                                    .Select(x => x.OrderComboItem)
                                                    .ToList();
            var listAllTopping = new List<ProductPriceGroupModel>();
            foreach (var orderComboItem in listOrderComboItems)
            {
                var listProductPriceForCombos = orderComboItem.OrderComboProductPriceItems
                                                              .GroupBy(x => new { x.ProductPriceId })
                                                              .Select(g => new ProductPriceGroupModel { ProductPriceId = g.Key.ProductPriceId, Quantity = g.Count() });
                listAllProductPrices.AddRange(listProductPriceForCombos);
                var toppingCombo = orderComboItem.OrderComboProductPriceItems
                                                           .SelectMany(x => x.OrderItemToppings)
                                                           .GroupBy(y => new { y.ToppingId })
                                                           .Select(g => new ProductPriceGroupModel { ProductId = g.Key.ToppingId, Quantity = g.Sum(x => x.Quantity) })
                                                           .ToList();
                listAllTopping.AddRange(toppingCombo);
            }

            //Topping
            var allToppingProduct = listOrderItems.SelectMany(x => x.OrderItemToppings)
                                                  .GroupBy(y => new { y.ToppingId })
                                                  .Select(g => new ProductPriceGroupModel { ProductId = g.Key.ToppingId, Quantity = g.Sum(x => x.Quantity) })
                                                  .ToList();
            listAllTopping.AddRange(allToppingProduct);
            var listAllToppingGroup = listAllTopping.GroupBy(y => new { y.ProductId })
                                                    .Select(g => new ProductPriceGroupModel { ProductId = g.Key.ProductId, Quantity = g.Sum(x => x.Quantity) })
                                                    .ToList();
            var listAllToppingId = listAllToppingGroup.Select(x => x.ProductId).ToList();
            listAllProductPrices.AddRange(listAllToppingGroup);
            var listAllProductPricesGroup = listAllProductPrices.GroupBy(x => new { x.ProductPriceId, x.ProductId })
                                                                .Select(g => new ProductPriceGroupModel { ProductPriceId = g.Key.ProductPriceId, Quantity = g.Sum(x => x.Quantity), ProductId = g.Key.ProductId })
                                                                .ToList();
            var listProductPriceIds = listAllProductPricesGroup.Select(x => x.ProductPriceId);
            var listProductPrice = await _unitOfWork.ProductPrices.Find(x => x.StoreId == loggedUser.StoreId && (listProductPriceIds.Contains(x.Id) || listAllToppingId.Contains(x.ProductId)))
                                                                  .Include(x => x.Product)
                                                                  .Select(x => new { x.Id, x.PriceName, x.PriceValue, x.Product, ProductId = x.Product.Id })
                                                                  .ToListAsync(cancellationToken: cancellationToken);
            var listTopSellingProduct = new List<OrderSellingProductModel>();
            var listProductPriceIdsTemp = new List<Guid?>();
            listAllProductPricesGroup = listAllProductPricesGroup.OrderByDescending(x => x.Quantity).ToList();
            foreach (var productPriceItem in listAllProductPricesGroup)
            {
                var topSellingProduct = new OrderSellingProductModel();
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
                topSellingProduct.ProductId = productPrice?.Product?.Id;
                topSellingProduct.ProductName = productPrice?.Product?.Name;
                topSellingProduct.PriceName = productPrice?.PriceName;
                topSellingProduct.Quantity = productPriceItem.Quantity;
                topSellingProduct.TotalCost = productPriceItem.Quantity * productPrice.PriceValue;
                topSellingProduct.Thumbnail = productPrice?.Product?.Thumbnail;
                listTopSellingProduct.Add(topSellingProduct);
                if (listTopSellingProduct.Count == DefaultConstants.DEFAULT_NUMBER_TOP_SELLING_PRODUCTS)
                {
                    break;
                }
            }
            listTopSellingProduct = listTopSellingProduct.OrderByDescending(x => x.Quantity).ThenByDescending(y => y.TotalCost).ToList();
            var listOrderCustomerNotNull = listOrder.Where(x => x.CustomerId != null).ToList();
            var listCustomereObject = listOrderCustomerNotNull.GroupBy(x => new { x.CustomerId })
                                                              .Select(g => new { CustomerId = g.Key.CustomerId, Cost = g.Sum(x => x.TotalAmount) })
                                                              .OrderByDescending(x => x.Cost).Take(5).ToList();

            var listCustomerIds = listCustomereObject.Select(x => x.CustomerId);
            var listCustomer = await _unitOfWork.Customers.Find(x => x.StoreId == loggedUser.StoreId && listCustomerIds.Contains(x.Id))
                                                          .Select(x => new { x.Id, x.FullName, x.Thumbnail })
                                                          .ToListAsync(cancellationToken: cancellationToken);
            var listTopCustomer = new List<OrderTopCustomerModel>();
            foreach (var customerItem in listCustomereObject)
            {
                var topTopCustomer = new OrderTopCustomerModel();
                var customer = listCustomer.FirstOrDefault(x => x.Id == customerItem.CustomerId);
                topTopCustomer.Cost = customerItem.Cost;
                topTopCustomer.CustomerName = customer?.FullName;
                topTopCustomer.Thumbnail = customer?.Thumbnail;
                topTopCustomer.Id = customer?.Id;
                listTopCustomer.Add(topTopCustomer);
            }

            var response = new AdminGetOrderTopSellingProductResponse()
            {
                ListTopSellingProduct = listTopSellingProduct.Select((b, index) => new OrderSellingProductModel
                {
                    No = index + 1,
                    TotalCost = b.TotalCost,
                    PriceName = b.PriceName,
                    ProductName = b.ProductName,
                    Quantity = b.Quantity,
                    Thumbnail = b.Thumbnail,
                    ProductId = b.ProductId
                }),
                ListTopCustomer = listTopCustomer.Select((b, index) => new OrderTopCustomerModel
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
