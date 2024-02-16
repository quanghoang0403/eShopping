﻿using System;
using System.Collections.Generic;

namespace eShopping.Models.Common.Permission
{
    public class PermissionGroupModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public virtual IEnumerable<PermissionModel> Permissions { get; set; }
    }
}
