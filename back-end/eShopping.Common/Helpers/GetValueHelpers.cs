namespace eShopping.Common.Helpers
{
    public static class GetValueHelpers
	{
		/// <summary>
		/// Check value decimal
		/// </summary>
		/// <param name="input"></param>
		/// <returns></returns>
		public static decimal GetValueDecimal(decimal? input)
		{
			if (input == null || !input.HasValue) return 0;
			return input.Value;
		}

        public static decimal toDecimal(this decimal? input)
        {
            if (input == null || !input.HasValue) return 0;
            return input.Value;
        }
    }
}
