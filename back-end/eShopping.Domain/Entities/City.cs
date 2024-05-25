using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(City))]
    public class City
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(100)]
        public string Code { get; set; }

        [MaxLength(100)]
        public string Name { get; set; }

        public double? Lat { get; set; }

        public double? Lng { get; set; }

        public virtual ICollection<Customer> Customers { get; set; }

        public virtual ICollection<District> Districts { get; set; }

        public virtual ICollection<Ward> Wards { get; set; }
    }
}
