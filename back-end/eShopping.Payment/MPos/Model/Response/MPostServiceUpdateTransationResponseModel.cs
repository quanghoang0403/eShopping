using eShopping.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace eShopping.Payment.MPos.Model.Response
{
	public class MPostServiceUpdateTransationResponseModel
	{
		public long MerchantId { get; set; }
		public EnumTransStatus TransStatus { get; set; }
		public string TransCode { get; set; }
		public long TransDate { get; set; }
		public long TransAmount { get; set; }
		public string IssuerCode { get; set; }
		public string Muid { get; set; }
		public string OrderId { get; set; }
		public string PosId { get; set; }
	}
}
