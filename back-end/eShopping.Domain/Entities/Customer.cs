using eShopping.Domain.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Customer))]
    public class Customer : BaseEntity
    {
        public Guid AccountId { get; set; }

        public int? CityId { get; set; } // Province / city / town

        public int? DistrictId { get; set; } // District

        public int? WardId { get; set; } // ward

        [MaxLength(255)]
        public string Address { get; set; }

        public string Note { get; set; }

        public virtual City City { get; set; }

        public virtual District District { get; set; }

        public virtual Ward Ward { get; set; }

        public virtual Account Account { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}