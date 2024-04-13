using eShopping.Domain.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Staff))]
    public class Staff : BaseEntity
    {
        public Guid AccountId { get; set; }

        public virtual Account Account { get; set; }

        public virtual ICollection<StaffPermission> StaffPermissions { get; set; }

    }
}