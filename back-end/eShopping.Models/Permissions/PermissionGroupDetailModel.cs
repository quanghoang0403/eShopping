using System;
using System.Collections.Generic;

namespace eShopping.Models.Permissions
{
    public class PermissionGroupDetailModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<PermissionModel> Permissions { get; set; }

    }
}
