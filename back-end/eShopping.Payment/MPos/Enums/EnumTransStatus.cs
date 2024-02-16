namespace eShopping.Domain.Enums
{
    public enum EnumTransStatus
	{
		/// <summary>
		/// 0 : FAIL
		/// </summary>
		FAILED = 0,

		/// <summary>
		/// -1 : TRANSACTION_DOES_NOT_EXIST
		/// </summary>
		TRANSACTION_DOES_NOT_EXIST = -1,

		/// <summary>
		/// 100: SUCCESS
		/// </summary>
		SUCCESS = 100,

		/// <summary>
		/// 101: INVERSE_TRANSACTION
		/// </summary>
		INVERSE_TRANSACTION = 101,

		/// <summary>
		/// 102: CANCEL
		/// </summary>
		CANCEL = 102,

		/// <summary>
		/// 103: WAITING_SIGNATURE
		/// </summary>
		WAITING_SIGNATURE = 103,

		/// <summary>
		/// 104: SETTLEMENT_TRANSACTION
		/// </summary>
		SETTLEMENT_TRANSACTION = 104,
	}

	public static class EnumTransStatusExtensions
	{
		public static string GetName(this EnumTransStatus enums) => enums switch
		{
			EnumTransStatus.FAILED => "mPOS.message.paymentFailed",
			EnumTransStatus.TRANSACTION_DOES_NOT_EXIST => "mPOS.message.transactionDoesNotExist",
			EnumTransStatus.SUCCESS => "mPOS.message.paymentSuccessfully",
			EnumTransStatus.INVERSE_TRANSACTION => "mPOS.message.inverseTransaction",
			EnumTransStatus.CANCEL => "mPOS.message.paymentCancel",
			EnumTransStatus.WAITING_SIGNATURE => "mPOS.message.waitingSignature",
			EnumTransStatus.SETTLEMENT_TRANSACTION => "mPOS.message.settlementTransaction",
			_ => string.Empty
		};
	}
}
