using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(District))]
    public class District
    {
        [Key]
        public int Id { get; set; }

        public int CityId { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        public string Prefix { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        public virtual ICollection<Customer> Customers { get; set; }

    }
}
