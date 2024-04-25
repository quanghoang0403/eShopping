using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(RefreshToken))]
    public class RefreshToken
    {
        [Key]
        public Guid AccountId { get; set; }

        public string Token { get; set; }

        public bool IsInvoked { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ExpiredDate { get; set; }
    }
}
