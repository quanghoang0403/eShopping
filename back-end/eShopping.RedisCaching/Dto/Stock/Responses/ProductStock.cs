namespace eShopping.RedisCaching.Dto.Stock.Responses
{
    public class ProductStock
    {
        public ProductStock(Guid productVariantId, int quantity)
        {
            ProductVariantId = productVariantId;
            Quantity = quantity;
        }

        public Guid ProductVariantId { get; set; }
        public int Quantity { get; set; }
    }
}