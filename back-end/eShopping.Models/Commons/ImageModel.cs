using System;

namespace eShopping.Models.Commons
{
    public class ImageModel
    {
        public Guid? Id { get; set; }

        public int Priority { get; set; }

        public string ImagePath { get; set; }
    }
}
