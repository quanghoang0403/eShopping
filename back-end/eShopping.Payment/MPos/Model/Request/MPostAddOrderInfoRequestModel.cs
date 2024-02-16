using System;
using System.ComponentModel.DataAnnotations;

namespace eShopping.Payment.MPos.Model.Request
{
	public class MPostAddOrderInfoRequestModel
	{
		public string OrderId { get; set; }

		public string PosId { get; set; }

		[Range(0, double.MaxValue)]
		public string Amount { get; set; }

		[MaxLength(128)]
		public string Description { get; set; }

		public string SecretKey { get; set; }

		public long MerchantId { get; set; }
	}
}
