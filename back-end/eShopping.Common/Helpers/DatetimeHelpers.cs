//using eShopping.Common.Constants;
//using eShopping.Domain.Enums;
//using System;

//namespace eShopping.Common.Helpers
//{
//	public static class DatetimeHelpers
//	{

//		public static DateTime GetStartOfYesterday(DateTime date, string timeZone = "")
//		{
//			DateTime yesterday = date.AddDays(-1);
//			return GetStartOfDay(yesterday, timeZone);
//		}

//		public static DateTime GetEndOfYesterday(DateTime date, string timeZone = "")
//		{
//			DateTime yesterday = date.AddDays(-1);
//			return GetEndOfDay(yesterday, timeZone);
//		}

//		public static DateTime GetStartOfThisWeek(DateTime date, string timeZone = "")
//		{
//			DateTime today = date;
//			int diff = (int)today.DayOfWeek - 1;
//			DateTime startOfWeek = today.AddDays(-diff);
//			return GetStartOfDay(startOfWeek, timeZone);
//		}

//		public static DateTime GetEndOfThisWeek(DateTime date, string timeZone = "")
//		{
//			DateTime today = date;
//			int diff = ((int)DayOfWeek.Saturday - (int)today.DayOfWeek) + 1;
//			DateTime endOfWeek = today.AddDays(diff);
//			return GetEndOfDay(endOfWeek, timeZone);
//		}

//		public static DateTime GetStartOfLastWeek(DateTime date, string timeZone = "")
//		{
//			DateTime startOfThisWeek = GetStartOfThisWeek(date, timeZone);
//			DateTime startOfLastWeek = startOfThisWeek.AddDays(-7);
//			return GetStartOfDay(startOfLastWeek, timeZone);
//		}

//		public static DateTime GetEndOfLastWeek(DateTime date, string timeZone = "")
//		{
//			DateTime endOfThisWeek = GetEndOfThisWeek(date, timeZone);
//			DateTime endOfLastWeek = endOfThisWeek.AddDays(-7);
//			return GetEndOfDay(endOfLastWeek, timeZone);
//		}

//		public static DateTime GetStartOfThisMonth(DateTime date, string timeZone = "")
//		{
//			DateTime today = date;
//			DateTime startOfMonth = new(today.Year, today.Month, 1);
//			return GetStartOfDay(startOfMonth, timeZone);
//		}

//		public static DateTime GetEndOfThisMonth(DateTime date, string timeZone = "")
//		{
//			DateTime startOfNextMonth = GetStartOfThisMonth(date, timeZone).AddMonths(1);
//			DateTime endOfMonth = startOfNextMonth.AddDays(-1);
//			return GetEndOfDay(endOfMonth, timeZone);
//		}

//		public static DateTime GetStartOfLastMonth(DateTime date, string timeZone = "")
//		{
//			DateTime startOfThisMonth = GetStartOfThisMonth(date, timeZone);
//			DateTime startOfLastMonth = startOfThisMonth.AddMonths(-1);
//			return GetStartOfDay(startOfLastMonth, timeZone);
//		}

//		public static DateTime GetEndOfLastMonth(DateTime date, string timeZone = "")
//		{
//			DateTime startOfThisMonth = GetStartOfThisMonth(date, timeZone);
//			DateTime endOfLastMonth = startOfThisMonth.AddDays(-1);
//			return GetEndOfDay(endOfLastMonth, timeZone);
//		}

//		public static DateTime GetStartOfThisYear(DateTime date, string timeZone = "")
//		{
//			DateTime today = date;
//			DateTime startOfYear = new(today.Year, 1, 1);
//			return GetStartOfDay(startOfYear, timeZone);
//		}

//		public static DateTime GetEndOfThisYear(DateTime date, string timeZone = "")
//		{
//			DateTime startOfNextYear = GetStartOfThisYear(date, timeZone).AddYears(1);
//			DateTime endOfYear = startOfNextYear.AddDays(-1);
//			return GetEndOfDay(endOfYear, timeZone);
//		}

//		public static DateTime GetStartOfLastYear(DateTime date, string timeZone = "")
//		{
//			DateTime startOfThisYear = GetStartOfThisYear(date, timeZone);
//			DateTime startOfLastYear = startOfThisYear.AddYears(-1);
//			return GetStartOfDay(startOfLastYear);
//		}

//		public static DateTime GetEndOfLastYear(DateTime date, string timeZone = "")
//		{
//			DateTime startOfThisYear = GetStartOfThisYear(date, timeZone);
//			DateTime endOfLastYear = startOfThisYear.AddTicks(-1);
//			return GetEndOfDay(endOfLastYear);
//		}

//		public static long ConvertToTimestamp(DateTime value)
//		{
//			long epoch = (value.Ticks - 621355968000000000) / 10000000;
//			return epoch;
//		}

//		public static string DayOfWeekOfVN(DateTime dt)
//		{
//			string result = "";
//			DayOfWeek dw = dt.DayOfWeek;
//			switch (dw)
//			{
//				case (DayOfWeek)EnumDayOfWeek.Mon:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Mon);
//					break;

//				case (DayOfWeek)EnumDayOfWeek.Tue:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Tue);
//					break;

//				case (DayOfWeek)EnumDayOfWeek.Wed:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Wed);
//					break;

//				case (DayOfWeek)EnumDayOfWeek.Thu:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Thu);
//					break;

//				case (DayOfWeek)EnumDayOfWeek.Fri:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Fri);
//					break;

//				case (DayOfWeek)EnumDayOfWeek.Sat:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Sat);
//					break;

//				case (DayOfWeek)EnumDayOfWeek.Sun:
//					result = EnumDayOfWeekExtensions.GetDayOfVi(EnumDayOfWeek.Sun);
//					break;
//			}
//			return (result);
//		}
//	}
//}
