using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(StaffPermissionGroup))]
    public class StaffPermissionGroup : BaseEntity
    {
        public Guid StaffId { get; set; }

        public Guid PermissionGroupId { get; set; }

        public virtual Staff Staff { get; set; }

        public virtual PermissionGroup PermissionGroup { get; set; }
    }
}
