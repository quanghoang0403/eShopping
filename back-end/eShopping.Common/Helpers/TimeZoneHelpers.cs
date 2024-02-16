using System;
using System.Linq;

namespace eShopping.Common.Helpers
{
    public static class TimeZoneHelpers
    {
        /// <summary>
        /// Get time zone info by capital name of country
        /// </summary>
        /// <param name="capitalNameCountry"></param>
        /// <returns></returns>
        public static TimeZoneInfo GetTimeZoneInfo(string capitalNameCountry)
        {
            var systemTimeZones = TimeZoneInfo.GetSystemTimeZones();
            var timeZoneInfo = systemTimeZones.FirstOrDefault(x => x.DisplayName.ToLower().Contains(capitalNameCountry));

            return timeZoneInfo;
        }
    }
}
