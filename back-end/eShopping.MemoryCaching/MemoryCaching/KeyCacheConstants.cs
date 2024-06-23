using System;

namespace eShopping.MemoryCaching
{
    public class KeyCacheConstants
    {
        public const string Prefix = "v1";

        public const string Permission = "Permission_userId:{0}";

        public const string Menu = "Menu";

        public const string CollectionPage = "CollectionPage_slugs:{0}";

        public const string SearchPage = "SearchPage_keySearch:{0}";
    }

    public class TimeCacheConstants
    {
        public static TimeSpan FiveMinutes => TimeSpan.FromMinutes(5);

        public static TimeSpan DateHour => TimeSpan.FromHours(1);

        public static TimeSpan DateDay => TimeSpan.FromHours(23);

        public static TimeSpan DateWeek => TimeSpan.FromDays(7);

        public static TimeSpan DateMonth => TimeSpan.FromDays(30);

        public static TimeSpan DateNull => TimeSpan.FromMinutes(5);
    }
}