using System;

namespace eShopping.Common.Models
{
    public class LoggedUserModel
    {
        public Guid? Id { get; set; } /// CustomerId or StaffId

        public Guid? AccountId { get; set; }

        public string Thumbnail { get; set; }

        public string AccountType { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PhoneNumber { get; set; }
    }
}
