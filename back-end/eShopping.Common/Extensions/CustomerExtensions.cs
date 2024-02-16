namespace eShopping.Common.Extensions
{
	public static class CustomerExtensions
	{
		public static string ToCustomerBarCode(this int customerCode, int barcodeLength)
		{
			var barcode = $"{customerCode}".PadLeft(barcodeLength, '0');

			return barcode;
		}
	}
}
