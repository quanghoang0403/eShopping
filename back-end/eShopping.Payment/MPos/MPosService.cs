using eShopping.Common.Extensions;
using eShopping.Domain.Entities;
using eShopping.Domain.Enums;
using eShopping.Domain.Settings;
using eShopping.Interfaces;
using eShopping.Payment.MPos.Model.Request;
using eShopping.Payment.MPos.Model.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace eShopping.Payment.MPos
{
	public class MPosService : IMPosService
	{
		private readonly AppSettings _appSettings;
		private readonly MPosSettings _mPosSettings;
		private readonly HttpClient _httpClient;
		private readonly IUnitOfWork _unitOfWork;

		public MPosService(
			IOptions<AppSettings> appSettings,
			HttpClient httpClient,
			IUnitOfWork unitOfWork)
		{
			_appSettings = appSettings.Value;
			_mPosSettings = _appSettings.PaymentSettings.MPosSettings;
			_httpClient = httpClient;
			_unitOfWork = unitOfWork;
		}

		public async Task<PaymentConfig> GetConfigMPosAsync(Guid? storeId, Guid? branchId, string mPOSDeviceId, CancellationToken cancellationToken)
		{
			var mPosConfig = await _unitOfWork.MPOSConfigs.Where(mPosConfig =>
				mPosConfig.StoreId == storeId
				&& mPosConfig.StoreBranchId == branchId
				&& mPosConfig.MPOSDeviceId == mPOSDeviceId
				&& mPosConfig.PaymentConfig != null)
				.Select(mPosConfig => new PaymentConfig
				{
					SecretKey = mPosConfig.PaymentConfig.SecretKey,
					MerchantId = mPosConfig.PaymentConfig.MerchantId
				})
				.FirstOrDefaultAsync(cancellationToken);
			return mPosConfig;
		}

		public async Task<MPostAddOrderInfoResponseModel> CreateOrderInfoAsync(MPostAddOrderInfoRequestModel req)
		{
			string serviceName = EnumServiceNameExtensions.GetName(EnumServiceName.ADD_ORDER_INFOR).ToString();
			string secretKey = req.SecretKey;
			long merchantId = req.MerchantId;

			string dataJson = new JObject
			{
				{ "orderId", req.OrderId },
				{ "posId", req.PosId },
				{ "serviceName", serviceName },
				{ "amount", req.Amount },
				{ "description", req.Description },
			}.ToString();
			string dataBase64Encode = SecurityExtensions.ConvertBase64EncodeWithSecretKey(dataJson, secretKey);
			string endpoint = _mPosSettings.MPosUrl;
			string requestData = new JObject
			{
				{ "merchantId", merchantId },
				{ "reqData", dataBase64Encode }
			}.ToString();
			string responseMessage = await HttpClientPostAsync(endpoint, requestData);
			MPostResonseModel resonseModel = JsonConvert.DeserializeObject<MPostResonseModel>(responseMessage);

			AddOrderInfoModel removeOrderInfoModel = new();
			if (resonseModel.ResData != null)
			{
				string dataBase64Decode = SecurityExtensions.ConvertBase64DecodeWithSecretKey(resonseModel.ResData, secretKey);
				removeOrderInfoModel = JsonConvert.DeserializeObject<AddOrderInfoModel>(dataBase64Decode);
			}
			MPostAddOrderInfoResponseModel result = new()
			{
				ResCode = resonseModel.ResCode,
				Message = resonseModel.Message,
				Data = removeOrderInfoModel
			};
			return result;
		}

		public async Task<MPostRemoveOrderInfoResponseModel> RemoveOrderInfoAsync(MPostRemoveOrderInfoRequestModel req)
		{
			string serviceName = EnumServiceNameExtensions.GetName(EnumServiceName.REMOVE_ORDER_INFOR).ToString();
			string secretKey = req.SecretKey;
			long merchantId = req.MerchantId;
			string dataJson = new JObject
			{
				{ "orderId", req.OrderId },
				{ "posId", req.PosId },
				{ "serviceName", serviceName },
				{ "amount", req.Amount }
			}.ToString();
			string dataBase64Encode = SecurityExtensions.ConvertBase64EncodeWithSecretKey(dataJson, secretKey);
			string endpoint = _mPosSettings.MPosUrl;
			string requestData = new JObject
			{
				{ "merchantId", merchantId },
				{ "reqData", dataBase64Encode }
			}.ToString();
			string responseMessage = await HttpClientPostAsync(endpoint, requestData);
			MPostResonseModel resonseModel = JsonConvert.DeserializeObject<MPostResonseModel>(responseMessage);

			RemoveOrderInfoModel removeOrderInfoModel = new();
			if (resonseModel.ResData != null)
			{
				string dataBase64Decode = SecurityExtensions.ConvertBase64DecodeWithSecretKey(resonseModel.ResData, secretKey);
				removeOrderInfoModel = JsonConvert.DeserializeObject<RemoveOrderInfoModel>(dataBase64Decode);
			}
			MPostRemoveOrderInfoResponseModel result = new()
			{
				ResCode = resonseModel.ResCode,
				Message = resonseModel.Message,
				Data = removeOrderInfoModel
			};
			return result;
		}

		public async Task<MPostServiceUpdateTransationResponseModel> ServiceUpdateTransactionAsync(MPostRequestModel req)
		{
			var secretKey = await _unitOfWork.PaymentConfigs
				.Where(paymentConfig => paymentConfig.MerchantId == req.MerchantId.ToString())
				.Select(paymentConfig => paymentConfig.SecretKey)
				.FirstOrDefaultAsync();

			string dataBase64Decode = SecurityExtensions.ConvertBase64DecodeWithSecretKey(req.ReqData, secretKey);
			MPostServiceUpdateTransationResponseModel model = JsonConvert.DeserializeObject<MPostServiceUpdateTransationResponseModel>(dataBase64Decode);
			return model;
		}

		public async Task<MPosGetTransactionStatusResponseModel> GetTransactionStatusAsync(MPosGetTransactionStatusRequestModel req)
		{
			string serviceName = EnumServiceNameExtensions.GetName(EnumServiceName.GET_TRANSACTION_STATUS).ToString();
			string secretKey = req.SecretKey;
			long merchantId = req.MerchantId;
			string dataJson = new JObject
			{
				{ "orderId", req.OrderId },
				{ "posId", req.PosId },
				{ "serviceName", serviceName },
				{ "amount", req.Amount },
			}.ToString();
			string dataBase64Encode = SecurityExtensions.ConvertBase64EncodeWithSecretKey(dataJson, secretKey);
			string endpoint = _mPosSettings.MPosUrl;
			string requestData = new JObject
			{
				{ "merchantId", merchantId },
				{ "reqData", dataBase64Encode }
			}.ToString();
			string responseMessage = await HttpClientPostAsync(endpoint, requestData);
			MPostResonseModel resonseModel = JsonConvert.DeserializeObject<MPostResonseModel>(responseMessage);
			TransactionStatusModel transactionStatusModel = new();
			if (resonseModel.ResData != null)
			{
				string dataBase64Decode = SecurityExtensions.ConvertBase64DecodeWithSecretKey(resonseModel.ResData, secretKey);
				transactionStatusModel = JsonConvert.DeserializeObject<TransactionStatusModel>(dataBase64Decode);
			}
			MPosGetTransactionStatusResponseModel result = new()
			{
				ResCode = resonseModel.ResCode,
				Message = resonseModel.Message,
				Data = transactionStatusModel
			};
			return result;
		}

		public async Task<MPosCheckConfigResponseModel> CheckConfigAsync(MPosCheckConfigStatusRequestModel req)
		{
			try
			{
				string serviceName = EnumServiceNameExtensions.GetName(EnumServiceName.GET_TRANSACTION_STATUS).ToString();
				string secretKey = req.SecretKey;
				long merchantId = req.MerchantId;
				string dataJson = new JObject
			{
				{ "orderId", "test" },
				{ "posId", "test" },
				{ "serviceName", serviceName },
				{ "amount", "1" },
			}.ToString();

				string dataBase64Encode = SecurityExtensions.ConvertBase64EncodeWithSecretKey(dataJson, secretKey);
				string endpoint = _mPosSettings.MPosUrl;
				string requestData = new JObject
			{
				{ "merchantId", merchantId },
				{ "reqData", dataBase64Encode }
			}.ToString();
				string responseMessage = await HttpClientPostAsync(endpoint, requestData);
				MPostResonseModel resonseModel = JsonConvert.DeserializeObject<MPostResonseModel>(responseMessage);

				MPosCheckConfigResponseModel result = new()
				{
					ResCode = resonseModel.ResCode,
					Message = resonseModel.Message,
				};
				return result;
			}
			catch (Exception ex)
			{
				MPosCheckConfigResponseModel result = new()
				{
					ResCode = (int)EnumMPosResCode.Invalid,
					Message = ex.Message,
				};
				return result;
			}
		}

		private async Task<string> HttpClientPostAsync(string url, string reqData)
		{
			string responseMessage = "";
			StringContent httpContent = new(reqData, Encoding.UTF8, "application/json");
			try
			{
				HttpResponseMessage httpResponseMessage = await _httpClient.PostAsync(url, httpContent);
				responseMessage = await httpResponseMessage.Content.ReadAsStringAsync();
			}
			catch (Exception ex)
			{
				Serilog.Log.Information(url);
				Serilog.Log.Information(reqData);
				Serilog.Log.Information(ex.Message);
				Serilog.Log.Information(JsonConvert.SerializeObject(ex));
			}
			return responseMessage;
		}

	}
}
