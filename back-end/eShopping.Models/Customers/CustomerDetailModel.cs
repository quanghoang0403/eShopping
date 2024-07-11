using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace eShopping.Models.Customers
{
    public class CustomerDetailModel
    {
        public Guid Id { get; set; }

        public int Code { get; set; }

        public string Email { get; set; }

        public string Thumbnail { get; set; }

        public string FullName { get; set; }

        public string PhoneNumber { get; set; }

        public DateTime? Birthday { get; set; }

        [Description("1.Male 2.Female 3.Other")]
        public EnumGender Gender { get; set; }

        public string Note { get; set; }

        public int? CityId { get; set; }

        public int? DistrictId { get; set; }

        public int? WardId { get; set; }

        public string Address { get; set; }

        public bool IsActive { get; set; }

        public ICollection<Order> Orders { get; set; }
    }
}