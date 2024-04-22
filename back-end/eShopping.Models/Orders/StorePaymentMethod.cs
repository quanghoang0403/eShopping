using eShopping.Domain.Enums;

namespace eShopping.Models.Orders
{
    public class StorePaymentMethod
    {
        public EnumPaymentMethod Id { get; set; }
        public string Name { get { return Id.GetNameTranslate(); } }
        public string Icon { get { return Id.GetIcon(); } }
    }
}
