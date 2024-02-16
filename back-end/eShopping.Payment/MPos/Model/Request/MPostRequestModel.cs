using System.ComponentModel.DataAnnotations;

namespace eShopping.Payment.MPos.Model.Request
{
	public class MPostRequestModel
	{
		/// <summary>
		/// Definition code of unit on MPOS system
		/// </summary>
		/// <value>Type: long</value>
		[Required]
		public long MerchantId { get; set; }

		/// <summary>
		/// Is the Base64 of the encoded JSON string
		/// </summary>
		/// <value>Type: string</value>
		[Required]
		public string ReqData { get; set; }
	}
}
