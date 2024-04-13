using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(StaffPermission))]
    public class StaffPermission : BaseEntity
    {
        public Guid StaffId { get; set; }

        public Guid PermissionId { get; set; }

        public virtual Staff Staff { get; set; }

        public virtual Permission Permission { get; set; }
    }
}
