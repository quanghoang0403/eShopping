using System;

namespace eShopping.Models.Permissions
{
    public class AdminPermissionGroupModel
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string CreatedByStaffName { get; set; }

        public int NumberOfMember { get; set; }
    }
}
