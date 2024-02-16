using System.ComponentModel.DataAnnotations;

namespace eShopping.Domain.Entities
{
    public class AppConfig
    {
        [Key]
        public string Key { get; set; }

        public string Value { get; set; }
    }
}
