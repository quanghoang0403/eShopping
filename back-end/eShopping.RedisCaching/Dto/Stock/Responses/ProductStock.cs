namespace eShopping.RedisCaching.Dto.Stock.Responses
{
    public class ProductStock
    {
        public ProductStock(Guid productPriceId, int quantity)
        {
            ProductPriceId = productPriceId;
            Quantity = quantity;
        }

        public Guid ProductPriceId { get; set; }
        public int Quantity { get; set; }
    }
}