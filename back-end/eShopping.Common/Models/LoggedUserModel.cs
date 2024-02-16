using System;

namespace eShopping.Common.Models.User
{
    public class LoggedUserModel
    {
        public Guid? Id { get; set; } /// CustomerId or StaffId

        public Guid? AccountId { get; set; }

        public string Address { get; set; }

        public string Thumbnail { get; set; }

        public string StaffThumbnail { get; set; }

        public string AccountType { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PhoneNumber { get; set; }

        public bool NeverExpires { get; set; }

        public DateTime LoginDateTime { get; set; }
    }
}
