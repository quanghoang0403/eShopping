using System.ComponentModel.DataAnnotations;

namespace eShopping.Payment.MPos.Model.Request
{
	public class MPostRemoveOrderInfoRequestModel
	{
		public string OrderId { get; set; }

		public string PosId { get; set; }

		[Range(0, double.MaxValue)]
		public string Amount { get; set; }

		public string SecretKey { get; set; }

		public long MerchantId { get; set; }
	}
}
