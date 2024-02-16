namespace eShopping.Domain.Enums
{
    public enum EnumCardType
	{
		/// <summary>
		/// VISA
		/// </summary>
		VISA = 1,

		/// <summary>
		/// MASTER
		/// </summary>
		MASTER = 2,

		/// <summary>
		/// DOMESTIC
		/// </summary>
		DOMESTIC = 3,

		/// <summary>
		/// NAPAS
		/// </summary>
		NAPAS = 4,
	}

    public static class EnumCardTypeExtensions
	{
        public static string GetName(this EnumCardType enums) => enums switch
        {
			EnumCardType.VISA => "VISA",
			EnumCardType.MASTER => "MASTER",
			EnumCardType.DOMESTIC => "DOMESTIC",
			EnumCardType.NAPAS => "NAPAS",
			_ => string.Empty
        };
    }
}
