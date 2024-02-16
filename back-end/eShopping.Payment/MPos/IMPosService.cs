using eShopping.Domain.Entities;
using eShopping.Payment.MPos.Model.Request;
using eShopping.Payment.MPos.Model.Response;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Payment.MPos
{
	public interface IMPosService
	{
		Task<PaymentConfig> GetConfigMPosAsync(Guid? storeId, Guid? branchId, string mPOSDeviceId, CancellationToken cancellationToken);

		Task<MPostAddOrderInfoResponseModel> CreateOrderInfoAsync(MPostAddOrderInfoRequestModel req);

		Task<MPostRemoveOrderInfoResponseModel> RemoveOrderInfoAsync(MPostRemoveOrderInfoRequestModel req);

		Task<MPostServiceUpdateTransationResponseModel> ServiceUpdateTransactionAsync(MPostRequestModel req);

		Task<MPosGetTransactionStatusResponseModel> GetTransactionStatusAsync(MPosGetTransactionStatusRequestModel req);

		Task<MPosCheckConfigResponseModel> CheckConfigAsync(MPosCheckConfigStatusRequestModel req);
	}
}
