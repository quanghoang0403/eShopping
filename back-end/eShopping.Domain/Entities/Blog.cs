using eShopping.Domain.Base;
using eShopping.Domain.Enums;
using System;

namespace eShopping.Domain.Entities
{
    public class Blog : SEOEntity
    {
        public int ViewCount { set; get; }
        public EnumStatus Status { get; set; }
        public DateTime? PublishedTime { get; set; }
        public int Priority { set; get; }
        public string Thumbnail { set; get; }


    }
}
