using System;

namespace eShopping.Models.Staff
{
    public class StaffModel
    {
        public string Code { get; set; }

        public string Name { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public bool Gender { get; set; }

        public DateTime? Birthday { get; set; }
    }
}