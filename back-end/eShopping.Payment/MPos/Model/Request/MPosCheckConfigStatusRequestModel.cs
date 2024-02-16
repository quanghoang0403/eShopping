using System.ComponentModel.DataAnnotations;

namespace eShopping.Payment.MPos.Model.Request
{
	public class MPosCheckConfigStatusRequestModel
	{
		[Required]
		public string SecretKey { get; set; }

		[Required]
		public long MerchantId { get; set; }
	}
}
