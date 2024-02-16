namespace eShopping.Payment.MPos.Model.Response
{
	public class MPostRemoveOrderInfoResponseModel
	{
		public int ResCode { get; set; }
		public string Message { get; set; }
		public RemoveOrderInfoModel Data { get; set; }
	}

	public class RemoveOrderInfoModel
	{
		public string OrderId { get; set; }
		public string PosId { get; set; }
		public string Amount { get; set; }
	}
}
