using System;

namespace eShopping.Models.Orders
{
    public class AdminOrderTopCustomerModel
    {
        public string CustomerName { get; set; }

        public int No { get; set; }

        public string Thumbnail { get; set; }

        public decimal Cost { get; set; }

        public Guid? Id { get; set; }

        public string PhoneCode { get; set; }

        public string PhoneNumber { get; set; }
    }
}
