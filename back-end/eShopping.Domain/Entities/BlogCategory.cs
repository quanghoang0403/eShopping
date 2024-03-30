using eShopping.Domain.Base;
using eShopping.Domain.Enums;

namespace eShopping.Domain.Entities
{
    public class BlogCategory : SEOEntity
    {
        public int Priority { set; get; }
        public EnumColorCategory Color { get; set; }
    }
}
