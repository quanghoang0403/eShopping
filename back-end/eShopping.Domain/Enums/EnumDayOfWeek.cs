namespace eShopping.Domain.Enums
{
	public enum EnumDayOfWeek
	{
		//
		// Summary:
		//     Indicates Sunday.
		Sun = 0,
		//
		// Summary:
		//     Indicates Monday.
		Mon = 1,
		//
		// Summary:
		//     Indicates Tuesday.
		Tue = 2,
		//
		// Summary:
		//     Indicates Wednesday.
		Wed = 3,
		//
		// Summary:
		//     Indicates Thursday.
		Thu = 4,
		//
		// Summary:
		//     Indicates Friday.
		Fri = 5,
		//
		// Summary:
		//     Indicates Saturday.
		Sat = 6
	}

	public static class EnumDayOfWeekExtensions
	{
		public static string GetDayOfEn(this EnumDayOfWeek enums) => enums switch
		{
			EnumDayOfWeek.Sun => "Sunday",
			EnumDayOfWeek.Mon => "Monday",
			EnumDayOfWeek.Tue => "Tuesday",
			EnumDayOfWeek.Wed => "Wednesday",
			EnumDayOfWeek.Thu => "Thursday",
			EnumDayOfWeek.Fri => "Friday",
			EnumDayOfWeek.Sat => "Saturday",
			_ => string.Empty
		};

		public static string GetDayOfVi(this EnumDayOfWeek enums) => enums switch
		{
			EnumDayOfWeek.Sun => "Chủ nhật",
			EnumDayOfWeek.Mon => "Thứ 2",
			EnumDayOfWeek.Tue => "Thứ 3",
			EnumDayOfWeek.Wed => "Thứ 4",
			EnumDayOfWeek.Thu => "Thứ 5",
			EnumDayOfWeek.Fri => "Thứ 6",
			EnumDayOfWeek.Sat => "Thứ 7",
			_ => string.Empty
		};
	}
}
