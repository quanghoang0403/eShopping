using eShopping.Domain.Enums;
using eShopping.Models.Permissions;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace eShopping.Models.Staffs
{
    public class AdminStaffDetailModel
    {
        public Guid Id { get; set; }

        public IEnumerable<AdminPermissionGroupModel> PermissionGroups { get; set; }

        public int Code { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public DateTime? Birthday { get; set; }

        [Description("1.Male 2.Female 3.Other")]
        public EnumGender Gender { get; set; }
    }
}