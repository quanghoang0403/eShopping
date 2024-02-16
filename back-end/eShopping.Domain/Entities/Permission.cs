using eShopping.Domain.Base;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Permission))]
    public class Permission : BaseEntity
    {
        public Guid PermissionGroupId { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }

        public virtual PermissionGroup PermissionGroup { get; set; }


    }
}
