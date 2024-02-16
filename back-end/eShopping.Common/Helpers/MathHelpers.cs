using System;

namespace eShopping.Common.Helpers
{
    public static class MathHelpers
    {
        /// <summary>
        /// Caculate distance from 2 points (Latitude-Longtitude)
        /// </summary>
        /// <param name="lat1">Point1 Lat</param>
        /// <param name="lng1">Point1 Lng</param>
        /// <param name="lat2">Point2 Lat</param>
        /// <param name="lng2">Point2 Lng</param>
        /// <returns>Distance from 2 points (Km)</returns>
        public static double CalculateDistanceBetweenTwoPoints(double lat1, double lng1, double lat2, double lng2)
        {
            return (6367 * Math.Acos(Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) * Math.Cos(ToRadians(lng2) - ToRadians(lng1)) + Math.Sin(ToRadians(lat1)) * Math.Sin(ToRadians(lat2))));
        }

        public static double ToRadians(double val)
        {
            return (Math.PI / 180) * val;
        }

        public static decimal ToRound(this decimal val, int index = 2)
        {
            var result = Math.Round(val, index);
            return result;
        }
    }
}