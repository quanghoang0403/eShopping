using eShopping.Common.Constants;
using Newtonsoft.Json.Linq;
using System;
using System.ComponentModel.DataAnnotations;

namespace eShopping.Payment.MPos.Model.Response
{
    public class MPostResonseModel
	{
		/// <summary>
		/// Response code
		/// </summary>
		/// <value>Type: int</value>
		/// 200: Success
		public int ResCode { get; set; }

		/// <summary>
		/// The message description corresponds to the resCode
		/// </summary>
		/// <value>Type: string</value>
		public string Message { get; set; }

		/// <summary>
		/// Is the Base64 of the encoded JSON string
		/// </summary>
		/// <value>Type: string</value>
		public string ResData { get; set; }
	}
}
