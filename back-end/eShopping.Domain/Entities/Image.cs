using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace eShopping.Domain.Entities
{
    [Table(nameof(Image))]
    public class Image : BaseEntity
    {
        public Guid ObjectId { get; set; }

        public EnumImageTypeObject ImageType { get; set; }

        public int SortOrder { get; set; }

        public string ImagePath { get; set; }
    }
}
