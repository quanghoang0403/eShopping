﻿using eShopping.Models.Permissions;
using System;
using System.Collections.Generic;

namespace eShopping.Models.Staffs
{
    public class StaffModel
    {
        public Guid Id { get; set; }

        public int No { get; set; }

        public IEnumerable<PermissionGroupModel> PermissionGroups { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }
    }
}