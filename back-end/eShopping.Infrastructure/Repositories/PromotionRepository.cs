using eShopping.Domain.Entities;
using eShopping.Infrastructure.Contexts;
using eShopping.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace eShopping.Infrastructure.Repositories
{
    public class PromotionRepository : GenericRepository<Promotion>, IPromotionRepository
    {
        public PromotionRepository(eShoppingDbContext dbContext) : base(dbContext) { }

        public async Task<Promotion> GetPromotionByIdAsync(Guid id)
        {
            var promotion = await dbSet.Where(m => m.Id == id)
                // Include if needed
                .Include(discount => discount.PromotionProducts)
                    .ThenInclude(discountProduct => discountProduct.Product)
                    .ThenInclude(discountProduct => discountProduct.ProductPrices)
                .Include(discount => discount.PromotionProducts)
                    .ThenInclude(discountProduct => discountProduct.ProductPrice)
                    .ThenInclude(productPrice => productPrice.Product)
                .Include(p => p.PromotionProductCategories)
                    .ThenInclude(ppc => ppc.ProductCategory)
                .FirstOrDefaultAsync();
            if (promotion.PromotionProducts.Any(discountCodeProduct => discountCodeProduct.ProductId.HasValue))
            {
                var oldDiscountCodeProducts = promotion.PromotionProducts.Where(discountCodeProduct => discountCodeProduct.ProductId.HasValue && !discountCodeProduct.ProductPriceId.HasValue).ToList();
                foreach (var discountCodeProduct in oldDiscountCodeProducts)
                {
                    foreach (var productPrice in discountCodeProduct.Product.ProductPrices)
                    {
                        promotion.PromotionProducts.Add(new PromotionProduct
                        {
                            ProductId = productPrice.ProductId,
                            ProductPriceId = productPrice.Id,
                            ProductPrice = new ProductPrice()
                            {
                                Id = productPrice.Id,
                                PriceName = productPrice.PriceName,
                                Product = discountCodeProduct.Product
                            },
                            Product = discountCodeProduct.Product,
                        });
                    }
                }
            }
            return promotion;
        }
    }
}
