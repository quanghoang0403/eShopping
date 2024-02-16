namespace eShopping.Payment.MPos.Model.Response
{
	public class MPosGetTransactionStatusResponseModel
	{
		public int ResCode { get; set; }
		public string Message { get; set; }
		public TransactionStatusModel Data { get; set; }
	}

	public class TransactionStatusModel
	{
		public string OrderId { get; set; }
		public string PosId { get; set; }
		public string Amount { get; set; }
		public string TransStatus { get; set; }
		public string Pan { get; set; }
		public string AuthCode { get; set; }
		public string Rrn { get; set; }
		public string TransCode { get; set; }
		public string PaymentIdentifier { get; set; }
		public long TransDate { get; set; }
	}
}
