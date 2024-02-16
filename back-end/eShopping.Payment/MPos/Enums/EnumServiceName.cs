namespace eShopping.Domain.Enums
{
    public enum EnumServiceName
	{
		/// <summary>
		/// Add new order info
		/// </summary>
		ADD_ORDER_INFOR = 1,

		/// <summary>
		/// Remove order info
		/// </summary>
		REMOVE_ORDER_INFOR = 2,

		/// <summary>
		/// Update transaction
		/// </summary>
		SERVICE_UPDATE_TRANSACTION = 3,

		/// <summary>
		/// Get transaction status
		/// </summary>
		GET_TRANSACTION_STATUS = 4,
	}

    public static class EnumServiceNameExtensions
	{
        public static string GetName(this EnumServiceName enums) => enums switch
        {
			EnumServiceName.ADD_ORDER_INFOR => "ADD_ORDER_INFOR",
			EnumServiceName.REMOVE_ORDER_INFOR => "REMOVE_ORDER_INFOR",
			EnumServiceName.SERVICE_UPDATE_TRANSACTION => "SERVICE_UPDATE_TRANSACTION",
			EnumServiceName.GET_TRANSACTION_STATUS => "GET_TRANSACTION_STATUS",
			_ => string.Empty
        };
    }
}
