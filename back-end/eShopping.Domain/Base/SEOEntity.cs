using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace eShopping.Domain.Base
{
    public abstract class SEOEntity : BaseEntity
    {
        [MaxLength(255)]
        public string Title { get; set; }

        public string Content { get; set; }

        [MaxLength(2048)]
        [Description("SEO Configuration: URL Link")]
        public string UrlSEO { get; set; }

        [MaxLength(100)]
        [Description("SEO Configuration: SEO on Title")]
        public string TitleSEO { get; set; }

        [MaxLength(255)]
        [Description("SEO Configuration: SEO on Description")]
        public string DescriptionSEO { get; set; }

        [MaxLength(200)]
        public string Description { get; set; }

    }
}
