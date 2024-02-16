namespace eShopping.Payment.MPos.Model.Request
{
	public class MPostAddOrderInfoResponseModel
	{
		public int ResCode { get; set; }
		public string Message { get; set; }
		public AddOrderInfoModel Data { get; set; }
	}

	public class AddOrderInfoModel
	{
		public string OrderId { get; set; }
		public string PosId { get; set; }
		public string Amount { get; set; }
		public string Description { get; set; }
	}
}
