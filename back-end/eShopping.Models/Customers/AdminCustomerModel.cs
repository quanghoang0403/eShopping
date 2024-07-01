using System;

namespace eShopping.Models.Customers
{
    public class AdminCustomerModel
    {
        public Guid Id { get; set; }

        public int No { get; set; }

        public int Code { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public bool IsActive { get; set; }
    }
}