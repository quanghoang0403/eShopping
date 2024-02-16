namespace eShopping.Payment.PayPal.Common;
public class PayPalEndPoints
{
    public const string OAUTH2_TOKEN_V1 = "v1/oauth2/token";

    public const string GENERATE_CLIENT_TOKEN_V1 = "v1/identity/generate-token";

    public const string GET_USER_INFO_V1 = "v1/identity/oauth2/userinfo?schema=paypalv1.1";

    public const string TERMINATE_APP_TOKEN_V1 = "v1/oauth2/token/terminate";

    public const string CREATE_PAYMENT_V1 = "v1/payments/payment";

    public const string EXECUTE_PAYMENT_V1 = "v1/payments/payment/{paymentId}/execute";

    public const string GET_ORDER_DETAIL_V2 = "v2/checkout/orders/{id}";

    public const string CREATE_ORDER_V2 = "v2/checkout/orders";

    public const string UPDATE_ORDER_V2 = "v2/checkout/orders/{id}";

    public const string CONFIRM_ORDER_V2 = "v2/checkout/orders/{id}/confirm-payment-source";

    public const string AUTHORIZE_ORDER_V2 = "v2/checkout/v2/payments/authorizations/{authorization_id}";

    public const string CAPTURE_ORDER_V2 = "v2/checkout/orders/{order_id}/capture";

    public const string SHOW_DETAILS_AUTHORIZED_PAYMENT_V2 = "v2/payments/authorizations/{authorization_id}";

    public const string REAUTHORIZE_AUTHORIZED_PAYMENT_V2 = "v2/payments/authorizations/{authorization_id}/reauthorize";

    public const string WEBHOOK_RETURN_SUCCESS_PAYMENT_ENDPOINT_V1 = "api/payment/paypal/transfer/execute-payment";

    public const string WEBHOOK_RETURN_SUCCESS_PAYMENT_ENDPOINT_V2 = "api/payment/paypal/order/capture-order";

    public const string AUTHORIZED_PAYMENT_ENDPOINT_V2 = "v2/payments/authorizations/{authorizationId}/void";

    public const string CAPTURE_AUTHORIZED_PAYMENT_ENDPOINT_V2 = "v2/payments/authorizations/{authorizationId}/capture";

    public const string GET_CAPTURED_PAYMENT_DETAIL_ENDPOINT_V2 = "v2/payments/captures/{captureId}";

    public const string REFUND_CAPTURED_PAYMENT_ENDPOINT_V2 = "v2/payments/captures/{captureId}/refund";

    public const string GET_REFUND_DETAIL_ENDPOINT_V2 = "v2/payments/refunds/{refundId}";

    public const string SETUP_TOKEN_ENDPOINT_V3 = "v3/vault/setup-tokens";

    public const string RETRIEVE_SETUP_TOKEN_ENDPOINT_V3 = "v3/vault/setup-tokens/{setupTokenId}";

    public const string PAYMENT_TOKENS_ENDPOINT_V3 = "v3/vault/payment-tokens";

    public const string RETRIEVE_PAYMENT_TOKEN_ENDPOINT_V3 = "v3/vault/payment-tokens/{paymentTokenId}";

    public const string DELETE_PAYMENT_TOKEN_ENDPOINT_V3 = "v3/vault/payment-tokens/{paymentTokenId}";

    public const string LIST_ALL_PAYMENT_TOKEN_BY_CUSTOMER_ENDPOINT_V3 = "v3/vault/payment-tokens?customer_id={customerId}";
}
