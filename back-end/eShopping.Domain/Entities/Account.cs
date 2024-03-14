using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Account))]
    public class Account : BaseEntity
    {
        [MaxLength(50)]
        public string Email { get; set; }

        [MaxLength(500)]
        public string Password { get; set; }

        public bool EmailConfirmed { get; set; }

        public bool IsActivated { get; set; }

        [MaxLength(50)]
        public string PhoneNumber { get; set; }

        [MaxLength(250)]
        public string FullName { get; set; }

        public string Thumbnail { get; set; }

        public DateTime? Birthday { get; set; }

        [Description("1.Male 2.Female 3.Other")]
        public EnumGender Gender { get; set; }

        public EnumAccountType AccountType { get; set; }

        /// <summary>
        /// The database generates a value when a row is inserted.
        /// </summary>
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Code { get; set; }

        public virtual ICollection<Customer> Customer { get; set; }

    }
}